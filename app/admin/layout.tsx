'use client';

import { useSuperAdmin } from '@/contexts/SuperAdminContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { isSuperAdmin, isLoading } = useSuperAdmin();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isSuperAdmin) {
            router.push('/dashboard');
        }
    }, [isLoading, isSuperAdmin, router]);

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>;
    }

    if (!isSuperAdmin) {
        return null; // Will redirect
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="font-bold text-xl text-primary">RenewAlert Admin</div>
                    <nav className="flex gap-4 text-sm">
                        <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">Exit to App</Link>
                    </nav>
                </div>
            </header>
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
}
