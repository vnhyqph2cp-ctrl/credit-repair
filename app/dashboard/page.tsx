import { BADGES } from "./components/badges";
import { BadgePicker } from "./components/BadgePicker";
import NeonGauge from "./components/NeonGauge";

// ...
<NeonGauge value={avg} label="3B Average Score" sublabel="TransUnion • Equifax • Experian" />


async function get3BReport(customerId: string): Promise<Score[] | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/3b/reports/${customerId}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data?.report?.scores ?? null;
  } catch {
    return null;
  }
}

async function get3BHealth(customerId: string): Promise<Health | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/3b/health/${customerId}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data?.health ?? null;
  } catch {
    return null;
  }
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function scoreToPct(score: number) {
  // Credit range baseline 300-850
  return clamp(((score - 300) / (850 - 300)) * 100, 0, 100);
}

function bureauName(b: Score["bureau"]) {
  if (b === "TU") return "TransUnion";
  if (b === "EQF") return "Equifax";
  return "Experian";
}

function statusFromScore(avg: number) {
  if (!avg) return { label: "Not Ready", tone: "slate" as const };
  if (avg >= 700) return { label: "700+ Club", tone: "lime" as const };
  if (avg >= 660) return { label: "Strong", tone: "cyan" as const };
  if (avg >= 600) return { label: "Building", tone: "purple" as const };
  return { label: "Rebuild Mode", tone: "fuchsia" as const };
}

function toneClasses(tone: "slate" | "lime" | "cyan" | "purple" | "fuchsia") {
  switch (tone) {
    case "lime":
      return "border-lime-400/40 bg-lime-400/10 text-lime-200";
    case "cyan":
      return "border-cyan-400/40 bg-cyan-400/10 text-cyan-200";
    case "purple":
      return "border-purple-400/40 bg-purple-400/10 text-purple-200";
    case "fuchsia":
      return "border-fuchsia-400/40 bg-fuchsia-400/10 text-fuchsia-200";
    default:
      return "border-slate-400/30 bg-slate-400/10 text-slate-200";
  }
}

