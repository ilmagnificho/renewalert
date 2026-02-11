'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Organization, OrganizationMember } from '@/types/database';

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

        const { data } = await supabase
            .from('organization_members')
            .select(`
        role,
        organization:organizations(*)
      `)
            .eq('user_id', user.id)
            .single();

        if (data) {
            setOrganization(data.organization as any as Organization);
            setRole(data.role as 'owner' | 'admin' | 'member');
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchOrganization();
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
