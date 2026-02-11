'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient, hasSupabaseBrowserEnv } from '@/lib/supabase/client';

interface SuperAdminContextType {
    isSuperAdmin: boolean;
    isLoading: boolean;
}

const SuperAdminContext = createContext<SuperAdminContextType>({
    isSuperAdmin: false,
    isLoading: true,
});

export function SuperAdminProvider({ children }: { children: React.ReactNode }) {
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    async function checkStatus() {
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const res = await fetch('/api/admin/check');
                if (res.ok) {
                    const data = await res.json();
                    setIsSuperAdmin(data.isSuperAdmin);
                }
            }
        } catch (e) {
            console.error('Failed to check super admin status', e);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (!hasSupabaseBrowserEnv()) {
            setIsLoading(false);
            return;
        }

        void checkStatus();
    }, []);

    return (
        <SuperAdminContext.Provider value={{ isSuperAdmin, isLoading }}>
            {children}
        </SuperAdminContext.Provider>
    );
}

export const useSuperAdmin = () => useContext(SuperAdminContext);
