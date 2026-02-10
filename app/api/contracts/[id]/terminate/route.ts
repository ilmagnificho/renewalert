import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { saved_amount } = await request.json();
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
            saved_amount: saved_amount
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

    if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // 3. Atomically update user's total saved amount (Convert to KRW if needed)
    let savedKRW = Number(saved_amount);
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
        const { data: userData } = await supabase.from('users').select('total_saved_krw').eq('id', user.id).single();
        const currentTotal = Number(userData?.total_saved_krw || 0);
        await supabase.from('users').update({ total_saved_krw: currentTotal + savedKRW }).eq('id', user.id);
    }

    return NextResponse.json(updatedContract);
}
