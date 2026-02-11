import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ token: string }> }
) {
    const { token } = await params;
    const supabase = createAdminClient();

    // Fetch invitation with organization name
    const { data, error } = await supabase
        .from('invitations')
        .select('email, role, organization:organizations(name), expires_at, accepted_at')
        .eq('token', token)
        .single();

    if (error || !data) {
        return NextResponse.json({ error: '유효하지 않은 초대입니다.' }, { status: 404 });
    }

    if (data.accepted_at) {
        return NextResponse.json({ error: '이미 수락된 초대입니다.' }, { status: 410 });
    }

    if (new Date(data.expires_at) < new Date()) {
        return NextResponse.json({ error: '만료된 초대입니다.' }, { status: 410 });
    }

    return NextResponse.json({
        email: data.email,
        role: data.role,
        organization: data.organization,
    });
}
