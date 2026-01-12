type StatCardTone = "live" | "working" | "resolved";

type StatCardProps = {
  label: string;
  value: string | number;
  badgeLabel: string;
  tone: StatCardTone;
};

const toneStyles: Record<StatCardTone, string> = {
  live:
    "border-cyan-400/60 bg-cyan-400/10 text-cyan-300",
  working:
    "border-purple-400/60 bg-purple-400/10 text-purple-300",
  resolved:
    "border-emerald-400/70 bg-emerald-400/10 text-emerald-300",
};

export function StatCard({ label, value, badgeLabel, tone }: StatCardProps) {
  const badgeTone = toneStyles[tone];

  return (
    <div className="glass-card p-0 transition-all duration-200 hover:-translate-y-1 hover:glow-strong">
      <div className="flex items-center justify-between px-4 py-4">
        <div>
          <p className="text-xs text-gray-400">{label}</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight text-white">
            {value}
          </p>
        </div>

        <span
          className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${badgeTone}`}
        >
          {badgeLabel}
        </span>
      </div>
    </div>
  );
}
