'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Contract, DashboardSummary } from '@/types';
import { ContractCard } from '@/components/contracts/contract-card';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

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
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">반가워요, {userName}님 👋</h1>
                    <p className="text-sm text-slate-400 mt-1">오늘 확인해야 할 계약 현황입니다.</p>
                </div>
                <Link href="/contracts/new">
                    <Button className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20">
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        새 계약 등록
                    </Button>
                </Link>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="hover:border-red-500/30 transition-colors cursor-default">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-slate-400">긴급 (D-7)</span>
                            <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px] shadow-red-500/50"></span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <p className="text-3xl font-bold text-white">{summary?.urgent || 0}</p>
                            <span className="text-sm text-slate-500">건</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:border-orange-500/30 transition-colors cursor-default">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-slate-400">주의 (D-30)</span>
                            <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px] shadow-orange-500/50"></span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <p className="text-3xl font-bold text-white">{summary?.warning || 0}</p>
                            <span className="text-sm text-slate-500">건</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:border-blue-500/30 transition-colors cursor-default">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-slate-400">정상</span>
                            <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px] shadow-green-500/50"></span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <p className="text-3xl font-bold text-white">{summary?.normal || 0}</p>
                            <span className="text-sm text-slate-500">건</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-blue-200">월 예상 구독료</span>
                        </div>
                        <p className="text-2xl font-bold text-white font-mono tracking-tight">
                            {formatCurrency(summary?.totalMonthly || 0)}
                        </p>
                        <p className="text-xs text-slate-400 mt-2">연간 {formatCurrency(summary?.totalYearly || 0)}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Upcoming Contracts */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">만기 임박 계약</h2>
                    <Link href="/contracts" className="text-sm text-blue-400 hover:text-blue-300">
                        전체보기 →
                    </Link>
                </div>

                {upcoming.length === 0 ? (
                    <Card className="border-dashed border-slate-800 bg-transparent">
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <p className="text-slate-300 font-medium mb-1">등록된 계약이 없습니다</p>
                            <p className="text-sm text-slate-500 mb-4">첫 번째 계약을 등록하고 알림을 받아보세요.</p>
                            <Link href="/contracts/new">
                                <Button variant="outline" className="border-slate-700 hover:bg-slate-800">
                                    계약 등록하기
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {upcoming.map((contract) => (
                            <ContractCard key={contract.id} contract={contract} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
