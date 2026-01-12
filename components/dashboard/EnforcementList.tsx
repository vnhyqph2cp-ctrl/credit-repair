type EnforcementItem = {
  id: string;
  bureau: string | null;
  issue_type: string | null;
  status: string;
  created_at: string;
  next_action_date?: string | null;
};

type EnforcementListProps = {
  items: EnforcementItem[];
  getStatusColor: (status: string) => string;
};

export function EnforcementList({
  items,
  getStatusColor,
}: EnforcementListProps) {
  if (items.length === 0) {
    return (
      <section className="glass-card text-center">
        <p className="text-gray-300">No dispute activity yet.</p>
        <p className="mt-2 text-sm text-gray-400">
          Upload your credit report to get started.
        </p>
      </section>
    );
  }

  return (
    <section className="glass-card p-0">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-white/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="text-sm font-semibold text-white">
            Recent enforcement items
          </h2>
          <p className="text-xs text-gray-400">
            Active disputes and bureau investigations.
          </p>
        </div>

        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[11px] text-gray-300 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Live data
        </span>
      </div>

      {/* List */}
      <div className="divide-y divide-white/10">
        {items.map((p) => (
          <div
            key={p.id}
            className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
          >
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 ring-1 ring-white/10 text-xs font-semibold text-cyan-300">
                {p.bureau?.[0] || "?"}
              </div>

              <div>
                <p className="text-sm font-medium text-white">
                  {p.bureau || "Unknown Bureau"} ·{" "}
                  {p.issue_type || "General Dispute"}
                </p>
                <p className="text-xs text-gray-400">
                  Opened{" "}
                  {new Date(p.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${getStatusColor(
                  p.status
                )}`}
              >
                {p.status}
              </span>

              <button
                type="button"
                className="text-[11px] font-medium text-cyan-300 hover:text-cyan-200 underline-offset-4 hover:underline"
              >
                View details
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
