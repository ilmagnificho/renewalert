import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

export function getDaysUntil(dateStr: string): number {
    const target = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    const diff = target.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getUrgencyLevel(daysUntil: number): 'danger' | 'warning' | 'success' {
    if (daysUntil <= 7) return 'danger';
    if (daysUntil <= 30) return 'warning';
    return 'success';
}

export function formatCurrency(amount: number, currency: string = 'KRW'): string {
    if (currency === 'KRW') {
        return `₩${amount.toLocaleString('ko-KR')}`;
    }
    if (currency === 'USD') {
        return `$${amount.toLocaleString('en-US')}`;
    }
    return `${amount.toLocaleString()} ${currency}`;
}

export function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
}

export function formatDDay(days: number): string {
    if (days < 0) return `D+${Math.abs(days)}`;
    if (days === 0) return 'D-Day';
    return `D-${days}`;
}

/**
 * Calculates the estimated annual savings if a contract is cancelled.
 * @param amount The payment amount
 * @param cycle The payment cycle ('monthly', 'yearly', 'onetime')
 * @returns The estimated annual savings
 */
export function calculateEstimatedAnnualSavings(amount: number, cycle: string): number {
    if (cycle === 'monthly') {
        return amount * 12;
    }
    if (cycle === 'yearly') {
        return amount;
    }
    return 0; // Onetime payments don't have recurring annual savings in the same sense
}

export const PLAN_LIMITS = {
    free: {
        maxContracts: 3,
        alertWindows: 1, // Single alert timing
        hasExecutionCard: false,
        hasSavedMoneyCounter: false,
        name: 'Free',
        price: '₩0',
    },
    core: {
        maxContracts: 40,
        alertWindows: 3, // Multi-alert timing
        hasExecutionCard: true,
        hasSavedMoneyCounter: true,
        name: 'Core',
        price: '₩39,000 / 월',
    },
    growth: {
        maxContracts: Infinity,
        alertWindows: 7, // Advanced alert windows
        hasExecutionCard: true,
        hasSavedMoneyCounter: true,
        name: 'Growth',
        price: '₩99,000 / 월',
    }
} as const;

export function getPlanLimits(plan: string = 'free') {
    return PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.free;
}
