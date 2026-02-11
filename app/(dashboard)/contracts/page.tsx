'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Contract } from '@/types';
import { ContractCard } from '@/components/contracts/contract-card';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { useContracts } from '@/hooks/use-contracts';
import { useOrganization } from '@/contexts/OrganizationContext';
import { useExchangeRate } from '@/hooks/use-exchange-rate';

export const dynamic = 'force-dynamic';

export default function ContractsPage() {
    const { contracts, isLoading: isContractsLoading } = useContracts();
    const { organization, isAdmin, isLoading: isOrgLoading } = useOrganization();
    const { rate: exchangeRate } = useExchangeRate();

    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('active');

    // Filter contracts locally
    const filteredContracts = useMemo(() => {
        return contracts.filter(contract => {
            const matchesSearch = contract.name.toLowerCase().includes(search.toLowerCase()) ||
                (contract.memo && contract.memo.toLowerCase().includes(search.toLowerCase()));
            const matchesType = typeFilter === 'all' || contract.type === typeFilter;
            const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;

            return matchesSearch && matchesType && matchesStatus;
        });
    }, [contracts, search, typeFilter, statusFilter]);

    const summary = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let urgent = 0;
        let warning = 0;
        let normal = 0;
        let totalMonthlyKRW = 0;
        let totalMonthlyUSD = 0;

        // Calculate summary based on ACTIVE contracts in the filtered list (or all active? Usually summary is for all active)
        // Let's use ALL active contracts for the top summary cards, regardless of current filters, 
        // to give a complete overview. Filters apply to the list below.
        contracts.filter((contract) => contract.status === 'active').forEach((contract) => {
            const expiresAt = new Date(contract.expires_at);
            expiresAt.setHours(0, 0, 0, 0);
            const diff = Math.ceil((expiresAt.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

            if (diff <= 7) urgent++;
            else if (diff <= 30) warning++;
            else normal++;

            const amount = Number(contract.amount);
            const monthlyAmount = contract.cycle === 'yearly' ? Math.round(amount / 12) : amount;

            if (contract.currency === 'USD') totalMonthlyUSD += monthlyAmount;
            else totalMonthlyKRW += monthlyAmount;
        });

        const totalMonthly = totalMonthlyKRW + (totalMonthlyUSD * exchangeRate);

        return {
            urgent,
            warning,
            normal,
            totalMonthly,
            totalMonthlyKRW,
            totalMonthlyUSD,
            exchangeRate,
        };
    }, [contracts, exchangeRate]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
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

    if (isContractsLoading || isOrgLoading) {
        return (
            <div className="space-y-4 animate-pulse w-full">
                <div className="flex justify-between items-center mb-8">
                    <div className="h-8 w-32 bg-zinc-900/50 rounded-lg"></div>
                    <div className="h-10 w-24 bg-zinc-900/50 rounded-lg"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-24 bg-zinc-900/30 rounded-xl border border-zinc-800" />
                    ))}
                </div>
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 bg-zinc-900/30 rounded-xl border border-zinc-800" />
                ))}
            </div>
        );
    }


    return (
        <div className="space-y-8 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">계약 관리</h1>
                    <p className="text-sm text-muted-foreground mt-1">
{organization ? `${organization.name} 팀의 등록된 계약 ${contracts.length}개` : `등록된 계약 ${contracts.length}개`}
                    </p>
                </div>
                {isAdmin && (
                    <Link href="/contracts/new">
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 w-full sm:w-auto">
                            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            새 계약 등록
                        </Button>
                    </Link>
                )}
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

                <Card className="bg-gradient-to-br from-zinc-900 to-black border-zinc-800">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-blue-400">월 예상 반복 지출</span>
                        </div>
                        <p className="text-2xl font-bold text-foreground font-mono tracking-tight">
                            {formatCurrency(summary.totalMonthly)}
                        </p>
                        <div className="mt-3 space-y-1">
                            <div className="flex justify-between text-[10px]">
                                <span className="text-muted-foreground">KRW</span>
                                <span className="font-medium text-foreground">{formatCurrency(summary.totalMonthlyKRW, 'KRW')}</span>
                            </div>
                            <div className="flex justify-between text-[10px]">
                                <span className="text-muted-foreground">USD</span>
                                <span className="font-medium text-foreground">{formatCurrency(summary.totalMonthlyUSD, 'USD')}</span>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-zinc-800/50">
                            <p className="text-[10px] text-muted-foreground/60 leading-relaxed">
                                환율은 하나은행 매매기준율 기준으로 매일 자동 업데이트됩니다.
                            </p>
                            <p className="text-[10px] text-blue-500/80 mt-1 font-medium text-right">
                                적용 환율: 1 USD = {formatCurrency(exchangeRate, 'KRW')}
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
            {contracts.length === 0 ? (
                <div className="text-center py-20 bg-muted/20 border border-dashed border-border rounded-xl">
                    <div className="w-16 h-16 rounded-full bg-secondary border border-border flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <span className="text-3xl">📭</span>
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">등록된 계약이 없습니다</h3>
                    <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                        {isAdmin
                            ? "매월 나가는 구독료, 갱신이 필요한 계약들을<br />지금 바로 등록하고 관리해보세요."
                            : "관리자에게 계약 등록을 요청하세요."}
                    </p>
                    {isAdmin && (
                        <Link href="/contracts/new">
                            <Button variant="outline" className="border-border hover:bg-accent hover:text-accent-foreground">
                                첫 계약 등록하기
                            </Button>
                        </Link>
                    )}
                </div>
            ) : filteredContracts.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-muted-foreground">검색 결과가 없습니다.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredContracts.map((contract) => (
                        <ContractCard
                            key={contract.id}
                            contract={contract as Contract}
                            exchangeRate={exchangeRate}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
