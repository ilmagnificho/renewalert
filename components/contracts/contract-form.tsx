'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Select, Textarea } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';
import type { Contract, ContractFormData } from '@/types';

interface ContractFormProps {
    contract?: Contract;
    mode: 'create' | 'edit';
}

export function ContractForm({ contract, mode }: ContractFormProps) {
    const router = useRouter();
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<ContractFormData>({
        name: contract?.name || '',
        type: contract?.type || 'saas',
        amount: contract?.amount || 0,
        currency: contract?.currency || 'KRW',
        cycle: contract?.cycle || 'yearly',
        expires_at: contract?.expires_at || '',
        auto_renew: contract?.auto_renew || false,
        notice_days: contract?.notice_days || 30,
        memo: contract?.memo || '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const url = mode === 'create'
                ? '/api/contracts'
                : `/api/contracts/${contract?.id}`;
            const method = mode === 'create' ? 'POST' : 'PUT';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const error = await res.json();
                if (res.status === 403) {
                    addToast('error', 'Free 플랜은 계약 3개까지 등록 가능합니다. Pro 플랜으로 업그레이드하세요.');
                } else {
                    addToast('error', error.error || '저장에 실패했습니다.');
                }
                setIsLoading(false);
                return;
            }

            addToast('success', mode === 'create' ? '계약이 등록되었습니다.' : '계약이 수정되었습니다.');
            router.push('/contracts');
            router.refresh();
        } catch {
            addToast('error', '네트워크 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const typeOptions = [
        { value: 'saas', label: 'SaaS' },
        { value: 'rent', label: '임대' },
        { value: 'insurance', label: '보험' },
        { value: 'other', label: '기타' },
    ];

    const cycleOptions = [
        { value: 'monthly', label: '월간' },
        { value: 'yearly', label: '연간' },
        { value: 'onetime', label: '단건' },
    ];

    const currencyOptions = [
        { value: 'KRW', label: 'KRW (₩)' },
        { value: 'USD', label: 'USD ($)' },
    ];

    return (
        <Card>
            <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                    id="name"
                    label="서비스/계약명 *"
                    placeholder="예: Figma, AWS, 사무실 임대"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />

                <Select
                    id="type"
                    label="유형 *"
                    options={typeOptions}
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as ContractFormData['type'] })}
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input
                        id="amount"
                        label="금액 *"
                        type="number"
                        placeholder="0"
                        value={formData.amount || ''}
                        onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                        required
                    />
                    <Select
                        id="currency"
                        label="통화"
                        options={currencyOptions}
                        value={formData.currency}
                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    />
                    <Select
                        id="cycle"
                        label="결제 주기 *"
                        options={cycleOptions}
                        value={formData.cycle}
                        onChange={(e) => setFormData({ ...formData, cycle: e.target.value as ContractFormData['cycle'] })}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                        id="expires_at"
                        label="만기일 *"
                        type="date"
                        value={formData.expires_at}
                        onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                        required
                    />
                    <Input
                        id="notice_days"
                        label="해지 통보 기한 (일)"
                        type="number"
                        placeholder="30"
                        value={formData.notice_days}
                        onChange={(e) => setFormData({ ...formData, notice_days: Number(e.target.value) })}
                    />
                </div>

                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-text-secondary">자동갱신</label>
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, auto_renew: !formData.auto_renew })}
                        className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer ${formData.auto_renew ? 'bg-primary' : 'bg-dark-border'
                            }`}
                    >
                        <div
                            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${formData.auto_renew ? 'translate-x-5' : ''
                                }`}
                        />
                    </button>
                    <span className="text-sm text-text-tertiary">
                        {formData.auto_renew ? '예' : '아니오'}
                    </span>
                </div>

                <Textarea
                    id="memo"
                    label="메모"
                    placeholder="계약 관련 메모를 입력하세요"
                    value={formData.memo}
                    onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
                />

                <div className="flex items-center gap-3 pt-2">
                    <Button type="submit" isLoading={isLoading}>
                        {mode === 'create' ? '등록하기' : '수정하기'}
                    </Button>
                    <Button type="button" variant="ghost" onClick={() => router.back()}>
                        취소
                    </Button>
                </div>
            </form>
        </Card>
    );
}
