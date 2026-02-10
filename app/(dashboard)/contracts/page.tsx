'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Contract } from '@/types';
import { ContractCard } from '@/components/contracts/contract-card';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import Link from 'next/link';

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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">계약 관리</h1>
                    <p className="text-sm text-text-secondary mt-1">
                        등록된 계약 {contracts.length}개
                    </p>
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

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <form onSubmit={handleSearch} className="flex-1">
                    <Input
                        id="search"
                        placeholder="계약명으로 검색..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </form>
                <div className="flex gap-3">
                    <Select
                        id="typeFilter"
                        options={typeOptions}
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                    />
                    <Select
                        id="statusFilter"
                        options={statusOptions}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    />
                </div>
            </div>

            {/* Contract List */}
            {isLoading ? (
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-[72px] bg-dark-card border border-dark-border rounded-lg animate-pulse" />
                    ))}
                </div>
            ) : contracts.length === 0 ? (
                <div className="text-center py-16">
                    <div className="w-16 h-16 rounded-full bg-dark-card border border-dark-border flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-text-primary mb-1">등록된 계약이 없습니다</h3>
                    <p className="text-sm text-text-secondary mb-4">
                        첫 번째 계약을 등록하고 만기 알림을 받아보세요.
                    </p>
                    <Link href="/contracts/new">
                        <Button>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            새 계약 등록
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-2">
                    {contracts.map((contract) => (
                        <ContractCard key={contract.id} contract={contract} />
                    ))}
                </div>
            )}
        </div>
    );
}
