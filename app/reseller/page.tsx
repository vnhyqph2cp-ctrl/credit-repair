// app/reseller/page.tsx
const clients = [
  { name: 'John Doe', plan: '3B Builder', score: 682, status: 'In Progress' },
  { name: 'Maria Lopez', plan: 'Funding Path', score: 720, status: 'Funding‑Ready' },
];

export default function ResellerDashboard() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Reseller Oversight</h1>
        <p className="text-sm text-textMuted">
          See how your clients are progressing through their 3B Credit Builder plans.
        </p>
      </header>

      <section className="rounded-xl border border-border bg-secondary p-4">
        <table className="w-full text-sm">
          <thead className="text-left text-textMuted">
            <tr>
              <th className="py-2">Client</th>
              <th className="py-2">Plan</th>
              <th className="py-2">Score</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.name} className="border-t border-border/60">
                <td className="py-2">{c.name}</td>
                <td className="py-2">{c.plan}</td>
                <td className="py-2">{c.score}</td>
                <td className="py-2 text-highlight">{c.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
