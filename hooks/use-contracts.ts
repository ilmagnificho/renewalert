import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Contract } from '@/types/database';
import { useOrganization } from '@/contexts/OrganizationContext';

export function useContracts() {
    const { organization } = useOrganization();
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!organization) {
            setContracts([]);
            setIsLoading(false);
            return;
        }

        async function fetchContracts() {
            const supabase = createClient();

            const { data, error } = await supabase
                .from('contracts')
                .select('*')
                .eq('organization_id', organization.id)
                .order('expires_at', { ascending: true });

            if (data) {
                setContracts(data as any as Contract[]);
            }
            setIsLoading(false);
        }

        fetchContracts();
    }, [organization]);

    return { contracts, isLoading };
}
