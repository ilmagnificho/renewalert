export interface Organization {
    id: string;
    name: string;
    slug: string | null;
    plan: 'free' | 'pro' | 'concierge';
    created_at: string;
    updated_at: string;
}

export interface OrganizationMember {
    id: string;
    organization_id: string;
    user_id: string;
    role: 'owner' | 'admin' | 'member';
    created_at: string;
}

export interface Invitation {
    id: string;
    organization_id: string;
    email: string;
    role: 'admin' | 'member';
    token: string;
    expires_at: string;
    accepted_at: string | null;
    invited_by: string;
    created_at: string;
}

export interface Contract {
    id: string;
    organization_id: string;
    user_id: string;
    name: string;
    type: 'saas' | 'rent' | 'insurance' | 'other';
    amount: number;
    currency: string;
    cycle: 'monthly' | 'yearly' | 'onetime';
    expires_at: string;
    auto_renew: boolean;
    notice_days: number | null;
    status: 'active' | 'renewed' | 'terminated';
    memo: string | null;
    saved_amount: number | null;
    tier?: string;
    owner_name?: string;
    decision_status?: 'kept' | 'terminated' | null;
    decision_date?: string | null;
    created_at: string;
    updated_at: string;
}
