'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function BillingPage() {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold">결제 관리</h1>
                <p className="text-sm text-text-secondary mt-1">플랜 및 결제 정보를 관리하세요.</p>
            </div>

            {/* Current Plan */}
            <Card>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-semibold">현재 플랜</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge variant="default">Free</Badge>
                            <span className="text-sm text-text-secondary">계약 3개 제한</span>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Plans */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Free */}
                <Card className="relative">
                    <h3 className="text-lg font-semibold mb-1">Free</h3>
                    <p className="text-3xl font-bold font-mono mb-4">₩0<span className="text-sm font-normal text-text-tertiary">/월</span></p>
                    <ul className="space-y-2 text-sm text-text-secondary mb-6">
                        <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-success shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            계약 3개
                        </li>
                        <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-success shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            이메일 알림
                        </li>
                    </ul>
                    <Button variant="secondary" className="w-full" disabled>
                        현재 플랜
                    </Button>
                </Card>

                {/* Pro */}
                <Card className="relative border-primary/50">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge variant="success">추천</Badge>
                    </div>
                    <h3 className="text-lg font-semibold mb-1">Pro</h3>
                    <p className="text-3xl font-bold font-mono mb-4">₩49,000<span className="text-sm font-normal text-text-tertiary">/월</span></p>
                    <ul className="space-y-2 text-sm text-text-secondary mb-6">
                        <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-success shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            무제한 계약
                        </li>
                        <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-success shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            이메일 알림
                        </li>
                        <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-success shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            Slack 연동 (예정)
                        </li>
                    </ul>
                    <Button className="w-full">
                        업그레이드
                    </Button>
                </Card>

                {/* Concierge */}
                <Card>
                    <h3 className="text-lg font-semibold mb-1">Concierge</h3>
                    <p className="text-3xl font-bold font-mono mb-4">₩99,000<span className="text-sm font-normal text-text-tertiary">/월</span></p>
                    <ul className="space-y-2 text-sm text-text-secondary mb-6">
                        <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-success shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            Pro 모든 기능
                        </li>
                        <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-success shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            초기 입력 대행
                        </li>
                        <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-success shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            전담 지원
                        </li>
                    </ul>
                    <Button variant="secondary" className="w-full">
                        문의하기
                    </Button>
                </Card>
            </div>
        </div>
    );
}
