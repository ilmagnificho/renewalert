'use client';

import { Link } from '@/i18n/navigation';
import { usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from '@/i18n/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useOrganization } from '@/contexts/OrganizationContext';
import { useSuperAdmin } from '@/contexts/SuperAdminContext';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export function Sidebar() {
    const t = useTranslations('Sidebar');
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    const { organization, role } = useOrganization();
    const { isSuperAdmin } = useSuperAdmin();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { href: '/dashboard', label: t('home'), icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { href: '/contracts', label: t('contracts'), icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
        { href: '/pricing', label: t('pricing'), icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
        { href: '/settings', label: t('settings'), icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    ];

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        // Clear guest mode cookie
        document.cookie = "guest_mode=; path=/; max-age=0";
        router.push('/');
        router.refresh();
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 left-0 bg-background border-r border-border z-50">
                <Link href="/" className="h-20 flex items-center justify-between px-6 border-b border-zinc-900/60 hover:bg-zinc-900/10 transition-colors">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-200">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </div>
                        <div className="flex flex-col leading-tight">
                            <span className="text-xl font-black tracking-[0.01em] text-white">
                                Renew<span className="text-red-400">Alert</span>
                            </span>
                            {organization ? (
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-zinc-400 font-semibold tracking-wide truncate max-w-[140px]">{organization.name}</span>
                                    <span className="text-[9px] text-zinc-500 capitalize">{role}</span>
                                </div>
                            ) : (
                                <span className="text-[10px] text-zinc-400 font-semibold tracking-wide">반복 지출 통제 시스템</span>
                            )}
                        </div>
                    </div>
                </Link>

                <div className="flex-1 flex flex-col justify-between py-6 px-4">
                    <nav className="space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                    pathname.startsWith(item.href)
                                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                )}
                            >
                                <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                </svg>
                                {item.label}
                            </Link>
                        ))}
                        {isSuperAdmin && (
                            <Link
                                href="/admin"
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
                            >
                                <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                {t('admin')}
                            </Link>
                        )}
                    </nav>

                    <div className="space-y-4">
                        <Link href="/contracts/new">
                            <Button className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border">
                                {t('addContract')}
                            </Button>
                        </Link>

                        <div className="flex justify-center py-2">
                            <LanguageSwitcher />
                        </div>

                        <button
                            onClick={handleSignOut}
                            className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        >
                            <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            {t('signOut')}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Header & Nav */}
            <Link href="/" className="md:hidden fixed top-0 w-full z-40 bg-background/80 backdrop-blur-md border-b border-border h-16 px-4 flex items-center justify-between">
                <div className="flex items-center gap-2 group cursor-pointer">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
                        <span className="text-primary-foreground font-bold text-lg">R</span>
                    </div>
                    <span className="font-bold text-xl text-foreground">Renew<span className="text-red-400">Alert</span></span>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsMobileMenuOpen(!isMobileMenuOpen); }} className="text-muted-foreground p-2 hover:bg-accent rounded-lg transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                        </svg>
                    </button>
                </div>
            </Link>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 top-16 z-30 bg-background px-4 py-6 animate-in slide-in-from-top-5">
                    <nav className="space-y-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors",
                                    pathname.startsWith(item.href)
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground bg-accent/50"
                                )}
                            >
                                <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                </svg>
                                {item.label}
                            </Link>
                        ))}
                        <Link href="/contracts/new" onClick={() => setIsMobileMenuOpen(false)}>
                            <Button className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border mt-4 h-12">
                                + 계약 추가
                            </Button>
                        </Link>
                        <button
                            onClick={handleSignOut}
                            className="flex w-full items-center gap-3 px-4 py-3 mt-4 text-base font-medium text-destructive bg-destructive/10 rounded-xl"
                        >
                            <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            로그아웃
                        </button>
                    </nav>
                </div>
            )}
        </>
    );
}
