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

    let totalMonthlyKRW = 0;
    let totalMonthlyUSD = 0;
    let totalYearlyKRW = 0;
    let totalYearlyUSD = 0;

    const EXCHANGE_RATE = 1400; // 1 USD = 1400 KRW (Approx)

    (contracts || []).forEach((contract) => {
        const expiresAt = new Date(contract.expires_at);
        expiresAt.setHours(0, 0, 0, 0);
        const diff = Math.ceil((expiresAt.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (diff <= 7) urgent++;
        else if (diff <= 30) warning++;
        else normal++;

        const amount = Number(contract.amount);
        const isUSD = contract.currency === 'USD';

        let monthlyAmount = 0;
        let yearlyAmount = 0;

        if (contract.cycle === 'monthly') {
            monthlyAmount = amount;
            yearlyAmount = amount * 12;
        } else if (contract.cycle === 'yearly') {
            yearlyAmount = amount;
            monthlyAmount = Math.round(amount / 12);
        } else {
            // One-time payment (not recurring) - exclude from subscription totals?
            // Or treat as yearly/monthly? Usually exclude or treat as 0 for subscription.
            // For now, let's exclude onetime from "Monthly Subscription" check.
            monthlyAmount = 0;
            yearlyAmount = 0;
        }

        if (isUSD) {
            totalMonthlyUSD += monthlyAmount;
            totalYearlyUSD += yearlyAmount;
        } else {
            totalMonthlyKRW += monthlyAmount;
            totalYearlyKRW += yearlyAmount;
        }
    });

    // Grand Totals (Converted to KRW)
    const totalMonthly = totalMonthlyKRW + (totalMonthlyUSD * EXCHANGE_RATE);
    const totalYearly = totalYearlyKRW + (totalYearlyUSD * EXCHANGE_RATE);

    return NextResponse.json({
        urgent,
        warning,
        normal,
        totalMonthly,
        totalYearly,
        totalMonthlyKRW,
        totalMonthlyUSD,
        totalYearlyKRW,
        totalYearlyUSD,
        totalContracts: contracts?.length || 0,
    });
}
