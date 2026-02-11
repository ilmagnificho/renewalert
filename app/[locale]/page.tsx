'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { ShockTrigger } from '@/components/dashboard/shock-trigger';
import { createClient } from '@/lib/supabase/client';

type DisplayContract = {
  name: string;
  amount: number;
  currency: string;
  cycle: 'monthly' | 'yearly';
};


const hasSupabaseConfig = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

const INDUSTRY_PROFILES: Record<string, { label: string; split: Array<{ name: string; ratio: number; cycle: 'monthly' | 'yearly' }> }> = {
  saas: {
    label: 'SaaS/IT',
    split: [
      { name: '클라우드 인프라 (예시)', ratio: 0.45, cycle: 'yearly' },
      { name: '협업/디자인 툴 (예시)', ratio: 0.32, cycle: 'yearly' },
      { name: '보안/분석 툴 (예시)', ratio: 0.23, cycle: 'yearly' },
    ],
  },
  commerce: {
    label: '이커머스/리테일',
    split: [
      { name: '마케팅 자동화 (예시)', ratio: 0.4, cycle: 'yearly' },
      { name: 'CS/운영 툴 (예시)', ratio: 0.35, cycle: 'yearly' },
      { name: '분석/리포팅 툴 (예시)', ratio: 0.25, cycle: 'yearly' },
    ],
  },
  agency: {
    label: '에이전시/서비스업',
    split: [
      { name: '프로젝트 협업 툴 (예시)', ratio: 0.38, cycle: 'yearly' },
      { name: '문서/커뮤니케이션 툴 (예시)', ratio: 0.34, cycle: 'yearly' },
      { name: '회계/업무 자동화 툴 (예시)', ratio: 0.28, cycle: 'yearly' },
    ],
  },
};

