type NeonGaugeProps = {
  value: number;          // score (e.g., 607)
  min?: number;           // default 300
  max?: number;           // default 850
  label?: string;
  sublabel?: string;
};

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export default function NeonGauge({
  value,
  min = 300,
  max = 850,
  label = "3-bureau average",
  sublabel = "Latest snapshot",
}: NeonGaugeProps) {
  const pct = clamp(((value - min) / (max - min)) * 100, 0, 100);
  const gradId = "neonGaugeGradient";
  const glowId = "neonGaugeGlow";

  return (
    <div className="relative mx-auto w-[340px] h-[220px] sm:w-[440px] sm:h-[280px]">
      <svg viewBox="0 0 1000 600" className="w-full h-full">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="55%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#d946ef" />
          </linearGradient>

          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Track */}
        <path
          d="M 150 450 A 350 350 0 0 1 850 450"
          fill="none"
          stroke="rgba(148,163,184,0.16)"
          strokeWidth="95"
          strokeLinecap="round"
        />

        {/* Progress */}
        <path
          d="M 150 450 A 350 350 0 0 1 850 450"
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth="95"
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={100}
          strokeDashoffset={100 - pct}
          filter={`url(#${glowId})`}
        />
      </svg>

      {/* Core */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-12">
        <div className="rounded-3xl border border-slate-800/60 bg-black/50 px-6 py-4 shadow-[0_0_60px_rgba(217,70,239,0.10)]">
          <div className="text-center">
            <div className="text-6xl sm:text-7xl font-black bg-gradient-to-br from-cyan-400 via-teal-300 to-fuchsia-400 bg-clip-text text-transparent tabular-nums">
              {value ? value : "--"}
            </div>
            <div className="mt-1 text-xs font-black uppercase tracking-[0.25em] text-slate-400">
              {label}
            </div>
            <div className="mt-2 text-xs text-slate-500">{sublabel}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
