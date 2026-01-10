// app/admin/import/page.tsx
export default function AdminImportPage() {
  return (
    <main className="min-h-screen bg-black text-white p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-black">Admin: Import MFSN Epic JSON</h1>
      <p className="text-slate-400 mt-2">
        Beta-safe: paste JSON, normalize into 3B Standard, save to credit_reports.
      </p>

<form action="/api/import" method="post" className="mt-6 space-y-4">

        <input
          name="customer_id"
          placeholder="customer_id (UUID)"
          className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3"
        />
        <textarea
          name="raw_json"
          placeholder="Paste raw Epic JSON here..."
          rows={16}
          className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 font-mono text-xs"
        />
        <button className="rounded-full bg-cyan-500/15 border border-cyan-400/30 px-6 py-3 font-black text-cyan-200">
          Import →
        </button>
      </form>
    </main>
  );
}