export default function LandingPage() {
  const [industry, setIndustry] = useState<'saas' | 'commerce' | 'agency'>('saas');
  const [employees, setEmployees] = useState(12);
  const [tools, setTools] = useState(8);
  const [spend, setSpend] = useState(45000);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactCompany, setContactCompany] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [leadStatus, setLeadStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [accountContracts, setAccountContracts] = useState<DisplayContract[]>([]);
  const [isAccountSession, setIsAccountSession] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  const monthlySpend = employees * tools * spend;
  const yearlySpend = monthlySpend * 12;
  const recoverableSpendMin = yearlySpend * 0.15;
  const recoverableSpendMax = yearlySpend * 0.35;

  useEffect(() => {
    async function loadContractsForSession() {
      if (!hasSupabaseConfig) {
        setIsAccountSession(false);
        setAccountContracts([]);
        setLastSyncedAt(null);
        return;
      }

      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setIsAccountSession(false);
          setAccountContracts([]);
          setLastSyncedAt(null);
          return;
        }

        setIsAccountSession(true);

        const { data: contracts } = await supabase
          .from('contracts')
          .select('name, amount, currency, cycle, updated_at')
          .eq('status', 'active')
          .order('updated_at', { ascending: false });

        if (!contracts || contracts.length === 0) {
          setAccountContracts([]);
          setLastSyncedAt(new Date().toLocaleString('ko-KR'));
          return;
        }

        const normalized = contracts
          .filter((contract) => contract.cycle === 'monthly' || contract.cycle === 'yearly')
          .sort((a, b) => {
            const aYearly = a.cycle === 'monthly' ? a.amount * 12 : a.amount;
            const bYearly = b.cycle === 'monthly' ? b.amount * 12 : b.amount;
            return bYearly - aYearly;
          })
          .slice(0, 3)
          .map((contract) => ({
            name: contract.name,
            amount: contract.amount,
            currency: contract.currency || 'KRW',
            cycle: contract.cycle,
          }));

        setAccountContracts(normalized);
        const mostRecent = contracts[0]?.updated_at;
        setLastSyncedAt(
          mostRecent ? new Date(mostRecent).toLocaleString('ko-KR') : new Date().toLocaleString('ko-KR'),
        );
      } catch {
        setIsAccountSession(false);
        setAccountContracts([]);
        setLastSyncedAt(null);
      }
    }

    void loadContractsForSession();
  }, []);

  const simulatedContracts = useMemo<DisplayContract[]>(() => {
    const profile = INDUSTRY_PROFILES[industry];
    return profile.split.map((entry) => ({
      name: entry.name,
      amount: Math.round(yearlySpend * entry.ratio),
      currency: 'KRW',
      cycle: entry.cycle,
    }));
  }, [industry, yearlySpend]);

  const shockContracts = isAccountSession && accountContracts.length > 0 ? accountContracts : simulatedContracts;
  const isSimulation = !isAccountSession || accountContracts.length === 0;
  const assumptionsText = `예시 데이터 기준: ${INDUSTRY_PROFILES[industry].label}, 팀 ${employees}명, 반복 결제 ${tools}건, 평균 월 구독비 ₩${spend.toLocaleString()}를 바탕으로 월 지출(인원×건수×월비용)과 연 지출(월×12)을 환산했습니다.`;

  const submitLead = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLeadStatus(null);
    setIsSubmittingLead(true);

    try {
      const response = await fetch('/api/sales-leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType: 'sales_consultation_requested',
          source: 'landing_consultation_form',
          lead: {
            name: contactName,
            email: contactEmail,
            company: contactCompany,
            message: contactMessage,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('lead_submit_failed');
      }

      setLeadStatus({
        type: 'success',
        message: '상담 요청이 접수되었습니다. 영업팀이 빠르게 연락드릴게요.',
      });

      setContactName('');
      setContactEmail('');
      setContactCompany('');
      setContactMessage('');
    } catch {
      setLeadStatus({
        type: 'error',
        message: '요청 전송에 실패했습니다. support@renewalert.com 으로 문의 부탁드립니다.',
      });
    } finally {
      setIsSubmittingLead(false);
    }
  };

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
          실수로 갱신된 협업 도구 1년치 요금은 단순한 &apos;실수&apos;가 아닌 확정된 영업 이익의 손실입니다.
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
            <span className="text-lg font-extrabold tracking-[0.01em] text-white">Renew<span className="text-red-400">Alert</span></span>
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
            <span>의사결정 타이밍 + 비용 손실 방지</span>
          </div>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] mb-10 text-white animate-fade-in-up drop-shadow-[0_0_20px_rgba(251,146,60,0.15)]">
            자동 결제 전에<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-300 via-amber-200 to-yellow-300">결정하세요</span>
          </h1>
          <p className="text-lg sm:text-2xl text-zinc-500 max-w-3xl mx-auto mb-12 leading-relaxed px-4 font-medium">
            깜빡하면 오늘도 쓰지 않는 서비스에 30만원이 결제됩니다.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-3xl mx-auto">
            <Link
              href="/login?auto_demo=true"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-black font-black px-10 py-5 rounded-2xl hover:bg-zinc-200 transition-all duration-300 text-xl shadow-2xl shadow-white/10"
            >
              바로 체험
            </Link>
            <Link
              href="#consultation-form"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-zinc-700 text-white font-black px-10 py-5 rounded-2xl hover:border-zinc-400 hover:bg-zinc-900/50 transition-all duration-300 text-xl"
            >
              도입 상담/견적 요청
            </Link>
            <Link
              href="/sample-dashboard"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-zinc-800 text-zinc-300 font-black px-8 py-5 rounded-2xl hover:text-white hover:border-zinc-500 transition-all duration-300 text-lg"
            >
              제품 둘러보기(샘플 대시보드)
            </Link>
          </div>
          <p className="mt-8 text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]">
            No Credit Card · 3-Minute Setup · Immediate ROI
          </p>
        </div>
      </section>

      {/* Shock Trigger - CFO Moment */}
      <section className="max-w-4xl mx-auto px-6 z-10 relative">
        <ShockTrigger
          contracts={shockContracts}
          dataSourceType={isSimulation ? 'sample' : 'account'}
          dataSourceLabel={isSimulation ? '샘플 시나리오 (예시)' : '내 계정 데이터'}
          assumptionsText={isSimulation ? assumptionsText : undefined}
          lastSyncedAt={!isSimulation ? (lastSyncedAt || undefined) : undefined}
        />
      </section>

      {/* Waste Calculator Section */}
      <section className="py-24 px-6 z-10 text-center">
        <div className="max-w-4xl mx-auto p-12 bg-zinc-950 border border-white/5 rounded-[3rem] shadow-3xl">
          <div className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-4 tracking-tight">반복 지출 규모를 확인하세요</h2>
            <p className="text-zinc-500 font-medium">조직 인원과 반복 비용 건수를 입력하면 예상 지출이 바로 계산됩니다.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16 text-left">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">업종</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value as 'saas' | 'commerce' | 'agency')}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-white text-sm font-bold"
              >
                <option value="saas">SaaS/IT</option>
                <option value="commerce">이커머스/리테일</option>
                <option value="agency">에이전시/서비스업</option>
              </select>
              <p className="text-xs text-zinc-500">비로그인 시 선택 업종 기준의 예시 시뮬레이션이 반영됩니다.</p>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">팀 규모 (인원)</label>
              <input
                type="range" min="1" max="50" value={employees}
                onChange={(e) => setEmployees(parseInt(e.target.value))}
                className="w-full accent-white h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-2xl font-black text-white">{employees}명</div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">구독 중인 반복 비용 건수</label>
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
                예: {employees}명 × {tools}건 × ₩{spend.toLocaleString()} → 약 ₩{yearlySpend.toLocaleString()} / 연
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
              href="/login?auto_demo=true"
              className="inline-flex items-center justify-center gap-2 bg-white text-black font-black px-12 py-5 rounded-2xl hover:bg-zinc-200 transition-all duration-300 text-xl"
            >
              지금 비용 누수 점검하기
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
              <p className="text-zinc-500 leading-relaxed text-sm font-medium">해지 사유 분석과 협상, 대안 도구의 도입을 위해 충분한 &apos;결정 가능 기간&apos;을 미리 확보해드립니다.</p>
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

      {/* Trust Section */}
      <section className="py-28 px-6 z-10">
        <div className="max-w-6xl mx-auto rounded-[2.5rem] border border-white/10 bg-zinc-950/70 p-10 sm:p-14">
          <div className="text-center mb-14">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-zinc-500 mb-4">Trust Layer for B2B Teams</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-5 tracking-tight">도입 전에 확인하는 신뢰 기준</h2>
            <p className="text-zinc-400 font-medium">보안·운영·지원·계약 조건까지 도입 리스크를 줄이는 기준을 공개합니다.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <article className="rounded-2xl border border-white/10 bg-black/40 p-6 space-y-3">
              <h3 className="text-white font-black text-lg">데이터 보관 방식</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">조직 단위로 데이터를 분리해 저장하고, 계약 이력은 암호화된 상태로 보관합니다.</p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-black/40 p-6 space-y-3">
              <h3 className="text-white font-black text-lg">권한/조직 관리</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">관리자·운영자 권한을 구분하고, 멤버 초대/회수 기록으로 책임 소재를 명확히 합니다.</p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-black/40 p-6 space-y-3">
              <h3 className="text-white font-black text-lg">온보딩 시간</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">핵심 계약 10건 기준 평균 30분 내 셋업을 완료하고 첫 알림 정책을 활성화합니다.</p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-black/40 p-6 space-y-3">
              <h3 className="text-white font-black text-lg">고객지원 SLA</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">영업일 기준 4시간 내 1차 응답을 보장하며, 중요 이슈는 우선 대응 채널로 처리합니다.</p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-black/40 p-6 space-y-3">
              <h3 className="text-white font-black text-lg">환불/체험 정책</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">유료 전환 전 무료 체험으로 적합성을 검증하고, 초기 도입 단계 환불 정책을 제공합니다.</p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-black/40 p-6 space-y-3">
              <h3 className="text-white font-black text-lg">보안/감사 대응</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">요청 시 조직별 운영 로그를 제공해 내부 감사 및 구매 심의를 빠르게 지원합니다.</p>
            </article>
          </div>
        </div>
      </section>

      {/* Pricing ROI Section */}
      <section className="py-32 px-6 z-10">
        <div className="max-w-6xl mx-auto text-center mb-20">
          <h2 className="text-3xl font-black text-white mb-6 tracking-tighter uppercase">ROI Based Pricing</h2>
          <p className="text-zinc-500 font-medium">한 번의 올바른 해지 결정은 수십 개월 치의 구독료를 즉시 회수합니다.</p>
        </div>

        <div className="max-w-6xl mx-auto mb-12 px-4">
          <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 py-4 px-6 text-center">
            <p className="text-emerald-200 font-bold text-sm sm:text-base">
              도입 리스크 제로 · 무료 시작 · 카드 등록 불필요 · 언제든 해지
            </p>
          </div>
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
            <Link href="#consultation-form" className="w-full py-4 rounded-xl border border-zinc-800 text-zinc-400 font-black hover:text-white transition-colors text-sm text-center">상담 요청하기</Link>
          </div>
        </div>
      </section>

      <section id="consultation-form" className="py-28 px-6 z-10">
        <div className="max-w-4xl mx-auto rounded-[2.5rem] border border-white/10 bg-zinc-950/80 p-10 sm:p-14">
          <div className="text-center mb-12">
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">B2B Sales Pipeline</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">도입 상담/견적 요청</h2>
            <p className="text-zinc-400 font-medium">Growth/Enterprise 도입 검토를 위한 상담 일정을 바로 잡아드립니다.</p>
          </div>

          <form onSubmit={submitLead} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <input
                required
                value={contactName}
                onChange={(event) => setContactName(event.target.value)}
                placeholder="이름"
                className="w-full px-5 py-4 rounded-xl bg-black border border-zinc-800 text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500"
              />
              <input
                required
                type="email"
                value={contactEmail}
                onChange={(event) => setContactEmail(event.target.value)}
                placeholder="회사 이메일"
                className="w-full px-5 py-4 rounded-xl bg-black border border-zinc-800 text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500"
              />
            </div>

            <input
              required
              value={contactCompany}
              onChange={(event) => setContactCompany(event.target.value)}
              placeholder="회사명"
              className="w-full px-5 py-4 rounded-xl bg-black border border-zinc-800 text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500"
            />

            <textarea
              rows={4}
              value={contactMessage}
              onChange={(event) => setContactMessage(event.target.value)}
              placeholder="현재 관리 중인 구독 수, 필요한 기능, 희망 일정 등을 알려주세요."
              className="w-full px-5 py-4 rounded-xl bg-black border border-zinc-800 text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500"
            />

            <button
              type="submit"
              disabled={isSubmittingLead}
              className="w-full py-5 rounded-xl bg-white text-black font-black hover:bg-zinc-200 transition-colors disabled:opacity-60"
            >
              {isSubmittingLead ? '요청 전송 중...' : '상담 요청 보내기'}
            </button>

            {leadStatus && (
              <p className={`text-sm font-semibold ${leadStatus.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                {leadStatus.message}
              </p>
            )}

            <p className="text-zinc-500 text-xs">
              폼 제출 이벤트는 세일즈 파이프라인으로 자동 전달되어 담당자가 확인합니다.
            </p>
          </form>
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
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          <div className="flex items-center gap-3 md:justify-start justify-center">
            <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div className="text-center md:text-left">
              <span className="block text-zinc-500 font-black tracking-tighter text-sm px-1 italic">RenewAlert</span>
              <p className="text-zinc-600 text-xs mt-1">RenewAlert Inc. · 서울특별시 강남구 테헤란로 123</p>
            </div>
          </div>

          <div className="text-center md:text-left space-y-2">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em]">Contact</p>
            <p className="text-zinc-400 text-sm">sales@renewalert.ai</p>
            <p className="text-zinc-400 text-sm">카카오톡 채널 · @renewalert</p>
            <p className="text-zinc-400 text-sm">고객지원: 평일 09:00 - 18:00 (KST)</p>
          </div>

          <div className="text-center md:text-right space-y-3">
            <div className="flex items-center justify-center md:justify-end gap-4 text-sm">
              <Link href="/terms" className="text-zinc-400 hover:text-white transition-colors">이용약관</Link>
              <Link href="/privacy" className="text-zinc-400 hover:text-white transition-colors">개인정보처리방침</Link>
            </div>
            <div className="text-zinc-700 text-[9px] uppercase font-black tracking-[0.3em]">
              © 2025 RenewAlert Global · Built for Operators
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
