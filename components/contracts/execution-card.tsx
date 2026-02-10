import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CancellationGuide, Contract } from '@/types';
import { calculateEstimatedAnnualSavings, formatCurrency, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Modal, ConfirmModal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';

interface CancellationExecutionCardProps {
    contract: Contract;
    guide?: CancellationGuide | null;
    exchangeRate?: number;
    onDecisionComplete?: (contractId: string) => void;
}

export function CancellationExecutionCard({ contract, guide, exchangeRate, onDecisionComplete }: CancellationExecutionCardProps) {
    const router = useRouter();
    const { addToast } = useToast();
    const [showKeepModal, setShowKeepModal] = useState(false);
    const [showGuideModal, setShowGuideModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const savings = calculateEstimatedAnnualSavings(contract.amount, contract.cycle);

    const handleKeepDecision = async () => {
        setIsProcessing(true);
        try {
            const res = await fetch(`/api/contracts/${contract.id}/keep`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (res.ok) {
                addToast('success', '유지 결정이 기록되었습니다.');
                setShowKeepModal(false);
                onDecisionComplete?.(contract.id);
                router.refresh();
            } else {
                const error = await res.json();
                addToast('error', error.error || '처리 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error(error);
            addToast('error', '네트워크 오류가 발생했습니다.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            <Card className="border-orange-500/20 bg-orange-500/5 overflow-hidden">
                <CardContent className="p-6">
                    <div className="flex flex-col gap-6">
                        <div>
                            <h3 className="text-lg font-bold text-foreground mb-1">{contract.name} 갱신 예정</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                해지를 고려 중이라면 마감 전에 진행하세요. 잊혀진 자동 결제는 곧 확정된 손실이 됩니다.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-orange-500">✔</span>
                                    <span className="text-muted-foreground">해지 마감일:</span>
                                    <span className="font-bold text-foreground">{formatDate(contract.expires_at)}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-orange-500">✔</span>
                                        <span className="text-muted-foreground">예상 절감액:</span>
                                        <span className="font-bold text-foreground">
                                            {contract.currency === 'USD' && exchangeRate
                                                ? formatCurrency(savings * exchangeRate, 'KRW')
                                                : formatCurrency(savings, contract.currency)
                                            } / 연
                                        </span>
                                    </div>
                                    {contract.currency === 'USD' && (
                                        <div className="pl-6 text-[10px] text-muted-foreground font-medium">
                                            ({formatCurrency(savings, 'USD')} 상당)
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-orange-500">✔</span>
                                    <span className="text-muted-foreground">예상 소요 시간:</span>
                                    <span className="font-bold text-foreground">약 2분</span>
                                </div>
                            </div>

                            {guide && (
                                <div className="p-4 bg-zinc-900/50 rounded-xl border border-white/5">
                                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">해지 방법 안내</h4>
                                    <div className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap mb-4 line-clamp-3">
                                        {guide.steps}
                                    </div>
                                    {guide.penalty_notes && (
                                        <p className="text-[10px] text-orange-400 font-medium">
                                            주의: {guide.penalty_notes}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            {guide?.cancellation_url ? (
                                <a
                                    href={guide.cancellation_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1"
                                >
                                    <Button className="w-full bg-foreground text-background hover:bg-zinc-200 font-black">
                                        해지 페이지로 이동
                                    </Button>
                                </a>
                            ) : (
                                <Button
                                    className="flex-1 bg-foreground text-background hover:bg-zinc-200 font-black"
                                    onClick={() => setShowGuideModal(true)}
                                >
                                    해지 방법 보기
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                className="flex-1 border-orange-500/20 hover:bg-orange-500/10 text-orange-500 font-bold"
                                onClick={() => setShowKeepModal(true)}
                            >
                                유지하기 (결정 완료)
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Guide Modal (Empty State) */}
            <Modal
                isOpen={showGuideModal}
                onClose={() => setShowGuideModal(false)}
                title="해지 안내"
                footer={
                    <Button onClick={() => setShowGuideModal(false)}>
                        확인
                    </Button>
                }
            >
                <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                        현재 <strong>{contract.name}</strong>의 해지 프로세스를 정리하고 있습니다.<br />
                        직접 해지 페이지를 찾으시려면 서비스 설정의 &apos;구독&apos; 또는 &apos;결제&apos; 메뉴를 확인해주세요.
                    </p>
                </div>
            </Modal>

            {/* Keep Decision Confirm Modal */}
            <ConfirmModal
                isOpen={showKeepModal}
                onClose={() => setShowKeepModal(false)}
                onConfirm={handleKeepDecision}
                title="이 계약을 유지하기로 결정하셨나요?"
                message="확인하면 이 계약은 &apos;유지&apos;로 기록되고 긴급/주의 목록에서 즉시 제외됩니다."
                confirmText="유지 결정 확정"
                isLoading={isProcessing}
            />
        </>
    );
}
