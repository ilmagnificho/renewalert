'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient, hasSupabaseBrowserEnv } from '@/lib/supabase/client';
import { Organization } from '@/types/database';

type OrganizationMemberRow = {
    role: 'owner' | 'admin' | 'member';
    organization: Organization | Organization[] | null;
};

interface OrganizationContextType {
    organization: Organization | null;
    role: 'owner' | 'admin' | 'member' | null;
    isAdmin: boolean;
    isLoading: boolean;
    refetch: () => Promise<void>;
}

const ORG_SCHEMA_UNAVAILABLE_KEY = 'renewalert_org_schema_unavailable';

const OrganizationContext = createContext<OrganizationContextType>({
    organization: null,
    role: null,
    isAdmin: false,
    isLoading: true,
    refetch: async () => { },
});

function isOrgSchemaMissing(error: { code?: string; message?: string } | null) {
    if (!error) return false;

    const code = error.code || '';
    const message = (error.message || '').toLowerCase();

    return (
        code === '42P01' || // postgres: relation does not exist
        code === 'PGRST205' || // postgrest: table or schema unavailable
        message.includes('organization_members') && message.includes('does not exist')
    );
}

export function OrganizationProvider({ children }: { children: React.ReactNode }) {
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [role, setRole] = useState<'owner' | 'admin' | 'member' | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchOrganization = async () => {
        if (!hasSupabaseBrowserEnv()) {
            setOrganization(null);
            setRole(null);
            setIsLoading(false);
            return;
        }

        const supabase = createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setOrganization(null);
            setRole(null);
            setIsLoading(false);
            return;
        }

        if (typeof window !== 'undefined' && window.sessionStorage.getItem(ORG_SCHEMA_UNAVAILABLE_KEY) === '1') {
            setOrganization(null);
            setRole(null);
            setIsLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('organization_members')
                .select(`
          role,
          organization:organizations(*)
        `)
                .eq('user_id', user.id)
                .maybeSingle<OrganizationMemberRow>();

            if (error) {
                if (isOrgSchemaMissing(error)) {
                    if (typeof window !== 'undefined') {
                        window.sessionStorage.setItem(ORG_SCHEMA_UNAVAILABLE_KEY, '1');
                    }

                    setOrganization(null);
                    setRole(null);
                    setIsLoading(false);
                    return;
                }

                setIsLoading(false);
                return;
            }

            if (data) {
                const normalizedOrg = Array.isArray(data.organization)
                    ? data.organization[0] ?? null
                    : data.organization;

                setOrganization(normalizedOrg);
                setRole(data.role);
            } else {
                setOrganization(null);
                setRole(null);
            }
        } catch {
            setOrganization(null);
            setRole(null);
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
