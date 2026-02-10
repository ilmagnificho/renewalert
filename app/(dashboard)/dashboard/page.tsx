'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Contract, DashboardSummary } from '@/types';
import { ContractCard } from '@/components/contracts/contract-card';
import Link from 'next/link';
import { formatCurrency, getUrgencyLevel, getDaysUntil } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { SavedMoneyCounter } from '@/components/dashboard/saved-money-counter';
import { CancellationExecutionCard } from '@/components/contracts/execution-card';
import { ShockTrigger } from '@/components/dashboard/shock-trigger';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [upcoming, setUpcoming] = useState<Contract[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    // Guest Mode (Mock Data)
                    setUserName('게스트');
                    setSummary({
                        urgent: 2, // D-7
                        warning: 3, // D-30
                        normal: 7,
                        totalMonthly: 4124000,
                        totalYearly: 49488000,
                        totalMonthlyKRW: 4096000,
                        totalMonthlyUSD: 20,
                        totalYearlyKRW: 49152000,
                        totalYearlyUSD: 240,
                        totalContracts: 5,
                        exchangeRate: 1400,
                        totalSavedKRW: 8420000
                    });
                    setUpcoming([
                        {
                            id: 'mock-1',
                            name: 'Adobe Creative Cloud',
                            type: 'saas',
                            status: 'active',
                            expires_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
                            amount: 62000,
                            currency: 'KRW',
                            cycle: 'monthly',
                            memo: '디자인 팀 라이선스',
                            auto_renew: true,
                            notice_days: 7,
                            saved_amount: null,
                            user_id: 'mock',
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                        },
                        {
                            id: 'mock-2',
                            name: 'AWS Infrastructure',
                            type: 'saas',
                            status: 'active',
                            expires_at: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
                            amount: 450000,
                            currency: 'KRW',
                            cycle: 'monthly',
                            memo: '메인 서버 호스팅',
                            auto_renew: true,
                            notice_days: 30,
                            saved_amount: null,
                            user_id: 'mock',
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                        },
                        {
                            id: 'mock-3',
                            name: '강남 오피스 임대료',
                            type: 'rent',
                            status: 'active',
                            expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
                            amount: 3500000,
                            currency: 'KRW',
                            cycle: 'monthly',
                            memo: '본사 사무실',
                            auto_renew: false,
                            notice_days: 90,
                            saved_amount: null,
                            user_id: 'mock',
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                        }
                    ]);
                    setIsLoading(false);
                    return;
                }

                setUserName(user.user_metadata.name || user.email?.split('@')[0] || '사용자');

                const [summaryRes, upcomingRes] = await Promise.all([
                    fetch('/api/dashboard/summary'),
                    fetch('/api/dashboard/upcoming')
                ]);

                if (summaryRes.ok) setSummary(await summaryRes.json());
                if (upcomingRes.ok) setUpcoming(await upcomingRes.json());
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboard();
    }, []);


    if (isLoading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-8 w-48 bg-slate-800 rounded-lg mb-6"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-32 bg-slate-800/50 rounded-xl border border-slate-800" />
                    ))}
                </div>
                <div className="h-64 bg-slate-800/50 rounded-xl border border-slate-800" />
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-fade-in max-w-7xl mx-auto">
            {/* Top ROI Counter */}
            <SavedMoneyCounter amount={summary?.totalSavedKRW || 0} />

            {/* Shock Trigger - CFO Moment (Top 3 Highest Value Upcoming) */}
            {upcoming.length > 0 && (
                <ShockTrigger
                    contracts={upcoming
                        .sort((a, b) => {
                            const valA = a.cycle === 'monthly' ? a.amount * 12 : a.amount;
                            const valB = b.cycle === 'monthly' ? b.amount * 12 : b.amount;
                            return valB - valA;
                        })
                        .slice(0, 3)
                    }
                />
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">반가워요, {userName}님 👋</h1>
                    <p className="text-sm text-muted-foreground mt-1">오늘 확인해야 할 계약 현황입니다.</p>
                </div>
                <Link href="/contracts/new">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        지출 항목 추가
                    </Button>
                </Link>
            </div>

            {/* Decision Execution Card (Danger Alert) */}
            {upcoming.find(c => getUrgencyLevel(getDaysUntil(c.expires_at)) === 'danger') && (
                <div className="space-y-4">
                    <h2 className="text-sm font-black uppercase tracking-widest text-orange-500">긴급 결정 필요</h2>
                    <CancellationExecutionCard
                        contract={upcoming.find(c => getUrgencyLevel(getDaysUntil(c.expires_at)) === 'danger')!}
                        exchangeRate={summary?.exchangeRate}
                    />
                </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="hover:border-red-500/30 transition-colors cursor-default bg-card">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-muted-foreground">긴급 (D-7)</span>
                            <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px] shadow-red-500/50"></span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <p className="text-3xl font-bold text-foreground">{summary?.urgent || 0}</p>
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
                            <p className="text-3xl font-bold text-foreground">{summary?.warning || 0}</p>
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
                            <p className="text-3xl font-bold text-foreground">{summary?.normal || 0}</p>
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
                            {formatCurrency(summary?.totalMonthly || 0)}
                        </p>
                        <div className="mt-3 space-y-1">
                            <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">KRW</span>
                                <span className="font-medium text-foreground">{formatCurrency(summary?.totalMonthlyKRW || 0, 'KRW')}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">USD</span>
                                <span className="font-medium text-foreground">{formatCurrency(summary?.totalMonthlyUSD || 0, 'USD')}</span>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-zinc-800/50">
                            <p className="text-[10px] text-muted-foreground/60 leading-relaxed">
                                환율은 하나은행 매매기준율 기준으로 매일 자동 업데이트됩니다.
                            </p>
                            <p className="text-[10px] text-blue-500/80 mt-1 font-medium">
                                적용 환율: 1 USD = {formatCurrency(summary?.exchangeRate || 1400, 'KRW')}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Upcoming Contracts */}
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
                                exchangeRate={summary?.exchangeRate}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
