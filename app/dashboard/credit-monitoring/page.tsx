// app/dashboard/credit-monitoring/page.tsx
export default function CreditMonitoringPage() {
  // Later this will fetch live MFSN data.
  const mockScores = {
    experian: 682,
    equifax: 675,
    transunion: 688,
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight">
          Credit Monitoring
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Snapshot of your three‑bureau scores and recent alerts.
        </p>
      </header>

      {/* 3B score cards */}
      <section className="grid gap-4 md:grid-cols-3">
        {Object.entries(mockScores).map(([bureau, score]) => (
          <div
            key={bureau}
            className="rounded-lg border border-slate-800 bg-slate-900/60 p-4"
          >
            <p className="text-xs uppercase tracking-wide text-slate-400">
              {bureau}
            </p>
            <p className="mt-2 text-3xl font-bold text-emerald-400">
              {score}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Live data will appear here after connecting MyFreeScoreNow.
            </p>
          </div>
        ))}
      </section>

      {/* Alerts placeholder */}
      <section className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
        <h3 className="text-sm font-semibold text-slate-200">
          Recent alerts
        </h3>
        <p className="mt-2 text-xs text-slate-400">
          No alerts yet. Once monitoring is connected, new inquiries, accounts,
          and important changes will show up here.
        </p>
      </section>
    </div>
  );
}
