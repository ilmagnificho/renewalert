import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function GET(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'expires_at';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    let query = supabase
        .from('contracts')
        .select('*')
        .eq('user_id', user.id);

    if (type && type !== 'all') {
        query = query.eq('type', type);
    }

    if (status && status !== 'all') {
        query = query.eq('status', status);
    }

    if (search) {
        query = query.ilike('name', `%${search}%`);
    }

    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    const { data, error } = await query;

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

    // Check tier-based plan limits
    const { data: profile } = await supabase
        .from('users')
        .select('plan')
        .eq('id', user.id)
        .single();

    const currentPlan = profile?.plan || 'free';
    const { getPlanLimits } = await import('@/lib/utils');
    const limits = getPlanLimits(currentPlan);

    const { count } = await supabase
        .from('contracts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'active');

    if (count !== null && count >= limits.maxContracts) {
        return NextResponse.json(
            { error: `${limits.name} 요금제의 계약 관리 한도(${limits.maxContracts}건)에 도달했습니다. 더 많은 계약을 관리하려면 플랜을 업그레이드하세요.` },
            { status: 403 }
        );
    }

    const body = await request.json();
    const { data, error } = await supabase
        .from('contracts')
        .insert({
            user_id: user.id,
            name: body.name,
            type: body.type,
            amount: body.amount,
            currency: body.currency || 'KRW',
            cycle: body.cycle,
            expires_at: body.expires_at,
            auto_renew: body.auto_renew || false,
            notice_days: body.notice_days || 30,
            memo: body.memo || null,
            tier: body.tier || '',
            owner_name: body.owner_name || '',
            status: 'active', // Default status
        })
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePath('/contracts');
    revalidatePath('/dashboard');
    return NextResponse.json(data, { status: 201 });
}
