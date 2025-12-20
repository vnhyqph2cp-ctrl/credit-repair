// File: app/dashboard/monitoring/page.tsx

export default function MonitoringPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8 space-y-4">
      <h1 className="text-2xl font-semibold text-slate-100">
        Monitoring & alerts
      </h1>
      <p className="text-sm text-slate-400">
        Live 3B monitoring will appear here: score changes, alerts, new
        tradelines, and inquiries.
      </p>

      <section className="grid gap-4 md:grid-cols-3 text-xs text-slate-300">
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <p className="font-semibold text-emerald-300 mb-1">Recent alerts</p>
          <p>No alerts yet. Your first 3B pull will populate this area.</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <p className="font-semibold text-cyan-300 mb-1">Score changes</p>
          <p>Track up and down moves by bureau over time.</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <p className="font-semibold text-fuchsia-300 mb-1">New activity</p>
          <p>New tradelines, inquiries, and key changes will appear here.</p>
        </div>
      </section>
    </main>
  );
}
