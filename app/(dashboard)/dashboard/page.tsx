'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Contract, DashboardSummary } from '@/types';
import { ContractCard } from '@/components/contracts/contract-card';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

export default function DashboardPage() {
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [upcoming, setUpcoming] = useState<Contract[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch('/api/dashboard/summary').then((r) => r.json()),
            fetch('/api/dashboard/upcoming').then((r) => r.json()),
        ]).then(([summaryData, upcomingData]) => {
            setSummary(summaryData);
            setUpcoming(upcomingData);
            setIsLoading(false);
        });
    }, []);

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-28 bg-dark-card border border-dark-border rounded-xl animate-pulse" />
                    ))}
                </div>
                <div className="h-96 bg-dark-card border border-dark-border rounded-xl animate-pulse" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">대시보드</h1>
                    <p className="text-sm text-text-secondary mt-1">계약 및 구독 현황을 한눈에 확인하세요.</p>
                </div>
                <Link href="/contracts/new">
                    <Button>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        새 계약 등록
                    </Button>
                </Link>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-text-tertiary">긴급 (D-7 이내)</span>
                        <Badge variant="danger">{summary?.urgent || 0}</Badge>
                    </div>
                    <p className="text-2xl font-bold text-danger">{summary?.urgent || 0}<span className="text-sm font-normal text-text-tertiary ml-1">건</span></p>
                </Card>

                <Card>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-text-tertiary">주의 (D-30 이내)</span>
                        <Badge variant="warning">{summary?.warning || 0}</Badge>
                    </div>
                    <p className="text-2xl font-bold text-warning">{summary?.warning || 0}<span className="text-sm font-normal text-text-tertiary ml-1">건</span></p>
                </Card>

                <Card>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-text-tertiary">정상</span>
                        <Badge variant="success">{summary?.normal || 0}</Badge>
                    </div>
                    <p className="text-2xl font-bold text-success">{summary?.normal || 0}<span className="text-sm font-normal text-text-tertiary ml-1">건</span></p>
                </Card>

                <Card>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-text-tertiary">월 구독료 합계</span>
                    </div>
                    <p className="text-2xl font-bold font-mono">{formatCurrency(summary?.totalMonthly || 0)}</p>
                    <p className="text-xs text-text-tertiary mt-1">연간 {formatCurrency(summary?.totalYearly || 0)}</p>
                </Card>
            </div>

            {/* Upcoming Contracts */}
            <Card>
                <CardHeader>
                    <CardTitle>만기 임박 계약</CardTitle>
                    <Link href="/contracts">
                        <Button variant="ghost" size="sm">전체 보기 →</Button>
                    </Link>
                </CardHeader>
                <CardContent>
                    {upcoming.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-14 h-14 rounded-full bg-dark-hover flex items-center justify-center mx-auto mb-3">
                                <svg className="w-7 h-7 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-sm font-medium text-text-primary mb-1">모든 계약이 안전합니다</h3>
                            <p className="text-xs text-text-secondary">등록된 활성 계약이 없습니다.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {upcoming.map((contract) => (
                                <ContractCard key={contract.id} contract={contract} />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
