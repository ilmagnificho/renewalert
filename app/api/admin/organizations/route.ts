import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { isSuperAdmin } from '@/lib/admin';

export async function GET(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isSuper = await isSuperAdmin(user.id);
    if (!isSuper) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch organizations with counts
    const { data, error } = await supabase
        .from('organizations')
        .select(`
            *,
            members:organization_members(count),
            contracts:contracts(count)
        `)
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform data to cleaner format
    const organizations = (data ?? []).map((org: { members: Array<{ count: number }>; contracts: Array<{ count: number }> } & Record<string, unknown>) => ({
        ...org,
        memberCount: org.members[0].count,
        contractCount: org.contracts[0].count,
    }));

    return NextResponse.json(organizations);
}
