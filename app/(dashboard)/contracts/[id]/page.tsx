'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Contract, CONTRACT_TYPE_LABELS, PAYMENT_CYCLE_LABELS, CONTRACT_STATUS_LABELS } from '@/types';
import { ContractForm } from '@/components/contracts/contract-form';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ConfirmModal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';
import { formatCurrency, getDaysUntil, getUrgencyLevel, formatDDay, formatDate } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';

export default function ContractDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { addToast } = useToast();
    const [contract, setContract] = useState<Contract | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showRenewModal, setShowRenewModal] = useState(false);
    const [showTerminateModal, setShowTerminateModal] = useState(false);
    const [nextExpiresAt, setNextExpiresAt] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        fetchContract();
    }, [params.id]);

    const fetchContract = async () => {
        const res = await fetch(`/api/contracts/${params.id}`);
        if (res.ok) {
            const data = await res.json();
            setContract(data);
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
            addToast('error', '삭제에 실패했습니다.');
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
            addToast('error', '처리에 실패했습니다.');
        }
        setIsProcessing(false);
        setShowRenewModal(false);
    };

    const handleTerminate = async () => {
        setIsProcessing(true);
        const res = await fetch(`/api/contracts/${params.id}/terminate`, {
            method: 'POST',
        });
        if (res.ok) {
            addToast('success', '해지 완료 처리되었습니다.');
            fetchContract();
        } else {
            addToast('error', '처리에 실패했습니다.');
        }
        setIsProcessing(false);
        setShowTerminateModal(false);
    };

    if (isLoading) {
        return <div className="max-w-2xl mx-auto"><div className="h-64 bg-dark-card border border-dark-border rounded-xl animate-pulse" /></div>;
    }

    if (!contract) {
        return (
            <div className="text-center py-16">
                <h2 className="text-xl font-semibold mb-2">계약을 찾을 수 없습니다</h2>
                <Button variant="ghost" onClick={() => router.push('/contracts')}>목록으로 돌아가기</Button>
            </div>
        );
    }

    if (isEditing) {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">계약 수정</h1>
                    <Button variant="ghost" onClick={() => setIsEditing(false)}>취소</Button>
                </div>
                <ContractForm contract={contract} mode="edit" />
            </div>
        );
    }

    const daysUntil = getDaysUntil(contract.expires_at);
    const urgency = contract.status === 'active' ? getUrgencyLevel(daysUntil) : 'default' as const;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <button
                        onClick={() => router.push('/contracts')}
                        className="text-text-secondary hover:text-text-primary text-sm mb-2 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        계약 목록
                    </button>
                    <h1 className="text-2xl font-bold">{contract.name}</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>수정</Button>
                    <Button variant="danger" size="sm" onClick={() => setShowDeleteModal(true)}>삭제</Button>
                </div>
            </div>

            {/* Status Banner */}
            {contract.status === 'active' && daysUntil <= 30 && (
                <div className={`p-4 rounded-lg border ${daysUntil <= 7
                        ? 'bg-danger-bg border-danger/20 text-danger'
                        : 'bg-warning-bg border-warning/20 text-warning'
                    }`}>
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <span className="font-medium">
                            {daysUntil <= 0
                                ? '만기일이 지났습니다!'
                                : `만기까지 ${daysUntil}일 남았습니다.`}
                        </span>
                    </div>
                </div>
            )}

            {/* Contract Details */}
            <Card>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-text-tertiary mb-1">유형</p>
                        <p className="text-sm font-medium">{CONTRACT_TYPE_LABELS[contract.type]}</p>
                    </div>
                    <div>
                        <p className="text-xs text-text-tertiary mb-1">상태</p>
                        <Badge variant={urgency}>{CONTRACT_STATUS_LABELS[contract.status]}</Badge>
                    </div>
                    <div>
                        <p className="text-xs text-text-tertiary mb-1">금액</p>
                        <p className="text-sm font-mono font-medium">{formatCurrency(contract.amount, contract.currency)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-text-tertiary mb-1">결제 주기</p>
                        <p className="text-sm font-medium">{PAYMENT_CYCLE_LABELS[contract.cycle]}</p>
                    </div>
                    <div>
                        <p className="text-xs text-text-tertiary mb-1">만기일</p>
                        <p className="text-sm font-medium">{formatDate(contract.expires_at)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-text-tertiary mb-1">D-Day</p>
                        <p className="text-sm font-medium">{contract.status === 'active' ? formatDDay(daysUntil) : '-'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-text-tertiary mb-1">자동갱신</p>
                        <p className="text-sm font-medium">{contract.auto_renew ? '예' : '아니오'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-text-tertiary mb-1">해지 통보 기한</p>
                        <p className="text-sm font-medium">{contract.notice_days}일 전</p>
                    </div>
                    {contract.memo && (
                        <div className="col-span-2">
                            <p className="text-xs text-text-tertiary mb-1">메모</p>
                            <p className="text-sm text-text-secondary">{contract.memo}</p>
                        </div>
                    )}
                </div>
            </Card>

            {/* Actions */}
            {contract.status === 'active' && (
                <div className="flex gap-3">
                    <Button variant="secondary" className="flex-1" onClick={() => setShowRenewModal(true)}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        갱신 완료
                    </Button>
                    <Button variant="secondary" className="flex-1" onClick={() => setShowTerminateModal(true)}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        해지 완료
                    </Button>
                </div>
            )}

            {/* Delete Modal */}
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="계약 삭제"
                message={`"${contract.name}" 계약을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
                confirmText="삭제"
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
                        <Button onClick={handleRenew} isLoading={isProcessing} disabled={!nextExpiresAt}>확인</Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <p className="text-text-secondary text-sm">다음 만기일을 설정해주세요.</p>
                    <Input
                        id="nextExpiresAt"
                        label="다음 만기일"
                        type="date"
                        value={nextExpiresAt}
                        onChange={(e) => setNextExpiresAt(e.target.value)}
                        required
                    />
                </div>
            </Modal>

            {/* Terminate Modal */}
            <ConfirmModal
                isOpen={showTerminateModal}
                onClose={() => setShowTerminateModal(false)}
                onConfirm={handleTerminate}
                title="해지 완료 처리"
                message={`"${contract.name}" 계약을 해지 완료로 처리하시겠습니까?`}
                confirmText="해지 완료"
                isLoading={isProcessing}
            />
        </div>
    );
}
