import { Sidebar } from '@/components/layout/sidebar';
import { ToastProvider } from '@/components/ui/toast';

export const dynamic = 'force-dynamic';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-100">
            <Sidebar />
            <div className="flex-1 flex flex-col md:pl-64 transition-all duration-300">
                <main className="flex-1 p-6 md:p-8 pt-20 md:pt-8 max-w-6xl mx-auto w-full">
                    <ToastProvider>
                        {children}
                    </ToastProvider>
                </main>
            </div>
        </div>
    );
}
