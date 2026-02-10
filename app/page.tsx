'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function LandingPage() {
  const [employees, setEmployees] = useState(50);
  const [tools, setTools] = useState(15);
  const [spend, setSpend] = useState(50000); // per tool per month

  const estimatedWaste = employees * tools * (spend * 0.2) * 12;

  return (
    <div className="min-h-screen bg-[#000000] text-foreground overflow-x-hidden selection:bg-white selection:text-black">
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-zinc-800/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-zinc-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Financial Exposure Line */}
      <div className="relative z-[60] bg-zinc-900/80 backdrop-blur-md border-b border-white/5 py-2 px-6 text-center">
        <p className="text-[10px] sm:text-xs font-medium tracking-tight text-zinc-400">
          Companies lose up to 20–30% of recurring spend to unoptimized or forgotten contracts.
        </p>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/5">
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
              시작하기
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 z-10 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 text-zinc-400 text-[10px] uppercase tracking-[0.2em] font-bold px-4 py-1.5 rounded-full mb-10 backdrop-blur-md">
            <span>Financial Control Infrastructure</span>
          </div>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] mb-10 text-white animate-fade-in-up">
            나도 모르는 고정 비용이<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-600">현금을 조용히 소모합니다</span>
          </h1>
          <p className="text-lg sm:text-2xl text-zinc-500 max-w-3xl mx-auto mb-12 leading-relaxed px-4">
            RenewAlert은 그 결정의 순간을 확보해 드립니다. <br className="hidden md:block" />
            무의미한 반복 지출이 부채가 되기 전에 통제권을 가지세요.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/login?auto_demo=true"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-black font-bold px-10 py-5 rounded-2xl hover:bg-zinc-200 transition-all duration-300 text-xl shadow-2xl shadow-white/10"
            >
              무료로 시작하기
            </Link>
          </div>
          <p className="mt-8 text-zinc-600 text-xs font-medium tracking-tight">
            카드 등록 없음 · 3분 설정 · 즉각적인 가시성 확보
          </p>
        </div>
      </section>

      {/* At-Risk Money Label */}
      <section className="py-12 z-10 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center p-8 border border-white/5 bg-zinc-950 rounded-[2rem] text-center">
            <span className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Recurring Exposure Sample</span>
            <div className="text-5xl sm:text-6xl font-black text-white tabular-nums tracking-tighter mb-4">
              ₩18,400,000
            </div>
            <p className="text-zinc-500 text-sm font-medium">당신이 추적하지 않는 금액은 곧 확정된 손실이 됩니다.</p>
          </div>
        </div>
      </section>

      {/* Waste Calculator Section */}
      <section className="py-24 px-6 z-10">
        <div className="max-w-4xl mx-auto p-12 bg-zinc-950 border border-white/5 rounded-[3rem] shadow-3xl">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 tracking-tight">잠복 지출 진단</h2>
            <p className="text-zinc-500">조직 규모와 지출 형태에 따른 손실 규모를 확인하세요.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">조직 규모 (인원)</label>
              <input
                type="range" min="1" max="500" value={employees}
                onChange={(e) => setEmployees(parseInt(e.target.value))}
                className="w-full accent-white h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-2xl font-bold text-white">{employees}명</div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">활용 도구 개수</label>
              <input
                type="range" min="1" max="100" value={tools}
                onChange={(e) => setTools(parseInt(e.target.value))}
                className="w-full accent-white h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-2xl font-bold text-white">{tools}개</div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">평균 월 지출 (단위당)</label>
              <input
                type="range" min="10000" max="500000" step="10000" value={spend}
                onChange={(e) => setSpend(parseInt(e.target.value))}
                className="w-full accent-white h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-2xl font-bold text-white">₩{spend.toLocaleString()}</div>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 text-center">
            <p className="text-zinc-500 text-sm font-medium mb-4 uppercase tracking-[0.2em]">Estimated annual waste</p>
            <div className="text-4xl sm:text-6xl font-black text-white mb-10 tracking-tighter tabular-nums">
              ₩{estimatedWaste.toLocaleString()}
            </div>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 text-white font-bold px-12 py-5 rounded-2xl hover:bg-zinc-800 transition-all duration-300 text-xl"
            >
              지출 리스크 제거하기
            </Link>
          </div>
        </div>
      </section>

      {/* Executive Reframe Block */}
      <section className="py-32 px-6 z-10 border-y border-white/5 bg-zinc-950/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">금융 의사결정을 위한 신호 시스템</h2>
            <p className="text-zinc-500 text-lg">RenewAlert은 관리 도구가 아닌, 회사의 현금을 보호하는 인프라입니다.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="space-y-6">
              <div className="text-2xl font-bold text-zinc-200">Decision Timing</div>
              <p className="text-zinc-500 leading-relaxed text-sm">갱신이나 중단 여부를 결정하기 위한 최적의 협상 시간을 확보합니다.</p>
            </div>
            <div className="space-y-6">
              <div className="text-2xl font-bold text-zinc-200">Financial Visibility</div>
              <p className="text-zinc-500 leading-relaxed text-sm">회계 장부에 기록되기 전, 예정된 모든 반복 지출 리스크를 가시화합니다.</p>
            </div>
            <div className="space-y-6">
              <div className="text-2xl font-bold text-zinc-200">Contract Memory</div>
              <p className="text-zinc-500 leading-relaxed text-sm">인력 교체와 관계없이 조직의 계약 지식과 히스토리를 자산화합니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Summary Audit: The Problem */}
      <section className="py-32 px-6 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="text-center mb-24 max-w-4xl">
            <h2 className="text-4xl sm:text-7xl font-black text-white mb-10 leading-[1.1] tracking-tight">보이지 않는 지출은<br />확정된 손실입니다</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            <div className="p-10 rounded-[2.5rem] border border-zinc-900 bg-zinc-950/50 hover:bg-zinc-900/50 transition-colors">
              <h3 className="text-xl font-bold text-white mb-6">반복 지출 누수</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                사용되지 않는 리소스와 휴면 계정이 침묵 속에서 현금을 소모합니다.
              </p>
            </div>
            <div className="p-10 rounded-[2.5rem] border border-zinc-900 bg-zinc-950/50 hover:bg-zinc-900/50 transition-colors">
              <h3 className="text-xl font-bold text-white mb-6">통제권 상실</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                이미 결제된 후에 인지하는 것은 대응이 아닌 사후 처리에 불과합니다.
              </p>
            </div>
            <div className="p-10 rounded-[2.5rem] border border-zinc-900 bg-zinc-950/50 hover:bg-zinc-900/50 transition-colors">
              <h3 className="text-xl font-bold text-white mb-6">파편화된 리스크</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                제각각인 일정을 통합하지 못하면 재무 계획의 불확실성이 증가합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing ROI Section */}
      <section className="py-32 px-6 z-10">
        <div className="max-w-6xl mx-auto text-center mb-20">
          <h2 className="text-3xl font-black text-white mb-6 tracking-tighter">Plan</h2>
          <p className="text-zinc-500 font-medium">단 한 번의 불필요한 자동 갱신만 차단해도 1년 사용료 이상의 가치를 확보합니다.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-center">
          <div className="p-10 rounded-[2.5rem] border border-zinc-900 bg-zinc-950 flex flex-col items-center text-center">
            <span className="text-zinc-600 font-bold uppercase tracking-widest text-[9px] mb-4">Initial</span>
            <h3 className="text-xl font-bold text-white mb-4 tracking-tighter">FREE</h3>
            <ul className="space-y-4 text-zinc-500 text-xs font-medium mb-12 flex-1">
              <li>계약 3개 리스크 추적</li>
              <li>기본 의사결정 시점 알림</li>
              <li>실시간 환율 변동 가시화</li>
            </ul>
            <Link href="/login" className="w-full py-4 rounded-xl border border-zinc-800 text-zinc-400 font-bold hover:text-white transition-colors text-sm">무료로 시작</Link>
          </div>

          <div className="p-12 rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-zinc-800 to-black flex flex-col items-center text-center relative shadow-3xl">
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-bl-xl">Diagnostic</div>
            <span className="text-zinc-400 font-bold uppercase tracking-widest text-[9px] mb-4">Operational</span>
            <h3 className="text-2xl font-bold text-white mb-4 tracking-tighter">PRO</h3>
            <div className="text-zinc-300 mb-10 font-black text-3xl">₩19,000 <span className="text-zinc-600 text-xs font-medium">/ mo</span></div>
            <ul className="space-y-5 text-zinc-300 text-sm font-medium mb-12 flex-1">
              <li>무제한 리스크 자산 등록</li>
              <li>조직 내 공유 및 가시성 확보</li>
              <li>정밀 재무 의사결정 창 계산</li>
              <li>통합 지출 리포트 생성</li>
            </ul>
            <Link href="/login" className="w-full py-5 rounded-xl bg-white text-black font-black hover:bg-zinc-200 transition-colors shadow-2xl">모든 리스크 차단</Link>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-48 px-6 z-10 relative text-center">
        <h2 className="text-5xl sm:text-7xl font-black text-white mb-10 tracking-tighter leading-tight">재무적 명확성을 회복하세요</h2>
        <p className="text-zinc-500 text-xl mb-12 max-w-2xl mx-auto leading-relaxed font-bold">인프라 구축에 소요되는 시간은 단 3분입니다.</p>
        <Link
          href="/login?auto_demo=true"
          className="inline-flex items-center justify-center gap-2 bg-white text-black font-black px-12 py-6 rounded-2xl hover:bg-zinc-200 transition-all duration-300 text-3xl shadow-3xl shadow-white/5"
        >
          즉시 시작하기
        </Link>
        <div className="mt-16 text-zinc-700 font-mono text-[10px] uppercase tracking-[0.4em]">
          Institutional Cash Preservation System
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <span className="text-zinc-400 font-bold tracking-tighter text-sm uppercase px-1">RenewAlert</span>
          </div>
          <div className="text-zinc-700 text-[9px] uppercase font-bold tracking-[0.3em]">
            © 2025 Financial Control Infrastructure Global
          </div>
        </div>
      </footer>
    </div>
  );
}
