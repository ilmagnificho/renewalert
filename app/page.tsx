import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '갱신알림 - 계약 만기 알림 서비스',
  description: '연간 결제 자동갱신, 임대 계약 갱신 놓치면 수백만원 손해. 갱신알림이 미리 알려드립니다. SaaS 구독, 임대 계약, 보험 등 모든 계약을 한 곳에서 관리하세요.',
  keywords: 'SaaS 구독 관리, 계약 만기 알림, 구독료 관리, 갱신 알림',
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-xl border-b border-dark-border">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <span className="text-lg font-bold">갱신알림</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors px-3 py-2"
            >
              로그인
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors"
            >
              무료로 시작하기
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-danger-bg border border-danger/20 text-danger text-sm px-4 py-1.5 rounded-full mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            연간 결제 자동갱신, 놓치면 수백만원 손해
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            SaaS 구독 · 계약 만기<br />
            <span className="text-primary">놓치지 마세요</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-8">
            Figma, AWS, 사무실 임대... 자동갱신 날짜를 놓치면 수백만원 손해.
            <br />
            갱신알림이 만기 90일 전부터 자동으로 알려드립니다.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-primary text-white font-medium px-8 py-3.5 rounded-xl hover:bg-primary-hover transition-all duration-200 text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02]"
            >
              무료로 시작하기
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
          <p className="text-xs text-text-tertiary mt-4">카드 없이 시작 · 계약 3개까지 영구 무료</p>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-20 px-4 border-t border-dark-border">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">이런 경험, 한 번쯤 있으시죠?</h2>
          <p className="text-text-secondary text-center mb-12">대한민국 스타트업 대표 10명 중 8명이 겪은 문제입니다.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-danger/30 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-danger-bg flex items-center justify-center mb-4">
                <span className="text-2xl">💸</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">SaaS 연간결제 자동갱신</h3>
              <p className="text-sm text-text-secondary mb-3">Figma Pro ₩800만, Notion ₩500만... 사용하지 않는 SaaS가 자동으로 갱신되어 청구됨</p>
              <p className="text-sm font-mono font-medium text-danger">평균 손실: ₩100만~2,000만</p>
            </div>
            <div className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-warning/30 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-warning-bg flex items-center justify-center mb-4">
                <span className="text-2xl">🏢</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">임대 계약 갱신 기한</h3>
              <p className="text-sm text-text-secondary mb-3">갱신 협상 기간을 놓쳐 불리한 조건을 수용하거나, 최악의 경우 퇴거 위기에 처함</p>
              <p className="text-sm font-mono font-medium text-warning">평균 손실: ₩수백만~수천만</p>
            </div>
            <div className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">보험·서버 해지 통보</h3>
              <p className="text-sm text-text-secondary mb-3">해지 통보 기한을 놓쳐 원치 않는 갱신이 진행됨</p>
              <p className="text-sm font-mono font-medium text-primary">평균 손실: ₩수십만~수백만</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 border-t border-dark-border">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">갱신알림이 해결합니다</h2>
          <p className="text-text-secondary text-center mb-12">캘린더는 알림만 줍니다. 우리는 돈을 지켜줍니다.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '📝', title: '간편 등록', desc: '클릭 3번이면 계약 등록 완료. 서비스명, 금액, 만기일만 입력하면 끝.' },
              { icon: '🔔', title: '자동 알림', desc: '만기 90일, 30일, 7일, 1일 전 자동으로 이메일 알림을 보내드립니다.' },
              { icon: '📊', title: '한눈 대시보드', desc: '긴급/주의/정상 상태 구분. 만기 임박 계약을 한눈에 확인하세요.' },
              { icon: '💰', title: '비용 절감', desc: '놓치기 쉬운 자동갱신을 미리 파악. 월 ₩49,000으로 수백만원을 절약.' },
            ].map((feature) => (
              <div key={feature.title} className="text-center p-6">
                <div className="w-14 h-14 rounded-xl bg-dark-card border border-dark-border flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-text-secondary">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20 px-4 border-t border-dark-border">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">왜 갱신알림인가요?</h2>
          <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left p-4 text-text-tertiary font-medium">기능</th>
                  <th className="text-center p-4 text-text-tertiary font-medium">캘린더</th>
                  <th className="text-center p-4 text-text-tertiary font-medium">노션</th>
                  <th className="text-center p-4 text-primary font-semibold">갱신알림</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['금액 관리', false, false, true],
                  ['자동 알림 (90/30/7/1일)', false, false, true],
                  ['만기 상태 한눈에', false, false, true],
                  ['갱신/해지 처리', false, false, true],
                  ['계약 전용 설계', false, false, true],
                ].map(([feature, cal, notion, us]) => (
                  <tr key={feature as string} className="border-b border-dark-border last:border-0">
                    <td className="p-4 text-text-primary">{feature as string}</td>
                    <td className="text-center p-4">{cal ? '✓' : <span className="text-text-tertiary">✗</span>}</td>
                    <td className="text-center p-4">{notion ? '✓' : <span className="text-text-tertiary">✗</span>}</td>
                    <td className="text-center p-4 text-primary font-medium">{us ? '✓' : '✗'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 border-t border-dark-border" id="pricing">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">심플한 요금제</h2>
          <p className="text-text-secondary text-center mb-12">만기 놓치면 수백만원. 월 ₩49,000으로 막으세요.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Free */}
            <div className="bg-dark-card border border-dark-border rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-1">Free</h3>
              <p className="text-3xl font-bold font-mono mb-1">₩0</p>
              <p className="text-xs text-text-tertiary mb-6">영구 무료</p>
              <ul className="space-y-3 text-sm text-text-secondary mb-6">
                <li className="flex items-center gap-2">✓ 계약 3개</li>
                <li className="flex items-center gap-2">✓ 이메일 알림</li>
                <li className="flex items-center gap-2">✓ 대시보드</li>
              </ul>
              <Link
                href="/signup"
                className="block text-center bg-dark-hover text-text-primary py-2.5 rounded-lg font-medium hover:bg-dark-border transition-colors"
              >
                무료로 시작하기
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-dark-card border-2 border-primary rounded-xl p-6 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
                추천
              </div>
              <h3 className="text-lg font-semibold mb-1">Pro</h3>
              <p className="text-3xl font-bold font-mono mb-1">₩49,000</p>
              <p className="text-xs text-text-tertiary mb-6">월간 결제</p>
              <ul className="space-y-3 text-sm text-text-secondary mb-6">
                <li className="flex items-center gap-2">✓ <strong className="text-text-primary">무제한</strong> 계약</li>
                <li className="flex items-center gap-2">✓ 이메일 알림</li>
                <li className="flex items-center gap-2">✓ Slack 연동 <span className="text-xs text-text-tertiary">(예정)</span></li>
                <li className="flex items-center gap-2">✓ 우선 지원</li>
              </ul>
              <Link
                href="/signup"
                className="block text-center bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary-hover transition-colors"
              >
                시작하기
              </Link>
            </div>

            {/* Concierge */}
            <div className="bg-dark-card border border-dark-border rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-1">Concierge</h3>
              <p className="text-3xl font-bold font-mono mb-1">₩99,000</p>
              <p className="text-xs text-text-tertiary mb-6">월간 결제</p>
              <ul className="space-y-3 text-sm text-text-secondary mb-6">
                <li className="flex items-center gap-2">✓ Pro 모든 기능</li>
                <li className="flex items-center gap-2">✓ 초기 입력 대행</li>
                <li className="flex items-center gap-2">✓ 전담 지원</li>
                <li className="flex items-center gap-2">✓ 맞춤 온보딩</li>
              </ul>
              <Link
                href="/signup"
                className="block text-center bg-dark-hover text-text-primary py-2.5 rounded-lg font-medium hover:bg-dark-border transition-colors"
              >
                문의하기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 border-t border-dark-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">다시는 놓치지 마세요</h2>
          <p className="text-text-secondary mb-8">지금 시작하면 첫 3개 계약은 영구 무료입니다.</p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-primary text-white font-medium px-8 py-3.5 rounded-xl hover:bg-primary-hover transition-all duration-200 text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02]"
          >
            무료로 시작하기
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-dark-border">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <span className="text-sm font-medium">갱신알림</span>
          </div>
          <p className="text-xs text-text-tertiary">© 2025 Tetra Corp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
