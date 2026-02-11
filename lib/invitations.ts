import { createClient } from '@/lib/supabase/server';

export async function createInvitation(
    organizationId: string,
    email: string,
    role: 'admin' | 'member',
    invitedBy: string
) {
    const supabase = await createClient();

    // Check if invitation already exists
    const { data: existing } = await supabase
        .from('invitations')
        .select('id')
        .eq('organization_id', organizationId)
        .eq('email', email)
        .eq('accepted_at', null)
        .single();

    if (existing) {
        throw new Error('Already invited');
    }

    // Check if user is already a member
    const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

    if (user) {
        const { data: member } = await supabase
            .from('organization_members')
            .select('id')
            .eq('organization_id', organizationId)
            .eq('user_id', user.id)
            .single();

        if (member) {
            throw new Error('User is already a member');
        }
    }

    const token = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiration

    const { data, error } = await supabase
        .from('invitations')
        .insert({
            organization_id: organizationId,
            email,
            role,
            invited_by: invitedBy,
            token,
            expires_at: expiresAt.toISOString(),
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function getInvitationByToken(token: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('invitations')
        .select('*, organization:organizations(name)')
        .eq('token', token)
        .single();

    if (error) return null;

    // Check expiration
    if (new Date(data.expires_at) < new Date()) {
        throw new Error('Invitation expired');
    }

    if (data.accepted_at) {
        throw new Error('Invitation already accepted');
    }

    return data;
}

export async function acceptInvitation(token: string, userId: string) {
    const supabase = await createClient();

    const invitation = await getInvitationByToken(token);
    if (!invitation) throw new Error('Invalid invitation');

    // Start transaction (conceptually, Supabase doesn't support complex tx easily via client, so sequential)

    // 1. Add member
    const { error: memberError } = await supabase
        .from('organization_members')
        .insert({
            organization_id: invitation.organization_id,
            user_id: userId,
            role: invitation.role,
        });

    if (memberError) throw memberError;

    // 2. Mark invitation as accepted
    const { error: updateError } = await supabase
        .from('invitations')
        .update({ accepted_at: new Date().toISOString() })
        .eq('id', invitation.id);

    if (updateError) {
        // Setup fallback manually if critical
        console.error('Failed to mark invitation as accepted', updateError);
    }

    return invitation.organization_id;
}

export async function revokeInvitation(invitationId: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('invitations')
        .delete()
        .eq('id', invitationId);

    if (error) throw error;
}
