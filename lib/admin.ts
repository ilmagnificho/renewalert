import { createClient } from '@/lib/supabase/server';

export async function isSuperAdmin(userId: string): Promise<boolean> {
    const supabase = await createClient();

    // Check if user exists in super_admins table
    const { data } = await supabase
        .from('super_admins')
        .select('id')
        .eq('user_id', userId)
        .single();

    return !!data;
}

export async function requireSuperAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    const isSuper = await isSuperAdmin(user.id);
    if (!isSuper) {
        throw new Error('Forbidden: Super Admin access required');
    }

    return user;
}
