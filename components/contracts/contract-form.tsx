'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Select, Textarea } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
        <Card className="border-slate-800 bg-slate-900/50">
            <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {mode === 'create' && (
                        <div className="space-y-3 mb-8 p-4 bg-slate-900/80 border border-slate-800 rounded-lg">
                            <label className="text-sm font-medium text-slate-400">간편 입력 (자주 쓰는 서비스)</label>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { name: 'Adobe Creative Cloud', type: 'saas', amount: 62000, cycle: 'monthly', notice_days: 14 },
                                    { name: 'AWS', type: 'saas', amount: 0, cycle: 'monthly', notice_days: 30 },
                                    { name: 'Slack', type: 'saas', amount: 11000, cycle: 'monthly', notice_days: 30 },
                                    { name: 'Google Workspace', type: 'saas', amount: 15000, cycle: 'monthly', notice_days: 30 },
                                    { name: 'Microsoft 365', type: 'saas', amount: 12500, cycle: 'monthly', notice_days: 30 },
                                    { name: 'Notion', type: 'saas', amount: 12000, cycle: 'monthly', notice_days: 30 },
                                ].map((preset) => (
                                    <button
                                        key={preset.name}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, ...preset } as ContractFormData)}
                                        className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-full border border-slate-700 transition-colors"
                                    >
                                        + {preset.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <Input
                        id="name"
                        label="서비스/계약명 *"
                        placeholder="예: Figma, AWS, 사무실 임대"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="bg-slate-950/50 border-slate-700"
                    />

                    <Select
                        id="type"
                        label="유형 *"
                        options={typeOptions}
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as ContractFormData['type'] })}
                        className="bg-slate-950/50 border-slate-700"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="col-span-2 sm:col-span-1">
                            <Input
                                id="amount"
                                label="금액 *"
                                type="number"
                                placeholder="0"
                                value={formData.amount || ''}
                                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                                required
                                className="bg-slate-950/50 border-slate-700"
                            />
                        </div>
                        <Select
                            id="currency"
                            label="통화"
                            options={currencyOptions}
                            value={formData.currency}
                            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                            className="bg-slate-950/50 border-slate-700"
                        />
                        <Select
                            id="cycle"
                            label="결제 주기 *"
                            options={cycleOptions}
                            value={formData.cycle}
                            onChange={(e) => setFormData({ ...formData, cycle: e.target.value as ContractFormData['cycle'] })}
                            className="bg-slate-950/50 border-slate-700"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Input
                            id="expires_at"
                            label="만기일 (다음 결제일) *"
                            type="date"
                            value={formData.expires_at}
                            onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                            required
                            className="bg-slate-950/50 border-slate-700"
                        />
                        <div className="space-y-2">
                            <Input
                                id="notice_days"
                                label="해지 통보 (만기 D-? 일 전)"
                                type="number"
                                placeholder="30"
                                value={formData.notice_days}
                                onChange={(e) => setFormData({ ...formData, notice_days: Number(e.target.value) })}
                                className="bg-slate-950/50 border-slate-700"
                            />
                            <p className="text-xs text-slate-500">
                                * 자동갱신을 막으려면 만기 며칠 전까지 해지 통보를 해야 하나요?
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-slate-950/30 rounded-lg border border-slate-800">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, auto_renew: !formData.auto_renew })}
                            className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer ${formData.auto_renew ? 'bg-blue-600' : 'bg-slate-700'
                                }`}
                        >
                            <div
                                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${formData.auto_renew ? 'translate-x-5' : ''
                                    }`}
                            />
                        </button>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-slate-200 cursor-pointer" onClick={() => setFormData({ ...formData, auto_renew: !formData.auto_renew })}>자동갱신 여부</label>
                            <span className="text-xs text-slate-500">체크하면 만기일이 지나도 '갱신'으로 표시됩니다.</span>
                        </div>
                    </div>

                    <Textarea
                        id="memo"
                        label="메모"
                        placeholder="계약 관련 메모, 담당자 연락처 등을 입력하세요"
                        value={formData.memo}
                        onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
                        className="bg-slate-950/50 border-slate-700 min-h-[100px]"
                    />

                    <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
                        <Button type="submit" isLoading={isLoading} className="flex-1 bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20">
                            {mode === 'create' ? '계약 등록하기' : '변경사항 저장'}
                        </Button>
                        <Button type="button" variant="ghost" onClick={() => router.back()} className="text-slate-400 hover:text-white">
                            취소
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