export default async function DashboardPage() {
  // Beta placeholder — later this comes from Supabase Auth customer record
  const customerId = "cust_test_123";

  const [scores, health] = await Promise.all([get3BReport(customerId), get3BHealth(customerId)]);

  const avg =
    scores && scores.length ? Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length) : 0;

  const pct = avg ? scoreToPct(avg) : 0;

  // If you have a real delta somewhere later, plug it here.
  // For now we show "Latest Snapshot" instead of fake numbers.
  const status = statusFromScore(avg);

  const gradId = `bbGradient-${customerId}`;
  const glowId = `bbGlow-${customerId}`;

  const hasSnapshot = !!(scores && scores.length);

  const nextAction = hasSnapshot ? "Review disputable items and start Round 1." : "Connect MyFreeScoreNow to pull your Snapshot.";
  const nextHref = hasSnapshot ? "/dashboard/disputes" : "/go/mfsn";
  const nextCta = hasSnapshot ? "Go to Disputes →" : "Connect MyFreeScoreNow →";

  const step1 = hasSnapshot ? "Ready" : "Locked";
  const step2 = hasSnapshot ? "Ready" : "Locked";
  const step3 = avg >= 700 ? "Unlocked" : "Locked";

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-b from-black via-slate-950 to-black text-slate-100">
      {/* Neon ambient background (safe + contained) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -top-20 right-[-120px] h-[520px] w-[520px] rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute bottom-[-220px] left-[-160px] h-[620px] w-[620px] rounded-full bg-teal-500/10 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
      </div>

      {/* Top bar */}
      <header className="relative z-10 border-b border-slate-800/50 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-fuchsia-400 bg-clip-text text-transparent">
                  3B
                </span>{" "}
                <span className="text-white">Dashboard</span>
              </h1>

              <span
                className={`hidden sm:inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${toneClasses(
                  status.tone
                )}`}
              >
                <span className="h-2 w-2 rounded-full bg-current opacity-80" />
                {status.label}
              </span>
            </div>

            <p className="mt-1 text-xs md:text-sm text-slate-400 truncate">
              Customer: <span className="text-slate-200 font-semibold">{customerId}</span>
              {health?.overallScore ? (
                <>
                  {" "}
                  • Health: <span className="text-slate-200 font-semibold">{health.overallScore}</span>
                </>
              ) : null}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/"
              className="rounded-full border border-slate-700/70 bg-black/40 px-4 py-2 text-xs md:text-sm font-semibold hover:border-cyan-400/40 hover:bg-cyan-500/10 transition"
            >
              ← Home
            </a>
            <a
              href={hasSnapshot ? "/dashboard/funding-path" : "/go/mfsn"}
              className="rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 px-4 py-2 text-xs md:text-sm font-bold text-fuchsia-200 hover:border-fuchsia-300/60 hover:bg-fuchsia-500/15 transition"
            >
              700+ Club
            </a>
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 py-8 md:py-12 space-y-8">
        {/* HERO: Score room */}
        <section className="relative rounded-3xl border border-slate-800/60 bg-gradient-to-br from-slate-900/70 to-black/80 p-6 md:p-10 lg:p-12 shadow-2xl overflow-hidden">
          {/* Corner neon lines */}
          <div className="pointer-events-none absolute inset-0 opacity-60">
            <div className="absolute top-0 left-0 h-[1px] w-full bg-gradient-to-r from-cyan-400/30 via-transparent to-fuchsia-400/30" />
            <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-teal-400/25 to-transparent" />
            <div className="absolute top-0 left-0 h-full w-[1px] bg-gradient-to-b from-cyan-400/25 via-transparent to-fuchsia-400/25" />
            <div className="absolute top-0 right-0 h-full w-[1px] bg-gradient-to-b from-fuchsia-400/25 via-transparent to-cyan-400/25" />
          </div>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            {/* Left: Big meter */}
            <div className="text-center">
              <p className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-slate-400 mb-5">
                Credit Summary
              </p>

              {/* Half-ring neon gauge (logo-style) */}
              <div className="relative mx-auto w-[320px] h-[200px] sm:w-[420px] sm:h-[260px] lg:w-[520px] lg:h-[320px]">
                <svg viewBox="0 0 1000 600" className="w-full h-full">
                  <defs>
                    <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="55%" stopColor="#14b8a6" />
                      <stop offset="100%" stopColor="#d946ef" />
                    </linearGradient>

                    <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="10" result="blur" />
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
                    stroke="rgba(148,163,184,0.18)"
                    strokeWidth="90"
                    strokeLinecap="round"
                  />

                  {/* Progress */}
                  <path
                    d="M 150 450 A 350 350 0 0 1 850 450"
                    fill="none"
                    stroke={`url(#${gradId})`}
                    strokeWidth="90"
                    strokeLinecap="round"
                    pathLength={100}
                    strokeDasharray={100}
                    strokeDashoffset={100 - pct}
                    filter={`url(#${glowId})`}
                  />
                </svg>

                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-10">
                  <div className="text-5xl sm:text-6xl lg:text-7xl font-black bg-gradient-to-br from-cyan-400 via-teal-300 to-fuchsia-400 bg-clip-text text-transparent">
                    {avg || "--"}
                  </div>
                  <div className="mt-2 text-xs sm:text-sm text-slate-400">3-bureau average score</div>
                  <div className="mt-3 text-[11px] sm:text-xs text-slate-500">
                    Latest available snapshot • Scores update as data refreshes
                  </div>
                </div>
              </div>

              {/* Next Action card */}
              <div className="mt-6 mx-auto max-w-xl">
                <div className="rounded-2xl border border-slate-800/60 bg-black/30 p-4 md:p-5 text-left">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-black text-slate-200">Next Action</div>
                    <span className={`rounded-full border px-3 py-1 text-[11px] font-bold ${toneClasses(status.tone)}`}>
                      {hasSnapshot ? "READY" : "LOCKED"}
                    </span>
                  </div>

                  <div className="mt-2 text-sm text-slate-400">{nextAction}</div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <a
                      href={nextHref}
                      className="inline-flex items-center justify-center rounded-full bg-cyan-500/15 border border-cyan-400/30 px-4 py-2 text-sm font-black text-cyan-200 hover:bg-cyan-500/25 hover:border-cyan-300/60 transition"
                    >
                      {nextCta}
                    </a>

                    <a
                      href="/dashboard/monitoring"
                      className="inline-flex items-center justify-center rounded-full bg-white/5 border border-slate-700/70 px-4 py-2 text-sm font-bold text-slate-200 hover:border-slate-500/80 hover:bg-white/10 transition"
                    >
                      Monitoring →
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Bureau scores + Journey */}
            <div className="space-y-6">
              {/* Journey path */}
              <div className="rounded-2xl border border-slate-800/60 bg-black/25 p-5 md:p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg md:text-xl font-black">Your Mission Path</h2>
                  <span className="text-xs font-bold text-slate-400">Snapshot → Disputes → 700+</span>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-slate-800/70 bg-slate-950/40 p-4">
                    <div className="text-xs font-black text-slate-300">1) Snapshot</div>
                    <div className="mt-2 text-sm text-slate-400">Pull your scores & report data</div>
                    <div className="mt-3 text-xs font-bold text-slate-200">
                      Status:{" "}
                      <span className={step1 === "Ready" ? "text-cyan-300" : "text-slate-500"}>{step1}</span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-800/70 bg-slate-950/40 p-4">
                    <div className="text-xs font-black text-slate-300">2) Disputes</div>
                    <div className="mt-2 text-sm text-slate-400">Plan rounds & generate letters</div>
                    <div className="mt-3 text-xs font-bold text-slate-200">
                      Status:{" "}
                      <span className={step2 === "Ready" ? "text-purple-300" : "text-slate-500"}>{step2}</span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-800/70 bg-slate-950/40 p-4">
                    <div className="text-xs font-black text-slate-300">3) 700+ Club</div>
                    <div className="mt-2 text-sm text-slate-400">Funding roadmap unlock</div>
                    <div className="mt-3 text-xs font-bold text-slate-200">
                      Status:{" "}
                      <span className={step3 === "Unlocked" ? "text-lime-300" : "text-slate-500"}>{step3}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bureau cards */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg md:text-xl font-black">Bureau Scores</h3>
                  <span className="text-xs text-slate-500">Range: 300–850</span>
                </div>

                {scores && scores.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {scores.map((s) => {
                      const scorePct = scoreToPct(s.score);
                      return (
                        <div
                          key={s.bureau}
                          className="rounded-2xl border border-slate-800/60 bg-gradient-to-br from-slate-900/40 to-black/50 p-5 hover:border-cyan-400/30 hover:bg-black/40 transition"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="min-w-0">
                              <div className="text-sm font-black text-slate-200">{bureauName(s.bureau)}</div>
                              <div className="text-xs text-slate-500 truncate">Updated: {s.pulledAt}</div>
                            </div>
                            <div className="text-4xl font-black text-slate-100 tabular-nums">{s.score}</div>
                          </div>

                          <div className="mt-4 h-3 rounded-full bg-slate-800/70 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-teal-400 to-fuchsia-500"
                              style={{ width: `${scorePct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-slate-800/60 bg-black/25 p-6 text-center">
                    <div className="text-lg font-black text-slate-200">No Snapshot Yet</div>
                    <div className="mt-2 text-sm text-slate-400">Connect MyFreeScoreNow to pull your scores.</div>
                    <div className="mt-4">
                      <a
                        href="/go/mfsn"
                        className="inline-flex items-center justify-center rounded-full bg-cyan-500/15 border border-cyan-400/30 px-4 py-2 text-sm font-black text-cyan-200 hover:bg-cyan-500/25 hover:border-cyan-300/60 transition"
                      >
                        Connect MyFreeScoreNow →
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="rounded-3xl border border-slate-800/60 bg-black/25 p-6 md:p-10">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl md:text-3xl font-black">Quick Actions</h2>
            <span className="text-xs md:text-sm text-slate-500">Move fast. Stay consistent.</span>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <a
              href="/go/mfsn"
              className="group rounded-2xl border border-cyan-400/25 bg-gradient-to-br from-cyan-500/10 to-transparent p-6 md:p-7 hover:border-cyan-300/60 hover:shadow-[0_0_40px_rgba(6,182,212,0.25)] hover:-translate-y-1 transition"
            >
              <div className="text-cyan-200 font-black text-lg">Connect MFSN</div>
              <div className="mt-2 text-slate-400 text-sm">Pull snapshot + keep monitoring active</div>
              <div className="mt-4 text-cyan-300 text-sm font-black">Launch →</div>
            </a>

            <a
              href="/dashboard/disputes"
              className="group rounded-2xl border border-purple-400/25 bg-gradient-to-br from-purple-500/10 to-transparent p-6 md:p-7 hover:border-purple-300/60 hover:shadow-[0_0_40px_rgba(168,85,247,0.25)] hover:-translate-y-1 transition"
            >
              <div className="text-purple-200 font-black text-lg">Disputes</div>
              <div className="mt-2 text-slate-400 text-sm">Analyze items + plan rounds</div>
              <div className="mt-4 text-purple-300 text-sm font-black">Open →</div>
            </a>

            <a
              href="/dashboard/funding-path"
              className="group rounded-2xl border border-fuchsia-400/25 bg-gradient-to-br from-fuchsia-500/10 to-transparent p-6 md:p-7 hover:border-fuchsia-300/60 hover:shadow-[0_0_40px_rgba(217,70,239,0.25)] hover:-translate-y-1 transition"
            >
              <div className="text-fuchsia-200 font-black text-lg">Funding Path</div>
              <div className="mt-2 text-slate-400 text-sm">Roadmap to 700+ and beyond</div>
              <div className="mt-4 text-fuchsia-300 text-sm font-black">Enter →</div>
            </a>
          </div>
        </section>

        {/* Feature tiles (Monitoring / Disputes / Funding) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <a
            href="/dashboard/monitoring"
            className="group rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 to-slate-950/80 p-8 hover:border-cyan-300/60 hover:shadow-[0_0_50px_rgba(6,182,212,0.25)] hover:-translate-y-1 transition"
          >
            <div className="text-2xl font-black text-cyan-200">Monitoring</div>
            <div className="mt-2 text-slate-300 text-sm">Alerts, score changes, and history</div>
            <div className="mt-5 text-cyan-300 font-black text-sm">View →</div>
          </a>

          <a
            href="/dashboard/disputes"
            className="group rounded-3xl border border-purple-400/20 bg-gradient-to-br from-purple-500/10 to-slate-950/80 p-8 hover:border-purple-300/60 hover:shadow-[0_0_50px_rgba(168,85,247,0.25)] hover:-translate-y-1 transition"
          >
            <div className="text-2xl font-black text-purple-200">Disputes</div>
            <div className="mt-2 text-slate-300 text-sm">Letters, rounds, tracking, outcomes</div>
            <div className="mt-5 text-purple-300 font-black text-sm">View →</div>
          </a>

          <a
            href="/dashboard/funding-path"
            className="group rounded-3xl border border-fuchsia-400/20 bg-gradient-to-br from-fuchsia-500/10 to-slate-950/80 p-8 hover:border-fuchsia-300/60 hover:shadow-[0_0_50px_rgba(217,70,239,0.25)] hover:-translate-y-1 transition"
          >
            <div className="text-2xl font-black text-fuchsia-200">Funding</div>
            <div className="mt-2 text-slate-300 text-sm">700+ club roadmap + next steps</div>
            <div className="mt-5 text-fuchsia-300 font-black text-sm">View →</div>
          </a>
        </section>

        {/* Compliance / trust footer (keeps it legit without killing vibe) */}
        <section className="rounded-3xl border border-slate-800/60 bg-black/25 p-6 md:p-8">
          <div className="text-sm text-slate-300 font-black">Heads up (quick & real)</div>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li>• 3B Credit Builder provides educational tools and automation support. Results vary by individual profile and reporting.</li>
            <li>• You control what actions you take and what letters get generated/sent.</li>
            <li>• Scores shown reflect the latest available snapshot from your connected data source.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
