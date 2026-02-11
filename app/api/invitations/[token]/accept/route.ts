import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { acceptInvitation } from '@/lib/invitations';

export async function POST(
    request: Request,
    { params }: { params: { token: string } }
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const organizationId = await acceptInvitation(params.token, user.id);
        return NextResponse.json({ success: true, organizationId });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 400 });
    }
}
