import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { revokeInvitation } from '@/lib/invitations';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ token: string }> }
) {
    const { token } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's organization role to verify permission
    const { data: member } = await supabase
        .from('organization_members')
        .select('role')
        .eq('user_id', user.id)
        .single();

    if (!member || member.role === 'member') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        await revokeInvitation(token);
        return NextResponse.json({ success: true });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Failed to revoke invitation';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
