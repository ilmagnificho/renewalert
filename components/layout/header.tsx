'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';

export function Header() {
    const router = useRouter();
    const supabase = createClient();
    const [user, setUser] = useState<User | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
        });
    }, [supabase.auth]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    return (
        <header className="h-16 bg-dark-card border-b border-dark-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
            {/* Mobile Logo */}
            <div className="flex items-center gap-2 lg:hidden">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                </div>
                <span className="text-lg font-bold">갱신알림</span>
            </div>

            {/* Spacer for desktop */}
            <div className="hidden lg:block" />

            {/* User Menu */}
            <div className="relative">
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-dark-hover transition-colors cursor-pointer"
                >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                            {user?.email?.[0]?.toUpperCase() || 'U'}
                        </span>
                    </div>
                    <span className="hidden sm:block text-sm text-text-secondary max-w-[150px] truncate">
                        {user?.email || ''}
                    </span>
                    <svg className="w-4 h-4 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {isDropdownOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                        <div className="absolute right-0 mt-2 w-48 bg-dark-card border border-dark-border rounded-lg shadow-xl z-20 overflow-hidden">
                            <div className="p-3 border-b border-dark-border">
                                <p className="text-sm font-medium truncate">{user?.email}</p>
                                <p className="text-xs text-text-tertiary mt-0.5">Free 플랜</p>
                            </div>
                            <div className="p-1">
                                <button
                                    onClick={() => { setIsDropdownOpen(false); router.push('/settings'); }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-dark-hover rounded-md transition-colors cursor-pointer"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    설정
                                </button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start text-danger hover:text-danger"
                                    onClick={handleLogout}
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    로그아웃
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </header>
    );
}
