'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PLAN_LIMITS } from '@/lib/utils';
import { Check } from 'lucide-react';

export default function PricingPage() {
    return (
        <div className="max-w-5xl mx-auto space-y-12 animate-fade-in py-10">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-black text-white tracking-tight">비용 절감 시스템 도입</h1>
                <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
                    단 한 건의 불필요한 자동 결제만 막아도 수십 배의 ROI를 제공합니다.<br />
                    회사의 규모와 계약 수에 맞는 플랜을 선택하세요.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Free Plan */}
                <Card className="flex flex-col border-slate-800 bg-black hover:border-slate-700 transition-all">
                    <CardHeader className="p-8 pb-0">
                        <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Adoption</CardTitle>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-black text-white">{PLAN_LIMITS.free.price}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                            개인이나 초기 스타트업을 위한<br />핵심 리스크 관리 도구
                        </p>
                    </CardHeader>
                    <CardContent className="p-8 flex-1">
                        <ul className="space-y-4">
                            <li className="flex items-start gap-2 text-sm text-slate-300">
                                <Check className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                                <span>최대 {PLAN_LIMITS.free.maxContracts}개 계약 관리</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-slate-300">
                                <Check className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                                <span>단일 알림 타이밍</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-slate-500">
                                <Check className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                                <span>기본 서비스 가이드</span>
                            </li>
                        </ul>
                    </CardContent>
                    <CardFooter className="p-8 pt-0">
                        <Button variant="outline" className="w-full border-slate-800 hover:bg-zinc-900 font-bold" disabled>
                            현재 이용 중
                        </Button>
                    </CardFooter>
                </Card>

                {/* Core Plan */}
                <Card className="flex flex-col border-blue-600/50 bg-zinc-900/50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 px-3 py-1 bg-blue-600 text-[10px] font-black text-white uppercase tracking-wider">Most Popular</div>
                    <CardHeader className="p-8 pb-0">
                        <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-blue-500 mb-2">Revenue Engine</CardTitle>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-black text-white">₩39,000</span>
                            <span className="text-sm text-slate-500">/ 월</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-4 leading-relaxed font-medium">
                            이미 수많은 팀이 불필요한 지출을<br />방어하고 있는 표준 플랜
                        </p>
                    </CardHeader>
                    <CardContent className="p-8 flex-1">
                        <ul className="space-y-4">
                            <li className="flex items-start gap-2 text-sm text-slate-200">
                                <Check className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                <span className="font-medium">최대 {PLAN_LIMITS.core.maxContracts}개 계약 관리</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-slate-200">
                                <Check className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                <span>멀티 알림 타이밍 (D-3, D-7, D-30)</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-slate-200">
                                <Check className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                <span className="font-bold">해지 실행 카드 & 가이드 제공</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-slate-200">
                                <Check className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                <span className="font-bold">절감 비용 카운터 (ROI 추적)</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-slate-200">
                                <Check className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                <span>실시간 환율 기반 비용 요약</span>
                            </li>
                        </ul>
                    </CardContent>
                    <CardFooter className="p-8 pt-0">
                        <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black shadow-lg shadow-blue-900/40">
                            Core로 업그레이드
                        </Button>
                    </CardFooter>
                </Card>

                {/* Growth Plan */}
                <Card className="flex flex-col border-slate-800 bg-black hover:border-slate-700 transition-all">
                    <CardHeader className="p-8 pb-0">
                        <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Expansion</CardTitle>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-black text-white">₩99,000</span>
                            <span className="text-sm text-slate-500">/ 월</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                            스타트업 전사 지출 통제를 위한<br />엔터프라이즈급 가시성 제공
                        </p>
                    </CardHeader>
                    <CardContent className="p-8 flex-1">
                        <ul className="space-y-4">
                            <li className="flex items-start gap-2 text-sm text-slate-300">
                                <Check className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                                <span className="font-bold">무제한 계약 관리</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-slate-300">
                                <Check className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                                <span>고급 알림 윈도우 커스텀</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-slate-300">
                                <Check className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                                <span>조직 가시성 & 관리자 권한</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-slate-300">
                                <Check className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                                <span>전사 지출 보고서 (준비 중)</span>
                            </li>
                        </ul>
                    </CardContent>
                    <CardFooter className="p-8 pt-0">
                        <Button variant="outline" className="w-full border-slate-800 hover:bg-zinc-900 font-bold">
                            Growth 도입 문의
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            {/* ROI Anchor Section */}
            <div className="p-12 bg-gradient-to-br from-zinc-900 to-black rounded-3xl border border-zinc-800 text-center space-y-6">
                <h3 className="text-xl font-bold text-white">지불 가격보다 보호 가격에 집중하세요</h3>
                <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
                    구글 워크스페이스 10인 라이선스를 실수로 1년 갱신하면 약 200만원이 소모됩니다.<br />
                    RenewAlert는 단 한 번의 결정만으로도 플랜 구독 비용의 수십 배를 회수합니다.
                </p>
                <div className="pt-4 flex flex-col items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 opacity-60">Verified Trust</span>
                </div>
            </div>
        </div>
    );
}
