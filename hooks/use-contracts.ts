import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Contract } from '@/types/database';
import { useOrganization } from '@/contexts/OrganizationContext';

export function useContracts() {
    const { organization, isLoading: isOrgLoading } = useOrganization();
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isOrgLoading) return;

        async function fetchContracts() {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setContracts([]);
                setIsLoading(false);
                return;
            }

            let query = supabase
                .from('contracts')
                .select('*')
                .order('expires_at', { ascending: true });

            if (organization) {
                query = query.eq('organization_id', organization.id);
            } else {
                // Backward compatibility: fall back to per-user contracts when org schema is unavailable.
                query = query.eq('user_id', user.id);
            }

            const { data, error } = await query;

            if (!error && data) {
                setContracts(data as Contract[]);
            } else {
                setContracts([]);
            }

            setIsLoading(false);
        }

        void fetchContracts();
    }, [organization, isOrgLoading]);

    return { contracts, isLoading };
}
