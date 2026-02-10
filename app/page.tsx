'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ShockTrigger } from '@/components/dashboard/shock-trigger';

export default function LandingPage() {
  const [employees, setEmployees] = useState(12);
  const [tools, setTools] = useState(8);
  const [spend, setSpend] = useState(45000);

  const monthlySpend = employees * tools * spend;
  const yearlySpend = monthlySpend * 12;
  const recoverableSpendMin = yearlySpend * 0.15;
  const recoverableSpendMax = yearlySpend * 0.35;

  const mockAtRisk = [
    { name: 'AWS', amount: 4800000, currency: 'KRW', cycle: 'yearly' },
    { name: 'Figma', amount: 2340000, currency: 'KRW', cycle: 'yearly' },
    { name: 'Slack', amount: 1920000, currency: 'KRW', cycle: 'yearly' },
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-foreground overflow-x-hidden selection:bg-white selection:text-black font-sans">
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-zinc-800/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-zinc-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Financial Exposure Line */}
      <div className="relative z-[60] bg-zinc-900/80 backdrop-blur-md border-b border-white/5 py-2.5 px-6 text-center">
        <p className="text-[10px] sm:text-xs font-bold tracking-tight text-zinc-400">
          실수로 갱신된 협업 도구 1년치 요금은 단순한 '실수'가 아닌 확정된 영업 이익의 손실입니다.
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
              className="text-sm font-black bg-white text-black px-6 py-2.5 rounded-full hover:bg-zinc-200 transition-all duration-200 shadow-xl shadow-white/5 active:scale-95"
            >
              시스템 시작
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 z-10 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-black px-4 py-1.5 rounded-full mb-10 backdrop-blur-md">
            <span>Corporate Cost Prevention System</span>
          </div>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] mb-10 text-white animate-fade-in-up">
            자동 갱신 전에<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-600">결정 타이밍을 잡으세요</span>
          </h1>
          <p className="text-lg sm:text-2xl text-zinc-500 max-w-3xl mx-auto mb-12 leading-relaxed px-4 font-medium">
            RenewAlert은 단순한 관리가 아닌 '방어'를 위한 도구입니다.<br className="hidden md:block" />
            무의미한 고정 지출이 영업 이익을 갉아먹기 전에 의사결정 시점을 알려드립니다.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/login?auto_demo=true"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-black font-black px-10 py-5 rounded-2xl hover:bg-zinc-200 transition-all duration-300 text-xl shadow-2xl shadow-white/10"
            >
              우리 팀 지출 관리 시작하기
            </Link>
          </div>
          <p className="mt-8 text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]">
            No Credit Card · 3-Minute Setup · Immediate ROI
          </p>
        </div>
      </section>

      {/* Shock Trigger - CFO Moment */}
      <section className="max-w-4xl mx-auto px-6 z-10 relative">
        <ShockTrigger contracts={mockAtRisk} />
      </section>

      {/* Waste Calculator Section */}
      <section className="py-24 px-6 z-10 text-center">
        <div className="max-w-4xl mx-auto p-12 bg-zinc-950 border border-white/5 rounded-[3rem] shadow-3xl">
          <div className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-4 tracking-tight">반복 지출 규모를 확인하세요</h2>
            <p className="text-zinc-500 font-medium">팀 규모와 도구 수를 입력하면 예상 구독 비용이 바로 계산됩니다.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16 text-left">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">조직 규모 (인원)</label>
              <input
                type="range" min="1" max="100" value={employees}
                onChange={(e) => setEmployees(parseInt(e.target.value))}
                className="w-full accent-white h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-2xl font-black text-white">{employees}명</div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">사용 중인 SaaS 개수</label>
              <input
                type="range" min="1" max="50" value={tools}
                onChange={(e) => setTools(parseInt(e.target.value))}
                className="w-full accent-white h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-2xl font-black text-white">{tools}개</div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">평균 월 구독 비용</label>
              <input
                type="range" min="10000" max="300000" step="5000" value={spend}
                onChange={(e) => setSpend(parseInt(e.target.value))}
                className="w-full accent-white h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-2xl font-black text-white">₩{spend.toLocaleString()}</div>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 text-center">
            <p className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.4em] mb-4">관리 대상 연간 구독 비용</p>
            <div className="space-y-2 mb-10">
              <div className="text-3xl sm:text-4xl font-black text-zinc-400 tabular-nums tracking-tighter">
                ₩{monthlySpend.toLocaleString()} / 월
              </div>
              <div className="text-5xl sm:text-7xl font-black text-white tabular-nums tracking-tighter">
                ₩{yearlySpend.toLocaleString()} / 연
              </div>
              <p className="text-zinc-500 text-sm font-medium mt-2">
                자동 갱신 전에 점검하면 불필요한 지출을 줄일 수 있습니다.
              </p>
              <div className="text-zinc-600 text-[10px] font-mono mt-4">
                예: {employees}명 × {tools}개 × ₩{spend.toLocaleString()} → 약 ₩{yearlySpend.toLocaleString()} / 연
              </div>
            </div>

            <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 mb-12 inline-block">
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">사전 점검으로 줄일 수 있는 비용 (예상)</p>
              <div className="text-2xl sm:text-3xl font-black text-blue-400 tracking-tight">
                ₩{recoverableSpendMin.toLocaleString()} ~ ₩{recoverableSpendMax.toLocaleString()} / 연
              </div>
            </div>

            <div className="block mb-10">
              <p className="text-zinc-400 text-sm font-bold">
                단 한 건의 자동 갱신만 막아도 <br className="sm:hidden" />
                RenewAlert은 1년 사용 비용을 회수할 수 있습니다.
              </p>
            </div>

            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-white text-black font-black px-12 py-5 rounded-2xl hover:bg-zinc-200 transition-all duration-300 text-xl"
            >
              우리 팀 지출 관리 시작하기
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Block: Decision-First */}
      <section className="py-32 px-6 z-10 border-y border-white/5 bg-zinc-950/20 text-center">
        <div className="max-w-7xl mx-auto">
          <div className="mb-24">
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">결정의 순간을 놓치지 마세요</h2>
            <p className="text-zinc-500 text-lg font-medium">RenewAlert은 관리를 넘어 실질적인 해지와 조정을 돕습니다.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-left">
            <div className="space-y-6">
              <div className="text-2xl font-black text-zinc-200">의사결정 리드타임 확보</div>
              <p className="text-zinc-500 leading-relaxed text-sm font-medium">해지 사유 분석과 협상, 대안 도구의 도입을 위해 충분한 '결정 가능 기간'을 미리 확보해드립니다.</p>
            </div>
            <div className="space-y-6">
              <div className="text-2xl font-black text-zinc-200">해지 실행 인텔리전스</div>
              <p className="text-zinc-500 leading-relaxed text-sm font-medium">복잡한 해지 메뉴와 숨겨진 페널티 규정. 국내외 주요 서비스의 해지 프로세스를 즉시 안내합니다.</p>
            </div>
            <div className="space-y-6">
              <div className="text-2xl font-black text-zinc-200">오퍼레이터 히스토리</div>
              <p className="text-zinc-500 leading-relaxed text-sm font-medium">담당자가 변경되어도 과거의 계약 조건과 의사결정 맥락을 자산으로 영구 보존합니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing ROI Section */}
      <section className="py-32 px-6 z-10">
        <div className="max-w-6xl mx-auto text-center mb-20">
          <h2 className="text-3xl font-black text-white mb-6 tracking-tighter uppercase">ROI Based Pricing</h2>
          <p className="text-zinc-500 font-medium">한 번의 올바른 해지 결정은 수십 개월 치의 구독료를 즉시 회수합니다.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {/* Free */}
          <div className="p-10 rounded-[2.5rem] border border-zinc-900 bg-black flex flex-col">
            <span className="text-zinc-600 font-black uppercase tracking-widest text-[9px] mb-4">Adoption</span>
            <h3 className="text-xl font-bold text-white mb-6 tracking-tighter uppercase">Free</h3>
            <div className="text-zinc-300 mb-8 font-black text-3xl">₩0</div>
            <ul className="space-y-4 text-zinc-500 text-sm font-medium mb-12 flex-1">
              <li className="flex items-center gap-2">✔ 핵심 계약 3건 관리</li>
              <li className="flex items-center gap-2">✔ 단일 알림 윈도우</li>
              <li className="flex items-center gap-2">✔ 기본 ROI 트래킹</li>
            </ul>
            <Link href="/login" className="w-full py-4 rounded-xl border border-zinc-800 text-zinc-400 font-black hover:text-white transition-colors text-sm text-center">시작하기</Link>
          </div>

          {/* Core */}
          <div className="p-10 rounded-[2.5rem] border border-blue-600/50 bg-zinc-900/40 flex flex-col relative shadow-2xl shadow-blue-900/20">
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-bl-xl">Most Applied</div>
            <span className="text-blue-500 font-black uppercase tracking-widest text-[9px] mb-4">Core Defense</span>
            <h3 className="text-xl font-bold text-white mb-6 tracking-tighter uppercase">Core</h3>
            <div className="text-white mb-8 font-black text-3xl">₩39,000 <span className="text-zinc-500 text-xs">/ 월</span></div>
            <ul className="space-y-4 text-zinc-300 text-sm font-medium mb-12 flex-1">
              <li className="flex items-center gap-2 text-blue-400">✔ 최대 40개 계약 관리</li>
              <li className="flex items-center gap-2">✔ 멀티 결정 윈도우 (D-3,7,30)</li>
              <li className="flex items-center gap-2 font-bold text-white">✔ 해지 실행 카드 & 가이드</li>
              <li className="flex items-center gap-2 font-bold text-white">✔ 실시간 환율 기반 ROI 대시보드</li>
            </ul>
            <Link href="/login" className="w-full py-5 rounded-xl bg-blue-600 text-white font-black hover:bg-blue-500 transition-colors text-sm text-center shadow-xl shadow-blue-900/40">도입하기</Link>
          </div>

          {/* Growth */}
          <div className="p-10 rounded-[2.5rem] border border-zinc-900 bg-black flex flex-col">
            <span className="text-zinc-600 font-black uppercase tracking-widest text-[9px] mb-4">Enterprise Expansion</span>
            <h3 className="text-xl font-bold text-white mb-6 tracking-tighter uppercase">Growth</h3>
            <div className="text-zinc-300 mb-8 font-black text-3xl">₩99,000 <span className="text-zinc-500 text-xs">/ 월</span></div>
            <ul className="space-y-4 text-zinc-500 text-sm font-medium mb-12 flex-1">
              <li className="flex items-center gap-2 text-white">✔ 무제한 계약 관리</li>
              <li className="flex items-center gap-2">✔ 전사 지출 리포트 (준비 중)</li>
              <li className="flex items-center gap-2">✔ 조직 가시성 & 관리자 권한</li>
              <li className="flex items-center gap-2">✔ 우선 순위 기술 지원</li>
            </ul>
            <Link href="/login" className="w-full py-4 rounded-xl border border-zinc-800 text-zinc-400 font-black hover:text-white transition-colors text-sm text-center">문의하기</Link>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-48 px-6 z-10 relative text-center">
        <h2 className="text-5xl sm:text-7xl font-black text-white mb-10 tracking-tighter leading-tight">손실로 확정되기 전에<br />통제권을 가지세요</h2>
        <p className="text-zinc-500 text-xl mb-12 max-w-2xl mx-auto leading-relaxed font-bold">전수 조사 및 셋업에 필요한 시간은 단 3분입니다.</p>
        <Link
          href="/login?auto_demo=true"
          className="inline-flex items-center justify-center gap-2 bg-white text-black font-black px-12 py-6 rounded-2xl hover:bg-zinc-200 transition-all duration-300 text-3xl shadow-3xl shadow-white/5"
        >
          지금 즉시 도입
        </Link>
        <div className="mt-16 text-zinc-700 font-mono text-[10px] uppercase font-black tracking-[0.4em]">
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
            <span className="text-zinc-500 font-black tracking-tighter text-sm px-1 italic">RenewAlert</span>
          </div>
          <div className="text-zinc-700 text-[9px] uppercase font-black tracking-[0.3em]">
            © 2025 RenewAlert Global · Built for Operators
          </div>
        </div>
      </footer>
    </div>
  );
}
