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
          기업은 불필요하거나 잊혀진 계약으로 인해 전체 고정비의 20~30%를 손실하고 있습니다.
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
            <span className="text-lg font-bold tracking-tight text-white uppercase">RenewAlert</span>
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
          <div className="inline-flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-bold px-4 py-1.5 rounded-full mb-10 backdrop-blur-md">
            <span>반복 지출 관리 시스템</span>
          </div>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] mb-10 text-white animate-fade-in-up">
            나도 모르는 고정 비용이<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-600">수익을 갉아먹고 있습니다</span>
          </h1>
          <p className="text-lg sm:text-2xl text-zinc-500 max-w-3xl mx-auto mb-12 leading-relaxed px-4">
            RenewAlert은 행동이 필요한 결정의 순간을 알려드립니다. <br className="hidden md:block" />
            무의미한 반복 지출이 손실로 확정되기 전에 통제권을 가지세요.
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
            카드 등록 없음 · 3분 설정 · 즉각적인 지출 가시성 확보
          </p>
        </div>
      </section>

      {/* At-Risk Money Label */}
      <section className="py-12 z-10 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center p-8 border border-white/5 bg-zinc-950 rounded-[2rem] text-center">
            <span className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em] mb-4">지출 리스크 샘플</span>
            <div className="text-5xl sm:text-6xl font-black text-white tabular-nums tracking-tighter mb-4">
              ₩18,400,000
            </div>
            <p className="text-zinc-500 text-sm font-medium">관리하지 않는 고정비는 곧 확정된 손실이 됩니다.</p>
          </div>
        </div>
      </section>

      {/* Waste Calculator Section */}
      <section className="py-24 px-6 z-10 text-center">
        <div className="max-w-4xl mx-auto p-12 bg-zinc-950 border border-white/5 rounded-[3rem] shadow-3xl">
          <div className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 tracking-tight">잠복 지출 진단</h2>
            <p className="text-zinc-500 font-medium">조직 규모와 지출 형태에 따른 예상 손실액을 확인하세요.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16 text-left">
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

          <div className="pt-12 border-t border-white/5">
            <p className="text-zinc-500 text-sm font-medium mb-4 uppercase tracking-[0.2em]">연간 예상 누수 비용</p>
            <div className="text-4xl sm:text-6xl font-black text-white mb-10 tracking-tighter tabular-nums">
              ₩{estimatedWaste.toLocaleString()}
            </div>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 text-white font-bold px-12 py-5 rounded-2xl hover:bg-zinc-800 transition-all duration-300 text-xl"
            >
              고정비 손실 차단하기
            </Link>
          </div>
        </div>
      </section>

      {/* Executive Reframe Block */}
      <section className="py-32 px-6 z-10 border-y border-white/5 bg-zinc-950/20 text-center">
        <div className="max-w-7xl mx-auto">
          <div className="mb-24">
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">합리적 판단을 돕는 일련의 신호들</h2>
            <p className="text-zinc-500 text-lg">RenewAlert은 단순 추적을 넘어, 현금 흐름을 보호하는 고정비 통제 시스템입니다.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-left">
            <div className="space-y-6">
              <div className="text-2xl font-bold text-zinc-200">의사결정 타이밍 확보</div>
              <p className="text-zinc-500 leading-relaxed text-sm">갱신이나 해지 여부를 판단하기 위해 필요한 최적의 협상 시간을 확보해 드립니다.</p>
            </div>
            <div className="space-y-6">
              <div className="text-2xl font-bold text-zinc-200">지출 가시화</div>
              <p className="text-zinc-500 leading-relaxed text-sm">회계 장부에 기록되기 전, 예정된 모든 반복 지출의 리스크를 사전에 파악합니다.</p>
            </div>
            <div className="space-y-6">
              <div className="text-2xl font-bold text-zinc-200">계약 컨텍스트 보존</div>
              <p className="text-zinc-500 leading-relaxed text-sm">담당자가 바뀌어도 조직의 모든 계약 일정과 히스토리를 자산으로 남깁니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing ROI Section */}
      <section className="py-32 px-6 z-10">
        <div className="max-w-6xl mx-auto text-center mb-20">
          <h2 className="text-3xl font-black text-white mb-6 tracking-tighter uppercase">Price</h2>
          <p className="text-zinc-500 font-medium">불필요한 자동 갱신을 한 번만 막아도 1년 사용료 이상의 가치를 돌려받습니다.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          <div className="p-10 rounded-[2.5rem] border border-zinc-900 bg-zinc-950 flex flex-col items-center">
            <span className="text-zinc-600 font-bold uppercase tracking-widest text-[9px] mb-4">Start</span>
            <h3 className="text-xl font-bold text-white mb-10 tracking-tighter uppercase">Free</h3>
            <ul className="space-y-5 text-zinc-500 text-sm font-medium mb-12 flex-1 text-left w-full">
              <li className="flex items-center gap-3">
                <span className="text-zinc-700">✔</span>
                고정비 3건 리스크 추적
              </li>
              <li className="flex items-center gap-3">
                <span className="text-zinc-700">✔</span>
                기본 행동 시점 알림
              </li>
              <li className="flex items-center gap-3">
                <span className="text-zinc-700">✔</span>
                일일 환율 변동 가시화
              </li>
            </ul>
            <Link href="/login" className="w-full py-4 rounded-xl border border-zinc-800 text-zinc-400 font-bold hover:text-white transition-colors text-sm text-center">무료로 시작</Link>
          </div>

          <div className="p-12 rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-zinc-800 to-black flex flex-col items-center relative shadow-3xl">
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-bl-xl">Best Value</div>
            <span className="text-zinc-400 font-bold uppercase tracking-widest text-[9px] mb-4">Standard</span>
            <h3 className="text-2xl font-bold text-white mb-4 tracking-tighter uppercase font-mono tracking-widest">Pro</h3>
            <div className="text-zinc-300 mb-10 font-black text-3xl">₩19,000 <span className="text-zinc-600 text-xs font-medium">/ mo</span></div>

            <div className="w-full text-left space-y-8 flex-1">
              <div>
                <h4 className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-4">현재 제공 기능</h4>
                <ul className="space-y-4 text-zinc-300 text-sm font-medium">
                  <li className="flex items-center gap-3">
                    <span className="text-blue-500">✔</span>
                    무제한 알림 자산 등록
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-blue-500">✔</span>
                    결정 시점 자동 알림
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-blue-500">✔</span>
                    실시간 환율 변동 반영 (하나은행 기준)
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest mb-4">준비 중</h4>
                <ul className="space-y-4 text-zinc-500 text-sm font-medium">
                  <li className="flex items-center justify-between">
                    <span>의사결정 타이밍 분석</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-600 font-bold uppercase">준비 중</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>지출 통계 분석 리포트</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-600 font-bold uppercase">준비 중</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>부서별 통합 관리 시스템</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-600 font-bold uppercase">준비 중</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="w-full pt-8 text-center">
              <Link href="/roadmap" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors mb-8 block">로드맵 보기 →</Link>
              <Link href="/login" className="w-full py-5 block rounded-xl bg-white text-black font-black hover:bg-zinc-200 transition-colors shadow-2xl text-center">Pro로 시작하기</Link>
              <p className="mt-4 text-[10px] text-zinc-600 font-medium">일부 기능은 현재 개발 중이며 순차적으로 제공됩니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-48 px-6 z-10 relative text-center">
        <h2 className="text-5xl sm:text-7xl font-black text-white mb-10 tracking-tighter leading-tight">지출의 가시성을 확보하세요</h2>
        <p className="text-zinc-500 text-xl mb-12 max-w-2xl mx-auto leading-relaxed font-bold">시스템 설정에 소요되는 시간은 단 3분입니다.</p>
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
            <span className="text-zinc-500 font-bold tracking-tighter text-sm px-1 italic">RenewAlert</span>
          </div>
          <div className="text-zinc-700 text-[9px] uppercase font-bold tracking-[0.3em]">
            © 2025 RenewAlert Global
          </div>
        </div>
      </footer>
    </div>
  );
}
