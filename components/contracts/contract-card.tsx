'use client';

import { Contract, CONTRACT_TYPE_LABELS, PAYMENT_CYCLE_LABELS } from '@/types';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, getDaysUntil, getUrgencyLevel, formatDDay, formatDate } from '@/lib/utils';
import Link from 'next/link';

interface ContractCardProps {
    contract: Contract;
}

export function ContractCard({ contract }: ContractCardProps) {
    const daysUntil = getDaysUntil(contract.expires_at);
    const urgency = contract.status === 'active' ? getUrgencyLevel(daysUntil) : 'default' as const;

    const statusBadge = () => {
        if (contract.status === 'terminated') {
            return <Badge variant="default">해지 완료</Badge>;
        }
        if (contract.status === 'renewed') {
            return <Badge variant="success">갱신 완료</Badge>;
        }
        return <Badge variant={urgency}>{formatDDay(daysUntil)}</Badge>;
    };

    const urgencyDot = () => {
        if (contract.status !== 'active') return null;
        const colors: Record<string, string> = {
            danger: 'bg-danger',
            warning: 'bg-warning',
            success: 'bg-success',
        };
        return (
            <span className={`w-2 h-2 rounded-full ${colors[urgency] || 'bg-success'} inline-block`} />
        );
    };

    return (
        <Link href={`/contracts/${contract.id}`}>
            <div className="flex items-center justify-between p-4 bg-dark-card border border-dark-border rounded-lg hover:border-text-tertiary transition-colors duration-200 cursor-pointer group">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    {urgencyDot()}
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-medium text-text-primary truncate group-hover:text-primary transition-colors">
                                {contract.name}
                            </h3>
                            <span className="text-xs text-text-tertiary shrink-0">
                                {CONTRACT_TYPE_LABELS[contract.type]}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-text-secondary">
                            <span>{formatDate(contract.expires_at)}</span>
                            <span>·</span>
                            <span>{PAYMENT_CYCLE_LABELS[contract.cycle]}</span>
                            {contract.auto_renew && (
                                <>
                                    <span>·</span>
                                    <span className="text-warning">자동갱신</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4 shrink-0 ml-4">
                    <span className="text-sm font-mono font-medium text-text-primary">
                        {formatCurrency(contract.amount, contract.currency)}
                    </span>
                    {statusBadge()}
                </div>
            </div>
        </Link>
    );
}
