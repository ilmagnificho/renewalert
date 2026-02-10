'use client';

import { Contract } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface ShockTriggerProps {
    contracts: Array<{
        name: string;
        amount: number;
        currency: string;
        cycle: string;
    }>;
    title?: string;
}

export function ShockTrigger({ contracts, title = "RenewAlert이 방금 발견한 갱신 예정 비용" }: ShockTriggerProps) {
    if (!contracts || contracts.length === 0) return null;

    const totalAtRisk = contracts.reduce((acc, contract) => {
        // Simple yearly normalization for the shock effect
        const yearlyAmount = contract.cycle === 'monthly' ? contract.amount * 12 : contract.amount;
        return acc + yearlyAmount;
    }, 0);

    return (
        <div className="w-full bg-zinc-950 border border-white/5 p-8 sm:p-12 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="max-w-4xl mx-auto space-y-8">
                <h2 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">
                    {title}
                </h2>

                <div className="space-y-4">
                    {contracts.slice(0, 3).map((contract, i) => (
                        <div key={i} className="flex justify-between items-baseline border-b border-white/5 pb-2">
                            <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                                • {contract.name}
                            </span>
                            <span className="text-lg sm:text-xl font-mono text-zinc-400">
                                {formatCurrency(contract.amount, contract.currency)} / {contract.cycle === 'monthly' ? '매월' : '매년'}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="pt-6 space-y-2">
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">
                        Total at risk
                    </p>
                    <div className="text-5xl sm:text-7xl font-black text-white tracking-tighter">
                        👉 {formatCurrency(totalAtRisk, contracts[0]?.currency || 'KRW')} / 연
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 mt-8">
                    <p className="text-zinc-400 text-sm sm:text-base font-bold leading-relaxed">
                        자동 갱신 전에 검토하면 <br className="sm:hidden" />
                        이 비용은 막을 수 있습니다.
                    </p>
                </div>
            </div>
        </div>
    );
}
