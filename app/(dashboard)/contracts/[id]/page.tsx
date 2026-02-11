'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Contract, CONTRACT_TYPE_LABELS, PAYMENT_CYCLE_LABELS, CONTRACT_STATUS_LABELS, CancellationGuide } from '@/types';
import { ContractForm } from '@/components/contracts/contract-form';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ConfirmModal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';
import { formatCurrency, getDaysUntil, getUrgencyLevel, formatDDay, formatDate, calculateEstimatedAnnualSavings } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { CancellationExecutionCard } from '@/components/contracts/execution-card';
import { useOrganization } from '@/contexts/OrganizationContext';

export const dynamic = 'force-dynamic';

export default function ContractDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { addToast } = useToast();
    const { isAdmin } = useOrganization();
    const [contract, setContract] = useState<Contract | null>(null);
    const [guide, setGuide] = useState<CancellationGuide | null>(null);
    const [exchangeRate, setExchangeRate] = useState<number>(1400);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showRenewModal, setShowRenewModal] = useState(false);
    const [showTerminateModal, setShowTerminateModal] = useState(false);
    const [nextExpiresAt, setNextExpiresAt] = useState('');
    const [savedAmount, setSavedAmount] = useState<string>('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        fetchContract();
    }, [params.id]);

    const fetchContract = async () => {
        setIsLoading(true);
        const [res, summaryRes] = await Promise.all([
            fetch(`/api/contracts/${params.id}`),
            fetch('/api/dashboard/summary')
        ]);

        if (res.ok) {
            const data = await res.json();
            setContract(data);
            setSavedAmount(calculateEstimatedAnnualSavings(data.amount, data.cycle).toString());

            // Fetch cancellation guide
            const guideRes = await fetch(`/api/contracts/guide?name=${encodeURIComponent(data.name)}`);
            if (guideRes.ok) {
                setGuide(await guideRes.json());
            }
        }
        if (summaryRes.ok) {
            const summary = await summaryRes.json();
            setExchangeRate(summary.exchangeRate);
        }
        setIsLoading(false);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        const res = await fetch(`/api/contracts/${params.id}`, { method: 'DELETE' });
        if (res.ok) {
            addToast('success', '계약이 삭제되었습니다.');
            router.push('/contracts');
        } else {
            addToast('error', '삭제 처리 중 오류가 발생했습니다.');
        }
        setIsDeleting(false);
        setShowDeleteModal(false);
    };

    const handleRenew = async () => {
        if (!nextExpiresAt) return;
        setIsProcessing(true);
        const res = await fetch(`/api/contracts/${params.id}/renew`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ next_expires_at: nextExpiresAt }),
        });
        if (res.ok) {
            addToast('success', '갱신 완료 처리되었습니다.');
            fetchContract();
        } else {
            addToast('error', '갱신 처리에 실패했습니다.');
        }
        setIsProcessing(false);
        setShowRenewModal(false);
    };

    const handleTerminate = async () => {
        setIsProcessing(true);
        const res = await fetch(`/api/contracts/${params.id}/terminate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ saved_amount: Number(savedAmount) }),
        });
        if (res.ok) {
            addToast('success', '해지 완료! 절감된 비용이 기록되었습니다.');
            fetchContract();
        } else {
            addToast('error', '해지 처리에 실패했습니다. 잠시 후 다시 시도해주세요.');
        }
        setIsProcessing(false);
        setShowTerminateModal(false);
    };

    if (isLoading) {
        return <div className="max-w-3xl mx-auto"><div className="h-64 bg-slate-900/50 border border-slate-800 rounded-xl animate-pulse" /></div>;
    }

    if (!contract) {
        return (
            <div className="text-center py-20">
                <h2 className="text-xl font-semibold mb-2 text-slate-200">계약을 찾을 수 없습니다</h2>
                <Button variant="ghost" onClick={() => router.push('/contracts')} className="text-slate-400 hover:text-white">목록으로 돌아가기</Button>
            </div>
        );
    }

    if (isEditing) {
        return (
            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white">계약 수정</h1>
                    <Button variant="ghost" onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-white">
                        취소
                    </Button>
                </div>
                <ContractForm contract={contract} mode="edit" />
            </div>
        );
    }

    const daysUntil = getDaysUntil(contract.expires_at);

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <button
                        onClick={() => router.push('/contracts')}
                        className="text-slate-500 hover:text-slate-300 text-sm mb-2 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        목록으로
                    </button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-white">{contract.name}</h1>
                        {contract.status === 'active' && (
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getUrgencyLevel(daysUntil) === 'danger'
                                ? 'bg-red-500/10 text-red-500 border-red-500/20'
                                : getUrgencyLevel(daysUntil) === 'warning'
                                    ? 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                                    : 'bg-green-500/10 text-green-500 border-green-500/20'
                                }`}>
                                {formatDDay(daysUntil)}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {isAdmin && (
                        <>
                            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="border-slate-700 hover:bg-slate-800 text-slate-300">
                                수정
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setShowDeleteModal(true)} className="text-red-400 hover:bg-red-500/10 hover:text-red-300">
                                삭제
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Decision Execution Card */}
            {contract.status === 'active' && (daysUntil <= 30 || guide) && isAdmin && (
                <CancellationExecutionCard
                    contract={contract}
                    guide={guide}
                    exchangeRate={exchangeRate}
                />
            )}

            {/* Contract Details */}
            <Card className="border-slate-800 bg-slate-900/50">
                <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-slate-500">계약 금액</p>
                            <p className="text-2xl font-mono font-bold text-white tracking-tight">{formatCurrency(contract.amount, contract.currency)}</p>
                            <p className="text-sm text-slate-500">{PAYMENT_CYCLE_LABELS[contract.cycle]} 결제</p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm font-medium text-slate-500">만기일</p>
                            <p className="text-2xl font-bold text-white tracking-tight">{formatDate(contract.expires_at)}</p>
                            <p className="text-sm text-slate-500">
                                {contract.auto_renew ? '🔄 자동갱신 설정됨' : '⏹ 자동갱신 없음'}
                            </p>
                        </div>

                        <div className="border-t border-slate-800 col-span-1 md:col-span-2 my-2"></div>

                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">유형</p>
                            <p className="text-base font-medium text-slate-200">{CONTRACT_TYPE_LABELS[contract.type]}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">현재 상태</p>
                            <p className="text-base font-medium text-slate-200">{CONTRACT_STATUS_LABELS[contract.status]}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">해지 통보 기한</p>
                            <p className="text-base font-medium text-slate-200">만기 {contract.notice_days}일 전까지</p>
                        </div>

                        {contract.memo && (
                            <div className="col-span-1 md:col-span-2 bg-slate-950/50 p-4 rounded-lg border border-slate-800">
                                <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">Memo</p>
                                <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">{contract.memo}</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Actions */}
            {contract.status === 'active' && isAdmin && (
                <div className="flex flex-col sm:flex-row gap-4 p-6 bg-slate-900/30 border border-slate-800/50 rounded-xl">
                    <div className="flex-1">
                        <h3 className="text-base font-semibold text-white mb-1">계약 상태 변경</h3>
                        <p className="text-sm text-slate-500">계약이 갱신되었거나 해지된 경우 상태를 변경하세요.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="secondary" onClick={() => setShowRenewModal(true)} className="bg-green-600/10 text-green-500 hover:bg-green-600/20 border-green-600/20 hover:border-green-600/40">
                            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            갱신 완료
                        </Button>
                        <Button variant="secondary" onClick={() => setShowTerminateModal(true)} className="bg-slate-800 text-slate-300 hover:bg-slate-700">
                            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            해지 완료
                        </Button>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="계약 삭제"
                message={`"${contract.name}" 계약을 정말 삭제하시겠습니까?
                
주의: 해지 완료된 계약이라도 '삭제'하면 절감 비용 통계에서 제외됩니다.
서비스를 해지하셨다면 삭제 대신 [해지 완료] 버튼을 눌러주세요.`}
                confirmText="삭제 (통계 제외)"
                isLoading={isDeleting}
            />

            {/* Renew Modal */}
            <Modal
                isOpen={showRenewModal}
                onClose={() => setShowRenewModal(false)}
                title="갱신 완료 처리"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setShowRenewModal(false)}>취소</Button>
                        <Button onClick={handleRenew} isLoading={isProcessing} disabled={!nextExpiresAt} className="bg-blue-600">확인</Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <p className="text-slate-400 text-sm">다음 만기일을 설정해주세요.</p>
                    <Input
                        id="nextExpiresAt"
                        label="다음 만기일"
                        type="date"
                        value={nextExpiresAt}
                        onChange={(e) => setNextExpiresAt(e.target.value)}
                        required
                        className="bg-slate-950 border-slate-700"
                    />
                </div>
            </Modal>

            {/* Terminate Modal */}
            <Modal
                isOpen={showTerminateModal}
                onClose={() => setShowTerminateModal(false)}
                title="해지 완료 처리"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setShowTerminateModal(false)}>취소</Button>
                        <Button onClick={handleTerminate} isLoading={isProcessing} className="bg-orange-600">해지 확인</Button>
                    </>
                }
            >
                <div className="space-y-6">
                    <div>
                        <p className="text-white font-medium mb-1">"{contract.name}" 계약을 해지 완료로 처리하시겠습니까?</p>
                        <p className="text-slate-400 text-sm">해지 후에는 더 이상 알림이 발송되지 않습니다.</p>
                    </div>

                    <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500">이번 결정으로 방어한 연간 비용</label>
                            <div className="flex flex-col gap-1">
                                <Input
                                    id="savedAmount"
                                    type="number"
                                    value={savedAmount}
                                    onChange={(e) => setSavedAmount(e.target.value)}
                                    className="bg-slate-900 border-slate-700 font-mono text-lg text-green-500"
                                    autoFocus
                                />
                                <p className="text-[10px] text-slate-500">
                                    {contract.currency === 'USD'
                                        ? `≈ ${formatCurrency(Number(savedAmount) * exchangeRate, 'KRW')} (현재 환율 기준)`
                                        : `${formatCurrency(Number(savedAmount), contract.currency)} 가 연간 절감 비용으로 기록됩니다.`
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
