import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

type ContractUpdatePayload = {
    status: 'terminated';
    saved_amount?: number;
    decision_status?: 'terminated';
    decision_date?: string;
};

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const body = await request.json().catch(() => ({}));
    const parsedSavedAmount = Number(body?.saved_amount);
    const savedAmount = Number.isFinite(parsedSavedAmount) && parsedSavedAmount >= 0 ? parsedSavedAmount : 0;
    const { id } = await params;

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: contract, error: fetchError } = await supabase
        .from('contracts')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

    if (fetchError || !contract) {
        return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    const decisionDate = new Date().toISOString();
    const updatePayloads: ContractUpdatePayload[] = [
        {
            status: 'terminated',
            saved_amount: savedAmount,
            decision_status: 'terminated',
            decision_date: decisionDate,
        },
        {
            status: 'terminated',
            saved_amount: savedAmount,
            decision_status: 'terminated',
        },
        {
            status: 'terminated',
            saved_amount: savedAmount,
            decision_date: decisionDate,
        },
        {
            status: 'terminated',
            saved_amount: savedAmount,
        },
        {
            status: 'terminated',
        },
    ];

    let updatedContract: Record<string, unknown> | null = null;
    let lastUpdateError = '';

    for (const payload of updatePayloads) {
        const { data, error } = await supabase
            .from('contracts')
            .update(payload)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single();

        if (!error) {
            updatedContract = data;
            break;
        }

        lastUpdateError = error.message;

        if (error.code !== '42703' && !error.message.toLowerCase().includes('column')) {
            break;
        }
    }

    if (!updatedContract) {
        return NextResponse.json({ error: lastUpdateError || 'Failed to terminate contract' }, { status: 500 });
    }

    let savedKRW = savedAmount;
    if (contract.currency === 'USD') {
        const { getUSDToKRWRate } = await import('@/lib/exchange-rate');
        const rate = await getUSDToKRWRate();
        savedKRW = Math.round(savedKRW * rate);
    }

    const { error: userUpdateError } = await supabase.rpc('increment_total_saved', {
        user_id: user.id,
        amount: savedKRW
    });

    if (userUpdateError) {
        const { data: userData } = await supabase
            .from('users')
            .select('id, total_saved_krw')
            .eq('id', user.id)
            .maybeSingle();

        if (userData) {
            const currentTotal = Number(userData.total_saved_krw || 0);
            const { error: fallbackUpdateError } = await supabase
                .from('users')
                .update({ total_saved_krw: currentTotal + savedKRW })
                .eq('id', user.id);

            if (fallbackUpdateError) {
                return NextResponse.json({ error: fallbackUpdateError.message }, { status: 500 });
            }
        } else {
            const { error: upsertError } = await supabase
                .from('users')
                .upsert({
                    id: user.id,
                    email: user.email || `${user.id}@renewalert.local`,
                    total_saved_krw: savedKRW,
                }, { onConflict: 'id' });

            if (upsertError) {
                return NextResponse.json({ error: upsertError.message }, { status: 500 });
            }
        }
    }

    return NextResponse.json(updatedContract);
}
