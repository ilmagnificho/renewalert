import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-foreground overflow-x-hidden selection:bg-white selection:text-black">
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-zinc-800/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-zinc-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-lg group-hover:scale-105 transition-all duration-200">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-white">RenewAlert</span>
          </Link>
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
          <div className="inline-flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 text-zinc-300 text-[10px] uppercase tracking-widest font-bold px-4 py-1.5 rounded-full mb-10 backdrop-blur-md animate-fade-in-up">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-pulse" />
            <span>Financial Decision Timing Infrastructure</span>
          </div>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] mb-10 text-white animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            놓치면 자동으로<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-zinc-600">돈이 빠져나갑니다</span>
          </h1>
          <p className="text-xl sm:text-2xl text-zinc-400 max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in-up px-4" style={{ animationDelay: '0.2s' }}>
            RenewAlert은 그 ‘결정의 순간’을 알려드립니다.<br className="hidden md:block" />
            자동 갱신 전에 취소할지, 플랜을 낮출지, 협상할지 결정하세요.<br className="hidden md:block" />
            이미 늦은 뒤가 아니라 — 가장 유리한 타이밍에.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link
              href="/login?auto_demo=true"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-black font-bold px-10 py-5 rounded-2xl hover:bg-zinc-200 transition-all duration-300 text-2xl shadow-2xl shadow-white/10 hover:-translate-y-1 active:scale-95"
            >
              무료로 시작하기
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
          <p className="mt-8 text-zinc-500 text-sm font-medium tracking-tight animate-fade-in" style={{ animationDelay: '0.5s' }}>
            카드 등록 없음 · 3분 설정 · 바로 알림 시작
          </p>
        </div>
      </section>

      {/* At-Risk Money Widget (High Impact) */}
      <section className="relative py-24 z-10 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative group overflow-hidden rounded-[3rem] border border-white/10 bg-gradient-to-b from-zinc-900 to-black p-1">
            <div className="p-12 sm:p-20 text-center">
              <p className="text-zinc-500 uppercase tracking-[0.2em] text-[10px] font-bold mb-6">Risk Monitoring Active</p>
              <h3 className="text-zinc-300 text-xl font-medium mb-10">다음 90일 내 자동결제 예정 금액</h3>
              <div className="text-6xl sm:text-8xl font-black text-white mb-8 tracking-tighter tabular-nums">
                ₩8,420,000
              </div>
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-zinc-900 border border-zinc-800 shadow-xl overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer pointer-events-none" />
                <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                <span className="text-zinc-300 text-sm font-bold">RenewAlert은 이 금액이 결제되기 전에 알려드립니다</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem: Authority Focus */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-left mb-24 max-w-3xl">
            <h2 className="text-4xl sm:text-6xl font-black text-white mb-8 leading-[1.1] tracking-tight">당신이 모르는 사이,<br />돈은 반복 결제됩니다</h2>
            <p className="text-zinc-500 text-xl leading-relaxed">Financial Decision Timing Infrastructure는 불필요한 고정 지출을 차단하고 회사의 현금 흐름을 보호합니다.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-zinc-950 border border-zinc-900 p-12 rounded-[2.5rem] hover:border-zinc-800 transition-all duration-300 group shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6">자동결제 방치</h3>
              <p className="text-zinc-400 leading-relaxed text-lg mb-8">
                사용하지 않는 SaaS, 잊고 있던 구독 — 아무도 확인하지 않으면 비용은 무한히 발생합니다.
              </p>
              <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/50">
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Financial Impact</p>
                <p className="text-white text-lg font-bold">평균 구독 비용의 30%가 낭비됩니다</p>
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-900 p-12 rounded-[2.5rem] hover:border-zinc-800 transition-all duration-300 group shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6">해지 타이밍 결핍</h3>
              <p className="text-zinc-400 leading-relaxed text-lg">
                대부분의 계약은 이미 갱신된 후에야 떠올립니다. RenewAlert은 단순히 결제 알림이 아닌, **'결정할 수 있는 순간'**을 확보해 드립니다.
              </p>
            </div>

            <div className="bg-zinc-950 border border-zinc-900 p-12 rounded-[2.5rem] hover:border-zinc-800 transition-all duration-300 group shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6">흩어진 계약 정보</h3>
              <p className="text-zinc-400 leading-relaxed text-lg">
                담당자가 바뀌거나 메일이 묻히는 순간 중요한 계약 조건도 사라집니다. 우리는 모든 재무 일정의 **단일 기준점(Single Source of Truth)**이 됩니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Value Shift: Small CFO Focus */}
      <section className="py-40 px-6 border-y border-white/5 bg-zinc-950/50 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-28">
            <h2 className="text-4xl sm:text-6xl font-black text-white mb-8 leading-tight">관리 도구가 아닙니다.<br />재무 의사결정을 위한 신호 시스템입니다.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-3xl mx-auto mb-10">⏳</div>
              <h4 className="text-xl font-bold text-white mb-4">Decision Window Alerts</h4>
              <p className="text-zinc-500 leading-relaxed">단순 알림이 아닌, 갱신 전에 행동하고 협상할 수 있는 충분한 시간을 확보해 드립니다.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-3xl mx-auto mb-10">🩺</div>
              <h4 className="text-xl font-bold text-white mb-4">Financial Risk Visibility</h4>
              <p className="text-zinc-500 leading-relaxed">매몰 비용이 되기 쉬운 예정된 지출을 사전에 투명하게 가시화합니다.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-3xl mx-auto mb-10">🧠</div>
              <h4 className="text-xl font-bold text-white mb-4">Contract Memory</h4>
              <p className="text-zinc-500 leading-relaxed">회사의 모든 재무 계약 주기를 인수인계 걱정 없이 완벽하게 기억하고 보존합니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-20 text-center uppercase tracking-tight">3분 설정으로 재무 리스크 차단</h2>
          <div className="space-y-4">
            {[
              { step: '01', title: '계약 등록', desc: 'SaaS, 임대, 보험 등 모든 반복 결제의 기본 정보를 입력합니다.' },
              { step: '02', title: 'Decision Window 생성', desc: '해지 또는 조건 변경이 가능한 최적의 시점을 시스템이 자동 계산합니다.' },
              { step: '03', title: '행동 신호 수신', desc: '이미 늦은 뒤가 아니라, 실제 행동이 가능한 순간에 전략적 알림을 받습니다.' },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row gap-8 p-10 rounded-[2rem] border border-zinc-900 bg-zinc-950 items-center">
                <span className="text-5xl font-black text-zinc-800 shrink-0">{item.step}</span>
                <div className="text-center sm:text-left">
                  <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                  <p className="text-zinc-400 text-lg">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-32 px-6 z-10 bg-zinc-950/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-white mb-4">Plan</h2>
            <p className="text-zinc-500 text-xl italic font-mono tracking-tight underline underline-offset-8">
              "RenewAlert은 단 하나의 자동결제만 막아도 로이(ROI)를 즉시 회수합니다."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="p-10 rounded-[2.5rem] border border-zinc-900 bg-zinc-950 flex flex-col items-center text-center">
              <span className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-4">Standard</span>
              <h3 className="text-2xl font-bold text-white mb-2">FREE</h3>
              <div className="text-zinc-400 mb-8 font-medium">개인 관리용</div>
              <ul className="space-y-4 text-zinc-500 font-medium mb-12 flex-1">
                <li>계약 3개 등록 가능</li>
                <li>기본 결정 시점 알림</li>
                <li>멀티 커런시 환율 계산</li>
              </ul>
              <Link href="/login" className="w-full py-4 rounded-xl border border-zinc-800 text-white font-bold hover:bg-zinc-900 transition-colors">시작하기</Link>
            </div>

            {/* PRO Plan */}
            <div className="p-10 rounded-[2.5rem] border border-zinc-300/10 bg-gradient-to-br from-zinc-900 to-black flex flex-col items-center text-center relative overflow-hidden shadow-3xl">
              <div className="absolute top-0 right-0 px-4 py-1 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-bl-xl">Recommended</div>
              <span className="text-zinc-400 font-bold uppercase tracking-widest text-xs mb-4">Executive</span>
              <h3 className="text-2xl font-bold text-white mb-2">PRO</h3>
              <div className="text-zinc-300 mb-8 font-medium">₩19,000 <span className="text-zinc-500 text-sm">/ month</span></div>
              <ul className="space-y-4 text-zinc-300 font-medium mb-12 flex-1">
                <li>무제한 계약 등록</li>
                <li>팀/부서별 공유 관리</li>
                <li>Decision Window 정밀 계산</li>
                <li>재무 리스크 리포트</li>
              </ul>
              <Link href="/login" className="w-full py-4 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-colors shadow-2xl">모든 기능 사용하기</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-48 px-6 z-10 overflow-hidden relative">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl sm:text-7xl font-black text-white mb-10 leading-tight tracking-tighter">재무 통제를 시작하세요</h2>
          <p className="text-zinc-500 text-xl sm:text-2xl mb-12 max-w-xl mx-auto leading-relaxed font-medium">
            Financial Decision Engine이 회사의 보이지 않는 손실을 즉시 차단해 드립니다.
          </p>
          <Link
            href="/login?auto_demo=true"
            className="inline-flex items-center justify-center gap-2 bg-white text-black font-black px-12 py-6 rounded-2xl hover:bg-zinc-200 transition-all duration-300 text-3xl shadow-3xl shadow-white/5 active:scale-95"
          >
            무료로 시작하기
          </Link>
          <div className="mt-12 text-zinc-600 font-mono text-sm tracking-widest uppercase">
            Future-Proof Financial Infrastructure
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
            <span className="text-zinc-300 font-bold tracking-tight">RenewAlert</span>
          </div>
          <div className="text-zinc-600 text-[10px] uppercase font-bold tracking-[0.3em]">
            © 2025 Financial Decision Timing Infrastructure Inc.
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite linear;
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
