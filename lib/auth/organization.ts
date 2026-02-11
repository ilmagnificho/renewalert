import { createClient } from '@/lib/supabase/client';
import { Organization } from '@/types/database';

// Generate URL-friendly slug from company name
function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .substring(0, 50);
}

// Create organization and link user as owner
export async function createOrganizationForUser(
    userId: string,
    companyName: string
): Promise<{ organization: Organization | null; error: unknown | null }> {
    const supabase = createClient();

    // 1. Create the organization
    const slug = generateSlug(companyName);
    const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({
            name: companyName,
            slug: slug,
            plan: 'free',
        })
        .select()
        .single();

    if (orgError) {
        return { organization: null, error: orgError };
    }

    // 2. Add user as owner
    const { error: memberError } = await supabase
        .from('organization_members')
        .insert({
            organization_id: org.id,
            user_id: userId,
            role: 'owner',
        });

    if (memberError) {
        // Rollback: delete the organization
        await supabase.from('organizations').delete().eq('id', org.id);
        return { organization: null, error: memberError };
    }

    return { organization: org as Organization, error: null };
}

// Get user's current organization
export async function getUserOrganization(userId: string) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('organization_members')
        .select(`
      role,
      organization:organizations(*)
    `)
        .eq('user_id', userId)
        .single();

    if (error) return { organization: null, role: null, error };

    return {
        organization: data.organization as unknown as Organization,
        role: data.role as 'owner' | 'admin' | 'member',
        error: null,
    };
}

// Check if user is admin or owner
export async function isUserAdmin(userId: string, organizationId: string): Promise<boolean> {
    const supabase = createClient();

    const { data } = await supabase
        .from('organization_members')
        .select('role')
        .eq('user_id', userId)
        .eq('organization_id', organizationId)
        .single();

    return data?.role === 'owner' || data?.role === 'admin';
}
