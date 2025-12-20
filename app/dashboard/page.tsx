// File: app/dashboard/page.tsx

type Score = {
  bureau: 'TU' | 'EQF' | 'EXP';
  score: number;
  pulledAt: string;
};

type Health = {
  customerId: string;
  overallScore: number;
};

async function get3BReport(customerId: string): Promise<Score[] | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

    const res = await fetch(`${baseUrl}/api/3b/reports/${customerId}`, {
      cache: 'no-store',
    });

    if (!res.ok) return null;

    const json = await res.json();
    return json.data?.report?.scores ?? null;
  } catch {
    return null;
  }
}

async function get3BHealth(customerId: string): Promise<Health | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

    const res = await fetch(`${baseUrl}/api/3b/health/${customerId}`, {
      cache: 'no-store',
    });

    if (!res.ok) return null;

    const json = await res.json();
    return json.data?.health ?? null;
  } catch {
    return null;
  }
}

export default async function DashboardPage() {
  const customerId = 'cust_test_123';

  const [scores, health] = await Promise.all([
    get3BReport(customerId),
    get3BHealth(customerId),
  ]);

  const avg =
    scores && scores.length
      ? Math.round(
          scores.reduce((sum, s) => sum + s.score, 0) / scores.length
        )
      : 0;

  // Placeholder until you derive real 30‑day change from history
  const delta = 24;
  const deltaLabel = `${delta >= 0 ? '+' : ''}${delta} points in last 30 days`;

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8 space-y-6">
      {/* Top summary */}
      <section className="grid gap-4 md:grid-cols-[2fr,1fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400 mb-2">
            Credit summary
          </p>
          <p className="text-sm text-slate-400 mb-1">3B average score</p>
          <p className="text-3xl font-semibold text-emerald-300">
            {avg || '--'}
          </p>
          <p className="text-[11px] text-emerald-400 mt-1">
            {scores ? deltaLabel : 'No recent change data'}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 space-y-2 text-xs text-slate-300">
          <p className="font-semibold text-slate-100">Next actions</p>
          <p>- Confirm MyFreeScoreNow connection.</p>
          <p>- Review monitoring alerts.</p>
          <p>- Start first dispute batch.</p>
        </div>
      </section>

      {/* Lower cards */}
      <section className="grid gap-4 md:grid-cols-3 text-xs text-slate-300">
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <p className="font-semibold text-emerald-300 mb-1">Monitoring</p>
          <p>Score changes, alerts, utilization, and new inquiries.</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <p className="font-semibold text-cyan-300 mb-1">Disputes</p>
          <p>Queued letters and items in progress by bureau.</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <p className="font-semibold text-fuchsia-300 mb-1">Funding path</p>
          <p>Tracked toward target scores and offer tiers.</p>
        </div>
      </section>
    </main>
  );
}
