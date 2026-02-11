import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { isSuperAdmin } from '@/lib/admin';

export async function GET(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ isSuperAdmin: false });
    }

    const isSuper = await isSuperAdmin(user.id);
    return NextResponse.json({ isSuperAdmin: isSuper });
}
