'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SampleDashboardPage() {
  const locale = useLocale();
  const isEnglish = locale === 'en';

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Sample Experience</p>
          <h1 className="text-4xl font-black tracking-tight">
            {isEnglish ? 'Sample dashboard walkthrough' : '샘플 대시보드 둘러보기'}
          </h1>
          <p className="text-muted-foreground">
            {isEnglish
              ? 'Preview core workflows before sign-up: at-risk renewals, decision cards, and ROI tracking.'
              : '회원가입 전에 핵심 워크플로우를 미리 확인하세요: 갱신 위험, 의사결정 카드, ROI 추적.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>{isEnglish ? 'At-risk renewals' : '갱신 위험 계약'}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {isEnglish ? 'See contracts that need action before auto-renewal.' : '자동 갱신 전에 액션이 필요한 계약을 확인합니다.'}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{isEnglish ? 'Decision execution' : '결정 실행 카드'}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {isEnglish ? 'Choose cancel/keep and preserve decision history across operators.' : '해지/유지 결정을 기록하고 담당자 변경 이후에도 이력을 보존합니다.'}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{isEnglish ? 'ROI tracking' : 'ROI 추적'}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {isEnglish ? 'Track prevented spend and justify subscription ROI.' : '방지한 지출을 추적해 도입 ROI를 명확히 증명합니다.'}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-wrap gap-3 pt-4">
          <Link href="/login?auto_demo=true" className="px-5 py-3 rounded-xl bg-primary text-primary-foreground font-bold">
            {isEnglish ? 'Open interactive demo' : '인터랙티브 데모 시작'}
          </Link>
          <Link href="/" className="px-5 py-3 rounded-xl border border-border font-semibold text-muted-foreground hover:text-foreground">
            {isEnglish ? 'Back to landing' : '랜딩으로 돌아가기'}
          </Link>
        </div>
      </div>
    </div>
  );
}
