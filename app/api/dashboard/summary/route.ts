import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: contracts, error } = await supabase
        .from('contracts')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active');

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let urgent = 0;
    let warning = 0;
    let normal = 0;
    let totalMonthly = 0;
    let totalYearly = 0;

    (contracts || []).forEach((contract) => {
        const expiresAt = new Date(contract.expires_at);
        expiresAt.setHours(0, 0, 0, 0);
        const diff = Math.ceil((expiresAt.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (diff <= 7) urgent++;
        else if (diff <= 30) warning++;
        else normal++;

        const amount = Number(contract.amount);
        if (contract.cycle === 'monthly') {
            totalMonthly += amount;
            totalYearly += amount * 12;
        } else if (contract.cycle === 'yearly') {
            totalYearly += amount;
            totalMonthly += Math.round(amount / 12);
        } else {
            totalYearly += amount;
        }
    });

    return NextResponse.json({
        urgent,
        warning,
        normal,
        totalMonthly,
        totalYearly,
        totalContracts: contracts?.length || 0,
    });
}
