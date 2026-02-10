import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-foreground overflow-x-hidden selection:bg-primary/30 selection:text-white">
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-zinc-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-lg group-hover:scale-105 transition-all duration-200">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-white">갱신알림</span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden sm:block"
            >
              로그인
            </Link>
            <Link
              href="/login?auto_demo=true"
              className="text-sm font-semibold bg-white text-black px-6 py-2.5 rounded-full hover:bg-zinc-200 transition-all duration-200 shadow-xl shadow-white/5 active:scale-95"
            >
              무료로 시작하기
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6 z-10 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 text-zinc-300 text-xs font-medium px-4 py-1.5 rounded-full mb-10 backdrop-blur-md animate-fade-in-up">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span>SaaS부터 부동산 임대 계약까지, 모든 갱신을 한 곳에서</span>
          </div>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-10 text-white animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            나도 모르게 새나가는<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-zinc-500">결제 지옥에서 벗어나세요</span>
          </h1>
          <p className="text-lg sm:text-2xl text-zinc-400 max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in-up px-4" style={{ animationDelay: '0.2s' }}>
            바쁜 업무 중에 놓치기 쉬운 자동갱신 일정을 스마트하게 챙겨드립니다.<br className="hidden md:block" />
            만기 90일 전부터 최적의 협상 타이밍을 알려드려요.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link
              href="/login?auto_demo=true"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-black font-bold px-10 py-5 rounded-2xl hover:bg-zinc-200 transition-all duration-300 text-xl shadow-2xl shadow-white/10 hover:-translate-y-1 active:scale-95"
            >
              지금 무료로 체험하기
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
          <div className="mt-12 flex items-center justify-center gap-8 text-zinc-500 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl font-bold text-zinc-300">30s</span>
              <span className="text-[10px] uppercase tracking-widest font-semibold">Quick Setup</span>
            </div>
            <div className="w-px h-8 bg-zinc-800" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl font-bold text-zinc-300">0원</span>
              <span className="text-[10px] uppercase tracking-widest font-semibold">Free Forever</span>
            </div>
            <div className="w-px h-8 bg-zinc-800" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl font-bold text-zinc-300">Safe</span>
              <span className="text-[10px] uppercase tracking-widest font-semibold">No Card Req</span>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Layered Image Effect (Smooth.ai style) */}
      <section className="relative py-24 z-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="relative p-1 bg-gradient-to-b from-zinc-700/50 to-transparent rounded-[2rem] shadow-3xl overflow-hidden backdrop-blur-sm group">
            <div className="bg-black/90 rounded-[1.9rem] overflow-hidden aspect-[16/9] flex items-center justify-center text-zinc-700 border border-zinc-800/50">
              {/* Placeholder for Dashboard Mockup or Screenshot */}
              <div className="text-center p-20">
                <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-800">
                  <span className="text-3xl">📊</span>
                </div>
                <h3 className="text-2xl font-bold text-zinc-300 mb-2">대시보드 미리보기</h3>
                <p className="text-zinc-500">한눈에 파악하는 우리 팀의 모든 계약 현황</p>
              </div>
            </div>
            {/* Decorative Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

      {/* The Pain: Why RenewAlert? */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">결제일만 되면 가슴이 철렁하시나요?</h2>
            <p className="text-zinc-500 text-lg max-w-2xl mx-auto">더 이상 관리되지 않는 계약으로 불필요한 비용을 지불하지 마세요.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-zinc-900/40 border border-zinc-800/50 p-10 rounded-[2.5rem] hover:bg-zinc-800/40 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center mb-8 text-3xl group-hover:scale-110 transition-transform">💸</div>
              <h3 className="text-2xl font-bold text-white mb-4">구독료 지옥</h3>
              <p className="text-zinc-400 leading-relaxed mb-6">
                Notion, AWS, Figma... 안 쓰는데 결제된 작년 구독료만 수백만 원입니다.
              </p>
              <div className="text-blue-500 font-mono text-sm font-bold flex items-center gap-2">
                <span>평균 ₩2,400,000 절감 가능</span>
              </div>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800/50 p-10 rounded-[2.5rem] hover:bg-zinc-800/40 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center mb-8 text-3xl group-hover:scale-110 transition-transform">🏢</div>
              <h3 className="text-2xl font-bold text-white mb-4">임대 계약 놓침</h3>
              <p className="text-zinc-400 leading-relaxed mb-6">
                협상 기간을 놓쳐 불리한 조건으로 자동 연장되거나 갑작스러운 퇴거 통보를 받습니다.
              </p>
              <div className="text-zinc-500 font-mono text-sm">최소 3개월 전 알림 필수</div>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800/50 p-10 rounded-[2.5rem] hover:bg-zinc-800/40 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center mb-8 text-3xl group-hover:scale-110 transition-transform">📂</div>
              <h3 className="text-2xl font-bold text-white mb-4">흩어진 히스토리</h3>
              <p className="text-zinc-400 leading-relaxed mb-6">
                담당자가 바뀌거나 메일이 쌓여서 실제 계약 조건이 무엇인지 알 수 없습니다.
              </p>
              <div className="text-zinc-500 font-mono text-sm">클라우드 통합 관리 시스템</div>
            </div>
          </div>
        </div>
      </section>

      {/* Step by Step Flow */}
      <section className="py-32 px-6 border-y border-white/5 bg-zinc-900/20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl sm:text-6xl font-bold text-white mb-10 leading-tight">
                압도적으로 편한<br />관리 프로세스
              </h2>
              <div className="space-y-10">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white text-black flex items-center justify-center font-bold text-xl">1</div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">30초 만에 계약 등록</h4>
                    <p className="text-zinc-400">AI 프리셋 기능을 통해 서비스명만 선택하면 기본 정보가 자동 완성됩니다.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center font-bold text-xl">2</div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">다단계 알림 설정</h4>
                    <p className="text-zinc-400">만기 90일 전부터 최적의 해지/협상 타이밍을 이메일과 푸시로 알려드려요.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center font-bold text-xl">3</div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">지출 리포트 자동 생성</h4>
                    <p className="text-zinc-400">월별, 연별 예상 지출액을 자동으로 합산하여 예산 관리를 도와드립니다.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative aspect-square bg-zinc-900 rounded-[3rem] border border-zinc-800 overflow-hidden shadow-3xl">
              <div className="absolute inset-0 flex items-center justify-center text-zinc-800 text-9xl select-none">🔔</div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 z-10">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-[3rem] p-12 sm:p-24 text-center shadow-3xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full group-hover:bg-blue-500/15 transition-colors" />
          <div className="relative z-10">
            <h2 className="text-4xl sm:text-6xl font-bold text-white mb-8 leading-tight">지금 바로 시작하고<br />구독 비용을 절약하세요</h2>
            <p className="text-zinc-400 text-lg sm:text-xl mb-12 max-w-xl mx-auto leading-relaxed">
              회원가입 없이 30초면 데모로 모든 기능을 확인할 수 있습니다.
            </p>
            <Link
              href="/login?auto_demo=true"
              className="inline-flex items-center justify-center gap-2 bg-white text-black font-bold px-12 py-5 rounded-2xl hover:bg-zinc-200 transition-all duration-300 text-2xl shadow-xl shadow-white/5"
            >
              무료로 시작하기
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <p className="mt-8 text-zinc-500 text-sm font-medium tracking-tight">
              ✨ 평생 무료 플랜 · 카드 자동결제 없음 · 강력한 보안
            </p>
          </div>
        </div>
      </section>

      {/* Brief Footer */}
      <footer className="py-20 px-6 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <span className="text-zinc-300 font-bold tracking-tight">갱신알림</span>
          </div>
          <div className="flex gap-10 text-sm font-medium text-zinc-500">
            <Link href="#" className="hover:text-zinc-300">Terms</Link>
            <Link href="#" className="hover:text-zinc-300">Privacy</Link>
            <Link href="#" className="hover:text-zinc-300">Support</Link>
          </div>
          <div className="text-zinc-600 text-sm font-medium tracking-tight">
            © 2025 RenewAlert Inc.
          </div>
        </div>
      </footer>
    </div>
  );
}
