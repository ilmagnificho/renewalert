'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Contract } from '@/types';
import { ContractCard } from '@/components/contracts/contract-card';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

export default function ContractsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [contracts, setContracts] = useState<Contract[]>([]);
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
            // Mock Data
            const mockData: Contract[] = [
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
                    amount: 450000,
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
            setIsLoading(false);
            return;
        }

        const params = new URLSearchParams();
        if (typeFilter !== 'all') params.set('type', typeFilter);
        if (statusFilter !== 'all') params.set('status', statusFilter);
        if (search) params.set('search', search);

        const res = await fetch(`/api/contracts?${params.toString()}`);
        if (res.ok) {
            const data = await res.json();
            setContracts(data);
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
                    <h1 className="text-2xl font-bold text-white">계약 관리</h1>
                    <p className="text-sm text-slate-400 mt-1">
                        등록된 계약 {contracts.length}개
                    </p>
                </div>
                <Link href="/contracts/new">
                    <Button className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 w-full sm:w-auto">
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        새 계약 등록
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row gap-4">
                    <form onSubmit={handleSearch} className="flex-1 relative">
                        <Input
                            id="search"
                            placeholder="계약명으로 검색..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-slate-950/50 border-slate-700 pl-10"
                        />
                        <div className="absolute left-3 top-3 text-slate-500">
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
                            className="bg-slate-950/50 border-slate-700 min-w-[140px]"
                        />
                        <Select
                            id="statusFilter"
                            options={statusOptions}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-slate-950/50 border-slate-700 min-w-[140px]"
                        />
                    </div>
                </div>
            </div>

            {/* Contract List */}
            {isLoading ? (
                <div className="space-y-4 animate-pulse">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-24 bg-slate-800/50 border border-slate-800 rounded-xl" />
                    ))}
                </div>
            ) : contracts.length === 0 ? (
                <div className="text-center py-20 bg-slate-900/30 border border-dashed border-slate-800 rounded-xl">
                    <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <span className="text-3xl">📭</span>
                    </div>
                    <h3 className="text-lg font-medium text-slate-200 mb-2">등록된 계약이 없습니다</h3>
                    <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
                        매월 나가는 구독료, 갱신이 필요한 계약들을<br />지금 바로 등록하고 관리해보세요.
                    </p>
                    <Link href="/contracts/new">
                        <Button variant="outline" className="border-slate-700 hover:bg-slate-800">
                            첫 계약 등록하기
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {contracts.map((contract) => (
                        <ContractCard key={contract.id} contract={contract} />
                    ))}
                </div>
            )}
        </div>
    );
}
