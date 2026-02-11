'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Organization } from '@/types/database';

interface OrganizationContextType {
    organization: Organization | null;
    role: 'owner' | 'admin' | 'member' | null;
    isAdmin: boolean;
    isLoading: boolean;
    refetch: () => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextType>({
    organization: null,
    role: null,
    isAdmin: false,
    isLoading: true,
    refetch: async () => { },
});

export function OrganizationProvider({ children }: { children: React.ReactNode }) {
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [role, setRole] = useState<'owner' | 'admin' | 'member' | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchOrganization = async () => {
        const supabase = createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setIsLoading(false);
            return;
        }

        const { data, error } = await supabase
            .from('organization_members')
            .select(`
        role,
        organization:organizations(*)
      `)
            .eq('user_id', user.id)
            .single();

        if (error) {
            // Backward compatibility: org tables may not exist yet in some environments.
            if (error.code === '42P01') {
                setOrganization(null);
                setRole(null);
                setIsLoading(false);
                return;
            }

            setIsLoading(false);
            return;
        }

        if (data) {
            setOrganization(data.organization as Organization);
            setRole(data.role as 'owner' | 'admin' | 'member');
        }
        setIsLoading(false);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            void fetchOrganization();
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    const isAdmin = role === 'owner' || role === 'admin';

    return (
        <OrganizationContext.Provider
            value={{
                organization,
                role,
                isAdmin,
                isLoading,
                refetch: fetchOrganization,
            }}
        >
            {children}
        </OrganizationContext.Provider>
    );
}

export const useOrganization = () => useContext(OrganizationContext);
