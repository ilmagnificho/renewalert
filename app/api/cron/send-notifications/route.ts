import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const results: { type: string; count: number }[] = [];

    for (const daysBeforeValue of [90, 30, 7, 1]) {
        const targetDate = new Date(today);
        targetDate.setDate(targetDate.getDate() + daysBeforeValue);
        const targetDateStr = targetDate.toISOString().split('T')[0];
        const notifType = `${daysBeforeValue}d`;

        // Find active contracts expiring on target date
        const { data: contracts } = await supabase
            .from('contracts')
            .select('*, users!inner(email, name)')
            .eq('status', 'active')
            .eq('expires_at', targetDateStr);

        if (!contracts || contracts.length === 0) {
            results.push({ type: notifType, count: 0 });
            continue;
        }

        let sentCount = 0;
        for (const contract of contracts) {
            // Check if already sent
            const { data: existing } = await supabase
                .from('notification_logs')
                .select('id')
                .eq('contract_id', contract.id)
                .eq('type', notifType)
                .limit(1);

            if (existing && existing.length > 0) continue;

            // TODO: Send email via Resend (Phase 2)
            // For now, just log the notification
            console.log(`[Notification] ${notifType} alert for contract "${contract.name}" to ${(contract as Record<string, Record<string, string>>).users.email}`);

            // Save notification log
            await supabase.from('notification_logs').insert({
                contract_id: contract.id,
                type: notifType,
                status: 'sent',
            });

            sentCount++;
        }

        results.push({ type: notifType, count: sentCount });
    }

    return NextResponse.json({ success: true, results });
}
