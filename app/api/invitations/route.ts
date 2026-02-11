import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { createInvitation } from '@/lib/invitations';

export async function GET(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's organization
    const { data: member } = await supabase
        .from('organization_members')
        .select('organization_id, role')
        .eq('user_id', user.id)
        .single();

    if (!member) {
        return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    if (member.role === 'member') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('organization_id', member.organization_id)
        .is('accepted_at', null)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

export async function POST(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's organization
    const { data: member } = await supabase
        .from('organization_members')
        .select('organization_id, role')
        .eq('user_id', user.id)
        .single();

    if (!member) {
        return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    if (member.role === 'member') {
        return NextResponse.json({ error: 'Only admins can invite members' }, { status: 403 });
    }

    const body = await request.json();
    const { email, role } = body;

    try {
        const invitation = await createInvitation(member.organization_id, email, role || 'member', user.id);
        // Here you would send the email via an email service (e.g. Resend, SES)
        // For MVP/Demo, we just return the link or token
        // In real app: await sendInvitationEmail(email, invitation.token);

        return NextResponse.json(invitation);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 400 });
    }
}
