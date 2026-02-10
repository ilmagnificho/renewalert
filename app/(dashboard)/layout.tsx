import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { ToastProvider } from '@/components/ui/toast';

export const dynamic = 'force-dynamic';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ToastProvider>
            <div className="min-h-screen bg-dark-bg">
                <Sidebar />
                <div className="lg:ml-60">
                    <Header />
                    <main className="p-4 lg:p-6 pb-20 lg:pb-6">
                        {children}
                    </main>
                </div>
            </div>
        </ToastProvider>
    );
}
