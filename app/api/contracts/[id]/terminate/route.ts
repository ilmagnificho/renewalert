import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

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

    // 1. Fetch contract info to check currency
    const { data: contract, error: fetchError } = await supabase
        .from('contracts')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

    if (fetchError || !contract) {
        return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    // 2. Update contract status and saved amount
    const { data: updatedContract, error: updateError } = await supabase
        .from('contracts')
        .update({
            status: 'terminated',
            saved_amount: savedAmount,
            decision_status: 'terminated',
            decision_date: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

    if (updateError && updateError.message.includes('decision_status')) {
        const fallback = await supabase
            .from('contracts')
            .update({
                status: 'terminated',
                saved_amount: savedAmount,
            })
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single();

        if (fallback.error) {
            return NextResponse.json({ error: fallback.error.message }, { status: 500 });
        }

        return NextResponse.json(fallback.data);
    }

    if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // 3. Atomically update user's total saved amount (Convert to KRW if needed)
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
        // Fallback to manual update if RPC doesn't exist yet
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
