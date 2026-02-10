'use client';

import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Contract } from '@/types';
import { ContractCard } from '@/components/contracts/contract-card';
import Link from 'next/link';
import { formatCurrency, getUrgencyLevel, getDaysUntil } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { CancellationExecutionCard } from '@/components/contracts/execution-card';
import { useExchangeRate } from '@/hooks/use-exchange-rate';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
    const { rate: exchangeRate, source: exchangeRateSource, isLoading: isRateLoading } = useExchangeRate();
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [userName, setUserName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [userSavedAmount, setUserSavedAmount] = useState(0);

    useEffect(() => {
        const supabase = createClient();
        let isMounted = true;

        const fetchDashboardData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    if (!isMounted) return;
                    setUserName('게스트');
                    setContracts([]);
                    setUserSavedAmount(0);
                    setIsLoading(false);
                    return;
                }

                if (isMounted) {
                    setUserName(user.user_metadata.name || user.email?.split('@')[0] || '사용자');
                }

                const { data: userData } = await supabase
                    .from('users')
                    .select('total_saved_krw')
                    .eq('id', user.id)
                    .single();

                if (isMounted && userData) {
                    setUserSavedAmount(userData.total_saved_krw || 0);
                }

                let activeContractsQuery = await supabase
                    .from('contracts')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('status', 'active')
                    .is('decision_status', null);

                if (activeContractsQuery.error && activeContractsQuery.error.message.includes('decision_status')) {
                    activeContractsQuery = await supabase
                        .from('contracts')
                        .select('*')
                        .eq('user_id', user.id)
                        .eq('status', 'active');
                }

                if (isMounted && activeContractsQuery.data) {
                    setContracts(activeContractsQuery.data);
                }
            } catch (e) {
                console.error(e);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchDashboardData();

        const contractsChannel = supabase
            .channel('dashboard-contracts')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'contracts' }, () => {
                fetchDashboardData();
            })
            .subscribe();

        const usersChannel = supabase
            .channel('dashboard-users')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'users' }, () => {
                fetchDashboardData();
            })
            .subscribe();

        return () => {
            isMounted = false;
            supabase.removeChannel(contractsChannel);
            supabase.removeChannel(usersChannel);
        };
    }, []);

    // Helper: Compute Summary Stats
    const summary = useMemo(() => {
        let urgent = 0;
        let warning = 0;
        let normal = 0;
        let totalMonthly = 0;
        let totalMonthlyKRW = 0;
        let totalMonthlyUSD = 0;

        contracts.forEach(contract => {
            const daysUntil = getDaysUntil(contract.expires_at);
            if (daysUntil <= 7) urgent++;
            else if (daysUntil <= 30) warning++;
            else normal++;

            // Calculate Monthly Amount
            let monthlyAmount = contract.amount;
            if (contract.cycle === 'yearly') monthlyAmount = contract.amount / 12;

            // Add to totals
            if (contract.currency === 'USD') {
                totalMonthlyUSD += monthlyAmount;
                totalMonthly += monthlyAmount * exchangeRate;
            } else {
                totalMonthlyKRW += monthlyAmount;
                totalMonthly += monthlyAmount;
            }
        });

        return {
            urgent,
            warning,
            normal,
            totalMonthly,
            totalMonthlyKRW,
            totalMonthlyUSD
        };
    }, [contracts, exchangeRate]);

    // Helper: Filter Upcoming Contracts (Sorted by urgency)
    const upcoming = useMemo(() => {
        return [...contracts].sort((a, b) => {
            const daysA = getDaysUntil(a.expires_at);
            const daysB = getDaysUntil(b.expires_at);
            return daysA - daysB;
        }).slice(0, 5); // Start with top 5 for "Upcoming" list
    }, [contracts]);

    const alertWindowContracts = useMemo(() => {
        return contracts.filter((contract) => {
            const daysUntil = getDaysUntil(contract.expires_at);
            return daysUntil <= contract.notice_days;
        });
    }, [contracts]);

    const dangerContract = alertWindowContracts.find((contract) => getUrgencyLevel(getDaysUntil(contract.expires_at)) === 'danger');

    if (isLoading || isRateLoading) {
        return (
            <div className="space-y-6 animate-pulse max-w-7xl mx-auto">
                <div className="h-24 w-full bg-zinc-900/50 rounded-2xl mb-8"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-32 bg-zinc-900/30 rounded-xl border border-zinc-800" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-fade-in max-w-7xl mx-auto pb-20">
            {/* 1. Top ROI Counter */}
            <div className="bg-zinc-950/50 border border-zinc-900 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h3 className="text-sm font-bold text-zinc-400 mb-1">지금까지 막은 비용</h3>
                    <p className="text-[10px] text-zinc-500">확인된 결정만 합산됩니다</p>
                </div>
                <div className="text-3xl sm:text-4xl font-black text-blue-500 tracking-tighter tabular-nums">
                    {formatCurrency(userSavedAmount, 'KRW')}
                </div>
            </div>

            {/* 2. Real-time Exposure: "Fresh Risk" (New Findings) */}
            {alertWindowContracts.length > 0 && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-500">
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                        </span>
                        <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400">방금 발견된 갱신 예정 비용</h2>
                    </div>
                    <div className="bg-zinc-900/30 border border-orange-500/20 rounded-xl p-1 hover:border-orange-500/40 transition-colors group">
                        <div className="flex items-center justify-between px-4 py-3">
                            <span className="text-sm font-bold text-zinc-300 group-hover:text-white transition-colors">
                                {alertWindowContracts.length}건의 계약이 알림 구간에 있습니다
                            </span>
                            <span className="text-sm font-mono font-bold text-orange-500">
                                {formatCurrency(alertWindowContracts.reduce((acc, contract) => {
                                    if (contract.currency === 'USD') {
                                        return acc + (contract.cycle === 'yearly' ? contract.amount : contract.amount * 12) * exchangeRate;
                                    }
                                    return acc + (contract.cycle === 'yearly' ? contract.amount : contract.amount * 12);
                                }, 0), 'KRW')} / 연
                            </span>
                        </div>
                    </div>
                    <p className="text-xs text-zinc-500">지금 검토하면 자동 결제를 막을 수 있습니다.</p>
                </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">반가워요, {userName}님 👋</h1>
                    <p className="text-sm text-muted-foreground mt-1">오늘 확인해야 할 계약 현황입니다.</p>
                </div>
                <Link href="/contracts/new">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        계약 추가
                    </Button>
                </Link>
            </div>

            {/* 3. Decision Execution Card (Danger Alert) */}
            {dangerContract && (
                <div className="space-y-4">
                    <h2 className="text-sm font-black uppercase tracking-widest text-orange-500">긴급 결정 필요</h2>
                    <CancellationExecutionCard
                        contract={dangerContract}
                        exchangeRate={exchangeRate}
                    />
                </div>
            )}

            {/* 4. Summary Cards (Single Source of Truth) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="hover:border-red-500/30 transition-colors cursor-default bg-card">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-muted-foreground">긴급 (D-7)</span>
                            <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px] shadow-red-500/50"></span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <p className="text-3xl font-bold text-foreground">{summary.urgent}</p>
                            <span className="text-sm text-muted-foreground">건</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:border-orange-500/30 transition-colors cursor-default bg-card">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-muted-foreground">주의 (D-30)</span>
                            <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px] shadow-orange-500/50"></span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <p className="text-3xl font-bold text-foreground">{summary.warning}</p>
                            <span className="text-sm text-muted-foreground">건</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:border-blue-500/30 transition-colors cursor-default bg-card">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-muted-foreground">정상</span>
                            <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px] shadow-green-500/50"></span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <p className="text-3xl font-bold text-foreground">{summary.normal}</p>
                            <span className="text-sm text-muted-foreground">건</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1 lg:col-span-1 bg-gradient-to-br from-zinc-900 to-black border-zinc-800">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-blue-500">월 예상 반복 지출</span>
                            <span className="text-[10px] text-muted-foreground">(USD 환산 포함)</span>
                        </div>
                        <p className="text-2xl font-bold text-foreground font-mono tracking-tight">
                            {formatCurrency(Math.round(summary.totalMonthly))}
                        </p>
                        <div className="mt-3 space-y-1">
                            <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">KRW</span>
                                <span className="font-medium text-foreground">{formatCurrency(summary.totalMonthlyKRW, 'KRW')}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">USD</span>
                                <span className="font-medium text-foreground">{formatCurrency(summary.totalMonthlyUSD, 'USD')}</span>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-zinc-800/50">
                            <p className="text-[10px] text-blue-500/80 mt-1 font-medium">
                                적용 환율: 1 USD = {formatCurrency(exchangeRate, 'KRW')} {exchangeRateSource === 'mock' ? '(임시 기준)' : '(실시간 반영)'}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 5. Upcoming Contracts List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground">만기 임박 계약</h2>
                    <Link href="/contracts" className="text-sm text-primary hover:underline">
                        전체보기 →
                    </Link>
                </div>

                {upcoming.length === 0 ? (
                    <Card className="border-dashed border-border bg-transparent">
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <p className="text-foreground font-medium mb-1">등록된 계약이 없습니다</p>
                            <p className="text-sm text-muted-foreground mb-4">첫 번째 계약을 등록하고 알림을 받아보세요.</p>
                            <Link href="/contracts/new">
                                <Button variant="outline" className="border-border hover:bg-accent hover:text-accent-foreground">
                                    계약 등록하기
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {upcoming.map((contract) => (
                            <ContractCard
                                key={contract.id}
                                contract={contract}
                                exchangeRate={exchangeRate}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
