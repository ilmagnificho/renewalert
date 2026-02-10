'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function Header() {
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    return (
        <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-6 md:hidden">
            {/* Mobile Header Content handled in sidebar component mostly, this is kept for strict structure if needed, but currently layout uses sidebar for mobile nav. 
          Actually, let's make this invisible on mobile as sidebar handles it, or just use it for desktop user profile? 
          The previous design had a header. Let's make a minimal Desktop Header for user profile. */}
        </header>
    );
}
