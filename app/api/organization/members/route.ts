import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's organization
    const { data: member } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user.id)
        .single();

    if (!member) {
        return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    // List members with user details
    const { data, error } = await supabase
        .from('organization_members')
        .select('*, user:users(email, name)')
        .eq('organization_id', member.organization_id)
        .order('role', { ascending: true }); // owner, admin, member (alphabetical?) no, enum order might differ but ok for now

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
