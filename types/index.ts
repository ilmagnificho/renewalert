// Contract types
export type ContractType = 'saas' | 'rent' | 'insurance' | 'other';
export type ContractStatus = 'active' | 'renewed' | 'terminated';
export type ContractDecisionStatus = 'kept' | 'terminated';
export type PaymentCycle = 'monthly' | 'yearly' | 'onetime';
export type NotificationType = '90d' | '30d' | '7d' | '1d';
export type NotificationStatus = 'sent' | 'failed';
export type PlanType = 'free' | 'core' | 'growth';

export interface User {
  id: string;
  email: string;
  name: string | null;
  plan: PlanType;
  total_saved_krw: number;
  plan_expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Contract {
  id: string;
  user_id: string;
  name: string;
  type: ContractType;
  amount: number;
  currency: string;
  cycle: PaymentCycle;
  expires_at: string;
  auto_renew: boolean;
  notice_days: number;
  status: ContractStatus;
  saved_amount: number | null;
  memo: string | null;
  created_at: string;
  updated_at: string;
  decision_status?: ContractDecisionStatus | null;
  decision_date?: string | null;
  tier?: string;
  owner_name?: string;
}

export interface CancellationGuide {
  id: string;
  service_name: string;
  cancellation_url: string;
  notice_period_days: number;
  steps: string;
  penalty_notes: string;
  is_annual_only: boolean;
  created_at: string;
}

export interface NotificationLog {
  id: string;
  contract_id: string;
  type: NotificationType;
  sent_at: string;
  status: NotificationStatus;
}

export interface ContractFormData {
  name: string;
  type: ContractType;
  amount: number;
  currency: string;
  cycle: PaymentCycle;
  expires_at: string;
  auto_renew: boolean;
  notice_days: number;
  memo: string;
  tier?: string;
  owner_name?: string;
}

export interface DashboardSummary {
  urgent: number;    // D-7 이하
  warning: number;   // D-30 이하
  normal: number;    // D-30 초과
  totalMonthly: number; // KRW Total (Approx)
  totalYearly: number; // KRW Total (Approx)
  totalMonthlyKRW: number;
  totalMonthlyUSD: number;
  totalYearlyKRW: number;
  totalYearlyUSD: number;
  totalContracts: number;
  exchangeRate: number;
  exchangeRateSource?: 'api' | 'mock';
  totalSavedKRW: number;
}

// Helper constants
export const MAX_FREE_CONTRACTS = 3;

export const CONTRACT_TYPE_LABELS: Record<ContractType, string> = {
  saas: 'SaaS',
  rent: '임대',
  insurance: '보험',
  other: '기타',
};

export const CONTRACT_STATUS_LABELS: Record<ContractStatus, string> = {
  active: '활성',
  renewed: '갱신 완료',
  terminated: '해지 완료',
};

export const PAYMENT_CYCLE_LABELS: Record<PaymentCycle, string> = {
  monthly: '월간',
  yearly: '연간',
  onetime: '단건',
};
