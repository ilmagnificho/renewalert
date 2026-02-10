import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { id } = await params;

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date().toISOString();

    let updateResult = await supabase
        .from('contracts')
        .update({
            decision_status: 'kept',
            decision_date: now,
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

    if (updateResult.error && updateResult.error.message.includes('decision_status')) {
        updateResult = await supabase
            .from('contracts')
            .update({ status: 'renewed' })
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single();
    }

    if (updateResult.error) {
        return NextResponse.json({ error: updateResult.error.message }, { status: 500 });
    }

    return NextResponse.json(updateResult.data);
}
