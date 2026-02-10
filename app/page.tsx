import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 overflow-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">갱신알림</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              로그인
            </Link>
            <Link
              href="/signup"
              className="text-sm font-semibold bg-white text-slate-950 px-5 py-2.5 rounded-full hover:bg-blue-50 transition-all duration-200 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]"
            >
              무료로 시작하기
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 px-6 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-slate-800/50 border border-white/10 text-blue-400 text-sm px-4 py-1.5 rounded-full mb-8 backdrop-blur-sm animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            연간 결제 자동갱신, 더 이상 놓치지 마세요
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-8 text-balance bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            구독료 낭비,<br />
            이제 그만할 때입니다.
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed text-balance">
            Figma, AWS, 사무실 임대... 나도 모르게 빠져나가는 돈이 수백만원.<br />
            갱신알림이 만기 90일 전부터 꼼꼼하게 챙겨드립니다.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold px-8 py-4 rounded-xl hover:bg-blue-500 transition-all duration-200 text-lg shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] hover:shadow-[0_0_60px_-15px_rgba(59,130,246,0.6)] hover:-translate-y-1"
            >
              무료로 체험하기
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800 text-white font-medium px-8 py-4 rounded-xl hover:bg-slate-700 transition-all duration-200 text-lg border border-white/5"
            >
              로그인
            </Link>
          </div>
          <p className="text-sm text-slate-500 mt-6">
            ✨ 카드 등록 없음 · 30초면 시작 · 평생 무료 플랜 제공
          </p>
        </div>
      </section>

      {/* Pain Points Cards */}
      <section className="py-24 px-6 border-t border-white/5 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group bg-slate-900/50 backdrop-blur-sm border border-white/5 p-8 rounded-2xl hover:border-red-500/30 transition-all duration-300 hover:bg-slate-800/50">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform duration-300">
                💸
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-100">SaaS 자동갱신 감옥</h3>
              <p className="text-slate-400 mb-4 leading-relaxed">
                "안 쓰는데 결제됐네..."<br />
                Figma, Notion, Zoom 등 사용하지 않는 툴이 자동으로 갱신되어 나가는 돈.
              </p>
              <p className="text-red-400 font-mono text-sm">평균 손실: ₩2,000,000/년</p>
            </div>

            <div className="group bg-slate-900/50 backdrop-blur-sm border border-white/5 p-8 rounded-2xl hover:border-orange-500/30 transition-all duration-300 hover:bg-slate-800/50">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform duration-300">
                📅
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-100">임대 계약 갱신 놓침</h3>
              <p className="text-slate-400 mb-4 leading-relaxed">
                갱신 협상 타이밍을 놓쳐서 울며 겨자 먹기로 불리한 조건 연장하거나 퇴거 위기.
              </p>
              <p className="text-orange-400 font-mono text-sm">리스크: 보증금 인상 등</p>
            </div>

            <div className="group bg-slate-900/50 backdrop-blur-sm border border-white/5 p-8 rounded-2xl hover:border-blue-500/30 transition-all duration-300 hover:bg-slate-800/50">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform duration-300">
                🔔
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-100">흩어진 계약서들</h3>
              <p className="text-slate-400 mb-4 leading-relaxed">
                메일함, 드라이브, 서랍 속에 흩어 계약서.<br />
                필요할 때 찾으려면 보이지 않죠?
              </p>
              <p className="text-blue-400 font-mono text-sm">이제 한 곳에서 관리하세요</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="py-24 px-6 border-t border-white/5 relative z-10 bg-slate-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">캘린더보다 강력합니다</h2>
            <p className="text-slate-400">단순한 일정 알림이 아닙니다. 계약 관리에 최적화된 경험을 제공합니다.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '⚡️', title: '30초 등록', desc: '복잡한 정보 필요 없습니다. 서비스명과 만기일만 입력하세요.' },
              { icon: '📩', title: '다중 알림', desc: '90일, 30일, 7일, 1일 전. 놓칠 수 없도록 반복해서 알려드립니다.' },
              { icon: '👀', title: '한눈에 파악', desc: '대시보드에서 긴급, 주의, 정상 상태를 직관적으로 확인하세요.' },
              { icon: '💾', title: '히스토리', desc: '과거 계약 이력까지 관리하여 갱신 시점의 가격 변동을 파악하세요.' },
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <span className="text-4xl mb-4">{feature.icon}</span>
                <h3 className="text-lg font-bold mb-2 text-white">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats/Social Proof (Placeholder) */}
      <section className="py-20 px-6 border-t border-white/5 text-center">
        <p className="text-2xl font-bold text-slate-300 mb-8">
          <span className="text-blue-400">스타트업 대표님</span>들이 가장 많이 찾는 기능
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500 font-mono">
          <span className="px-4 py-2 rounded-full border border-white/10 bg-slate-900">#법인카드_관리</span>
          <span className="px-4 py-2 rounded-full border border-white/10 bg-slate-900">#구독료_방어</span>
          <span className="px-4 py-2 rounded-full border border-white/10 bg-slate-900">#총무_필수템</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 bg-slate-950">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <span className="text-slate-400 font-semibold">갱신알림</span>
          </div>
          <div className="text-slate-600 text-sm">
            © 2025 RenewAlert. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
