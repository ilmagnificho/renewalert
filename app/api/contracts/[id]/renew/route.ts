import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { id } = await params;

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const nextExpiresAt = body.next_expires_at;

    if (!nextExpiresAt) {
        return NextResponse.json({ error: 'next_expires_at is required' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('contracts')
        .update({
            status: 'renewed',
            expires_at: nextExpiresAt,
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Reset status back to active with new date
    const { data: updated, error: updateError } = await supabase
        .from('contracts')
        .update({ status: 'active' })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

    if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json(updated);
}
