'use client';

import { Contract } from '@/types';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, getDaysUntil, getUrgencyLevel, formatDDay, formatDate } from '@/lib/utils';
import { CONTRACT_TYPE_LABELS, PAYMENT_CYCLE_LABELS } from '@/types';
import Link from 'next/link';

interface ContractCardProps {
    contract: Contract;
}

export function ContractCard({ contract }: ContractCardProps) {
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
        const colors: Record<string, string> = {
            danger: 'bg-red-500',
            warning: 'bg-orange-500',
            success: 'bg-green-500',
        };
        return ( // Fix: Using explicit color class names to ensure tailwind picks them up or custom style
            <span className={`w-2.5 h-2.5 rounded-full ${colors[urgency] || 'bg-slate-500'} inline-block shadow-[0_0_8px] ${urgency === 'danger' ? 'shadow-red-500/50' : urgency === 'warning' ? 'shadow-orange-500/50' : 'shadow-green-500/50'}`} />
        );
    };

    return (
        <Link href={`/contracts/${contract.id}`}>
            <div className="flex items-center justify-between p-5 bg-slate-900/50 border border-slate-800 rounded-xl hover:bg-slate-800/50 hover:border-blue-500/30 transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-md">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                    {urgencyDot()}
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                            <h3 className="text-base font-semibold text-slate-100 truncate group-hover:text-blue-400 transition-colors">
                                {contract.name}
                            </h3>
                            <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700/50">
                                {CONTRACT_TYPE_LABELS[contract.type]}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                            <div className="flex items-center gap-1.5">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {formatDate(contract.expires_at)}
                            </div>
                            <span className="w-1 h-1 rounded-full bg-slate-700" />
                            <span>{PAYMENT_CYCLE_LABELS[contract.cycle]}</span>
                            {contract.auto_renew && (
                                <>
                                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                                    <span className="text-orange-400 flex items-center gap-1">
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
                    <span className="text-base font-mono font-bold text-slate-200 group-hover:text-white transition-colors">
                        {formatCurrency(contract.amount, contract.currency)}
                    </span>
                    {statusBadge()}
                </div>
            </div>
        </Link>
    );
}
