import Link from 'next/link';

export default function SampleDashboardPage() {
  const sampleContracts = [
    { name: 'Slack', nextRenewal: '2026-03-15', amount: '₩1,920,000/년', status: 'D-21 점검 필요' },
    { name: 'Figma', nextRenewal: '2026-04-01', amount: '₩2,340,000/년', status: 'D-38 협상 가능' },
    { name: 'Notion', nextRenewal: '2026-04-20', amount: '₩1,080,000/년', status: 'D-57 유지 검토' },
  ];

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-zinc-500 text-xs font-black uppercase tracking-[0.2em] mb-3">Sample Dashboard</p>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">로그인 없이 제품 가치 확인</h1>
            <p className="text-zinc-400 mt-4">실제 화면 흐름과 유사한 샘플로 자동 갱신 리스크를 어떻게 통제하는지 확인해보세요.</p>
          </div>
          <Link
            href="/login?auto_demo=true"
            className="inline-flex items-center justify-center bg-white text-black font-black px-6 py-3 rounded-xl hover:bg-zinc-200 transition-colors"
          >
            바로 체험
          </Link>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <article className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-3">이번 달 방어 가능 비용</p>
            <p className="text-4xl font-black text-emerald-400">₩6,240,000</p>
            <p className="text-zinc-400 text-sm mt-3">D-30 이전 액션 기준 추정치</p>
          </article>
          <article className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-3">긴급 의사결정 필요</p>
            <p className="text-4xl font-black text-orange-300">2건</p>
            <p className="text-zinc-400 text-sm mt-3">Slack, AWS 결제 임박</p>
          </article>
          <article className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-3">담당자 액션율</p>
            <p className="text-4xl font-black text-blue-300">87%</p>
            <p className="text-zinc-400 text-sm mt-3">지난 4주 기준</p>
          </article>
        </section>

        <section className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black">갱신 예정 계약 샘플</h2>
            <span className="text-zinc-500 text-xs">실제 데이터가 아닌 데모 데이터입니다.</span>
          </div>
          <div className="space-y-4">
            {sampleContracts.map((contract) => (
              <div key={contract.name} className="rounded-xl border border-zinc-800 bg-black/40 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-lg font-bold">{contract.name}</p>
                  <p className="text-zinc-400 text-sm">다음 갱신일: {contract.nextRenewal}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-bold">{contract.amount}</p>
                  <p className="text-sm text-amber-300">{contract.status}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
            href="/login?auto_demo=true"
            className="inline-flex items-center justify-center bg-white text-black font-black px-7 py-4 rounded-xl hover:bg-zinc-200 transition-colors"
          >
            바로 체험
          </Link>
          <Link
            href="/#consultation-form"
            className="inline-flex items-center justify-center border border-zinc-700 text-white font-black px-7 py-4 rounded-xl hover:border-zinc-500 transition-colors"
          >
            도입 상담/견적 요청
          </Link>
        </div>
      </div>
    </main>
  );
}
