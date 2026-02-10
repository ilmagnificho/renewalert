'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Contract, DashboardSummary } from '@/types';
import { ContractCard } from '@/components/contracts/contract-card';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

export default function ContractsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || 'all');
    const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'active');

    useEffect(() => {
        fetchContracts();
    }, [typeFilter, statusFilter]);

    const fetchContracts = async () => {
        setIsLoading(true);

        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            // Guest Mode (Mock Data) 
            const mockData: Contract[] = [
                // ... (existing mock data)
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
                    amount: 20,
                    currency: 'USD',
                    cycle: 'monthly',
                    memo: '메인 서버 호스팅',
                    auto_renew: true,
                    notice_days: 30,
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
                    user_id: 'mock',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    id: 'mock-4',
                    name: '삼성화재 업무용 자동차보험',
                    type: 'insurance',
                    status: 'active',
                    expires_at: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
                    amount: 850000,
                    currency: 'KRW',
                    cycle: 'yearly',
                    memo: '법인 차량 3대',
                    auto_renew: true,
                    notice_days: 30,
                    user_id: 'mock',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    id: 'mock-5',
                    name: 'Slack Enterprise',
                    type: 'saas',
                    status: 'renewed',
                    expires_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                    amount: 1500000,
                    currency: 'KRW',
                    cycle: 'yearly',
                    memo: '전사 메신저',
                    auto_renew: true,
                    notice_days: 30,
                    user_id: 'mock',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            ];

            // Apply client-side filtering for mock data
            let filtered = mockData;
            if (typeFilter !== 'all') filtered = filtered.filter(c => c.type === typeFilter);
            if (statusFilter !== 'all') filtered = filtered.filter(c => c.status === statusFilter);
            if (search) filtered = filtered.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

            setContracts(filtered);
            setSummary({
                urgent: 1,
                warning: 1,
                normal: 2,
                totalMonthly: 4124000,
                totalYearly: 49488000,
                totalMonthlyKRW: 4096000,
                totalMonthlyUSD: 20,
                totalYearlyKRW: 49152000,
                totalYearlyUSD: 240,
                totalContracts: 5,
                exchangeRate: 1400
            });
            setIsLoading(false);
            return;
        }

        const params = new URLSearchParams();
        if (typeFilter !== 'all') params.set('type', typeFilter);
        if (statusFilter !== 'all') params.set('status', statusFilter);
        if (search) params.set('search', search);

        const [contractsRes, summaryRes] = await Promise.all([
            fetch(`/api/contracts?${params.toString()}`),
            fetch('/api/dashboard/summary')
        ]);

        if (contractsRes.ok) {
            setContracts(await contractsRes.json());
        }
        if (summaryRes.ok) {
            setSummary(await summaryRes.json());
        }
        setIsLoading(false);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchContracts();
    };

    const typeOptions = [
        { value: 'all', label: '전체 유형' },
        { value: 'saas', label: 'SaaS' },
        { value: 'rent', label: '임대' },
        { value: 'insurance', label: '보험' },
        { value: 'other', label: '기타' },
    ];

    const statusOptions = [
        { value: 'all', label: '전체 상태' },
        { value: 'active', label: '활성' },
        { value: 'renewed', label: '갱신 완료' },
        { value: 'terminated', label: '해지 완료' },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">계약 관리</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        등록된 계약 {contracts.length}개
                    </p>
                </div>
                <Link href="/contracts/new">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 w-full sm:w-auto">
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        새 계약 등록
                    </Button>
                </Link>
            </div>

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

                <Card className="bg-gradient-to-br from-zinc-900 to-black border-zinc-800">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-blue-400">월 예상 반복 지출</span>
                        </div>
                        <p className="text-2xl font-bold text-foreground font-mono tracking-tight">
                            {formatCurrency(summary?.totalMonthly || 0)}
                        </p>
                        <div className="mt-3 space-y-1">
                            <div className="flex justify-between text-[10px]">
                                <span className="text-muted-foreground">KRW</span>
                                <span className="font-medium text-foreground">{formatCurrency(summary?.totalMonthlyKRW || 0, 'KRW')}</span>
                            </div>
                            <div className="flex justify-between text-[10px]">
                                <span className="text-muted-foreground">USD</span>
                                <span className="font-medium text-foreground">{formatCurrency(summary?.totalMonthlyUSD || 0, 'USD')}</span>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-zinc-800/50">
                            <p className="text-[10px] text-muted-foreground/60 leading-relaxed">
                                환율은 하나은행 매매기준율 기준으로 매일 자동 업데이트됩니다.
                            </p>
                            <p className="text-[10px] text-blue-500/80 mt-1 font-medium text-right">
                                적용 환율: 1 USD = {formatCurrency(summary?.exchangeRate || 1400, 'KRW')}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="p-4 bg-muted/30 border border-border rounded-xl backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row gap-4">
                    <form onSubmit={handleSearch} className="flex-1 relative">
                        <Input
                            id="search"
                            placeholder="계약명으로 검색..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-background border-input pl-10"
                        />
                        <div className="absolute left-3 top-3 text-muted-foreground">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </form>
                    <div className="flex gap-4 w-full sm:w-auto">
                        <Select
                            id="typeFilter"
                            options={typeOptions}
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="bg-background border-input min-w-[140px]"
                        />
                        <Select
                            id="statusFilter"
                            options={statusOptions}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-background border-input min-w-[140px]"
                        />
                    </div>
                </div>
            </div>

            {/* Contract List */}
            {isLoading ? (
                <div className="space-y-4 animate-pulse">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-24 bg-muted/50 border border-border rounded-xl" />
                    ))}
                </div>
            ) : contracts.length === 0 ? (
                <div className="text-center py-20 bg-muted/20 border border-dashed border-border rounded-xl">
                    <div className="w-16 h-16 rounded-full bg-secondary border border-border flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <span className="text-3xl">📭</span>
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">등록된 계약이 없습니다</h3>
                    <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                        매월 나가는 구독료, 갱신이 필요한 계약들을<br />지금 바로 등록하고 관리해보세요.
                    </p>
                    <Link href="/contracts/new">
                        <Button variant="outline" className="border-border hover:bg-accent hover:text-accent-foreground">
                            첫 계약 등록하기
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {contracts.map((contract) => (
                        <ContractCard
                            key={contract.id}
                            contract={contract}
                            exchangeRate={summary?.exchangeRate}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
