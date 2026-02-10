'use client';

import { Contract } from '@/types';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, getDaysUntil, getUrgencyLevel, formatDDay, formatDate } from '@/lib/utils';
import { CONTRACT_TYPE_LABELS, PAYMENT_CYCLE_LABELS } from '@/types';
import Link from 'next/link';

interface ContractCardProps {
    contract: Contract;
    exchangeRate?: number;
}

export function ContractCard({ contract, exchangeRate }: ContractCardProps) {
    const daysUntil = getDaysUntil(contract.expires_at);
    const urgency = contract.status === 'active' ? getUrgencyLevel(daysUntil) : 'default' as const;

    const statusBadge = () => {
        if (contract.status === 'terminated') {
            return <Badge variant="default" className="bg-slate-700 text-slate-300">해지 완료</Badge>;
        }
        if (contract.status === 'renewed') {
            return <Badge variant="success" className="bg-green-500/10 text-green-400 border-green-500/20">갱신 완료</Badge>;
        }
        return <Badge variant={urgency}>{formatDDay(daysUntil)}</Badge>;
    };

    const urgencyDot = () => {
        if (contract.status !== 'active') return null;
        // Map urgency levels to theme colors (using semantic classes if possible, but keeping explicit colors for status indicators)
        const colorClass = urgency === 'danger' ? 'bg-red-500 shadow-red-500/50' :
            urgency === 'warning' ? 'bg-orange-500 shadow-orange-500/50' :
                'bg-green-500 shadow-green-500/50';

        return (
            <span className={`w-2.5 h-2.5 rounded-full ${colorClass} inline-block shadow-[0_0_8px]`} />
        );
    };

    return (
        <Link href={`/contracts/${contract.id}`}>
            <div className="flex items-center justify-between p-5 bg-card border border-border rounded-xl hover:bg-accent/50 hover:border-primary/30 transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-md">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                    {urgencyDot()}
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <h3 className="text-base font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                                {contract.name}
                            </h3>
                            <span className="text-xs px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground border border-border">
                                {CONTRACT_TYPE_LABELS[contract.type]}
                            </span>
                            {contract.tier && (
                                <span className="text-xs px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20 font-medium">
                                    {contract.tier}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium flex-wrap">
                            <div className="flex items-center gap-1.5">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {formatDate(contract.expires_at)}
                            </div>
                            <span className="w-1 h-1 rounded-full bg-border" />
                            <span>{PAYMENT_CYCLE_LABELS[contract.cycle]}</span>
                            {contract.owner_name && (
                                <>
                                    <span className="w-1 h-1 rounded-full bg-border" />
                                    <span className="flex items-center gap-1 text-foreground/80">
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        {contract.owner_name}
                                    </span>
                                </>
                            )}
                            {contract.auto_renew && (
                                <>
                                    <span className="w-1 h-1 rounded-full bg-border" />
                                    <span className="text-orange-500 dark:text-orange-400 flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        자동갱신
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-5 shrink-0 ml-4">
                    <div className="text-right">
                        <div className="text-base font-mono font-bold text-foreground group-hover:text-primary transition-colors">
                            {formatCurrency(contract.amount, contract.currency)}
                        </div>
                        {contract.currency === 'USD' && exchangeRate && (
                            <div className="text-[10px] text-muted-foreground font-medium mt-0.5">
                                ≈ {formatCurrency(contract.amount * exchangeRate, 'KRW')}
                            </div>
                        )}
                    </div>
                    {statusBadge()}
                </div>
            </div>
        </Link>
    );
}
