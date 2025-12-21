// app/page.tsx
const mfsnSnapshotUrl =
  "https://myfreescorenow.com/en/creditsnapshot/user/register/6153?source=default";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800/50 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            {/* Prefer local asset later: /brand/3B_Credit_Logo.png */}
            <img
              src="https://drive.google.com/uc?export=view&id=1kHYVl3q570j4gFBnHBza_i4s6rxsS7yg"
              alt="3B Credit Builder"
              className="h-11 sm:h-14 w-auto hover:scale-105 transition-transform"
            />
            <div className="hidden md:block leading-tight">
              <div className="text-sm font-extrabold tracking-wide text-white">
                3B Credit Builder
              </div>
              <div className="text-xs text-slate-400">
                Neon tools to level up your credit
              </div>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-8">
            <a
              href="#pricing"
              className="text-sm font-semibold text-slate-300 hover:text-cyan-400 transition"
            >
              Pricing
            </a>
            <a
              href="#comparison"
              className="text-sm font-semibold text-slate-300 hover:text-cyan-400 transition"
            >
              Why 3B?
            </a>
            <a
              href="/dashboard"
              className="rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-7 py-3 text-sm font-black text-black shadow-lg hover:scale-105 transition-all"
            >
              Dashboard
            </a>
          </nav>

          {/* Mobile CTA only */}
          <div className="sm:hidden">
            <a
              href={mfsnSnapshotUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 px-4 py-2 text-xs font-black text-black shadow-lg"
            >
              Start Snapshot
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-28 md:py-40">
        {/* Glow blobs (scaled down on mobile) */}
        <div className="pointer-events-none absolute -top-20 left-0 h-[420px] w-[420px] sm:h-[700px] sm:w-[700px] bg-cyan-500/25 rounded-full blur-[140px] animate-pulse" />
        <div
          className="pointer-events-none absolute top-56 right-0 h-[480px] w-[480px] sm:h-[800px] sm:w-[800px] bg-fuchsia-500/25 rounded-full blur-[150px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-5xl mx-auto space-y-10 sm:space-y-12">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 rounded-full border border-fuchsia-400/50 bg-fuchsia-500/15 px-5 sm:px-7 py-2.5 sm:py-3 shadow-lg backdrop-blur-sm">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
                <span className="relative rounded-full h-3 w-3 bg-fuchsia-400"></span>
              </span>
              <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-fuchsia-200">
                Founding Tester Access
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.03]">
              <span className="text-white">Build Credit</span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                The Smart Way
              </span>
            </h1>

            {/* Subhead */}
            <p className="text-lg sm:text-2xl md:text-3xl text-slate-300 leading-relaxed max-w-4xl mx-auto">
              See all{" "}
              <span className="font-black text-cyan-300">three bureau scores</span>{" "}
              and get a game plan—starting with a{" "}
              <span className="font-black bg-gradient-to-r from-cyan-300 to-cyan-200 bg-clip-text text-transparent">
                FREE Snapshot
              </span>
              .
            </p>

            {/* CTA row */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center pt-2 sm:pt-8">
              <a
                href={mfsnSnapshotUrl}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 px-8 sm:px-14 py-5 sm:py-7 text-base sm:text-xl font-black text-black shadow-2xl hover:scale-[1.02] sm:hover:scale-105 transition-all"
              >
                Start Free Snapshot
                <svg
                  className="ml-3 h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-2 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </a>

              <a
                href="#pricing"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-700 bg-slate-900/60 px-8 sm:px-14 py-5 sm:py-7 text-base sm:text-xl font-bold hover:border-cyan-500/60 hover:scale-[1.02] sm:hover:scale-105 transition-all"
              >
                View Plans
              </a>
            </div>

            {/* Trust line */}
            <div className="text-xs sm:text-sm text-slate-400">
              Monitoring provided by MyFreeScoreNow. 3B provides analysis & workflow tools. Results vary.
            </div>
          </div>

          {/* Feature cards */}
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mt-14 sm:mt-24 max-w-6xl mx-auto">
            <div className="group rounded-3xl border border-cyan-800/50 bg-gradient-to-br from-cyan-500/10 to-slate-900/90 p-8 sm:p-10 hover:border-cyan-400 hover:shadow-[0_0_40px_rgba(6,182,212,0.45)] hover:scale-[1.02] sm:hover:scale-105 transition-all duration-500">
              <h3 className="text-2xl sm:text-3xl font-black text-cyan-300 mb-2 sm:mb-3">
                Monitoring
              </h3>
              <p className="text-slate-300 text-base sm:text-lg">
                Track all three bureaus
              </p>
            </div>

            <div className="group rounded-3xl border border-purple-800/50 bg-gradient-to-br from-purple-500/10 to-slate-900/90 p-8 sm:p-10 hover:border-purple-400 hover:shadow-[0_0_40px_rgba(168,85,247,0.45)] hover:scale-[1.02] sm:hover:scale-105 transition-all duration-500">
              <h3 className="text-2xl sm:text-3xl font-black text-purple-300 mb-2 sm:mb-3">
                Disputes
              </h3>
              <p className="text-slate-300 text-base sm:text-lg">
                AI-assisted letters
              </p>
            </div>

            <div className="group rounded-3xl border border-fuchsia-800/50 bg-gradient-to-br from-fuchsia-500/10 to-slate-900/90 p-8 sm:p-10 hover:border-fuchsia-400 hover:shadow-[0_0_40px_rgba(217,70,239,0.45)] hover:scale-[1.02] sm:hover:scale-105 transition-all duration-500">
              <h3 className="text-2xl sm:text-3xl font-black text-fuchsia-300 mb-2 sm:mb-3">
                Funding
              </h3>
              <p className="text-slate-300 text-base sm:text-lg">
                Roadmap to approval
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 sm:py-24 border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-4xl sm:text-5xl font-black mb-3 sm:mb-4">
              Choose Your Plan
            </h2>
            <p className="text-base sm:text-lg text-slate-300">
              MFSN required at{" "}
              <span className="text-cyan-300 font-black">$29.95/mo</span>
            </p>
          </div>

          {/* Mobile cards */}
          <div className="grid gap-4 sm:hidden">
            {[
              {
                name: "Basic",
                desc: "View only",
                totalPromo: "$29.95",
                totalAfter: "$29.95",
                accent: "border-slate-800",
              },
              {
                name: "Analyzer",
                desc: "$49 one-time",
                totalPromo: "$29.95 + $49",
                totalAfter: "$29.95",
                accent: "border-slate-800",
              },
              {
                name: "Welcome",
                desc: "Disputes + tools",
                totalPromo: "$69.90",
                totalAfter: "$79.90",
                accent: "border-cyan-500/60",
              },
              {
                name: "Ultimate",
                desc: "Coaching + funding",
                totalPromo: "$84.90",
                totalAfter: "$99.90",
                accent: "border-fuchsia-500/60",
              },
            ].map((p) => (
              <div
                key={p.name}
                className={`rounded-2xl border ${p.accent} bg-slate-900/40 p-5`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-lg font-black">{p.name}</div>
                    <div className="text-xs text-slate-400">{p.desc}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Promo</div>
                    <div className="text-lg font-black">{p.totalPromo}</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm text-slate-300">
                  <span>After</span>
                  <span className="font-bold">{p.totalAfter}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/25 shadow-xl">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-900 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 text-left font-bold">Plan</th>
                  <th className="px-6 py-4 text-left font-bold">MFSN</th>
                  <th className="px-6 py-4 text-left font-bold">3B</th>
                  <th className="px-6 py-4 text-left font-bold">Credit</th>
                  <th className="px-6 py-4 text-left font-bold">Total (Promo)</th>
                  <th className="px-6 py-4 text-left font-bold">Total (After)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr className="hover:bg-slate-800/40 bg-gradient-to-r from-slate-900/30 to-transparent transition-all">
                  <td className="px-6 py-5">
                    <div className="font-bold">Basic</div>
                    <div className="text-xs text-slate-400">View only</div>
                  </td>
                  <td className="px-6 py-5">$29.95</td>
                  <td className="px-6 py-5">$0</td>
                  <td className="px-6 py-5">-</td>
                  <td className="px-6 py-5 font-black text-slate-200 text-lg">$29.95</td>
                  <td className="px-6 py-5 font-black text-lg">$29.95</td>
                </tr>

                <tr className="hover:bg-slate-800/50 bg-gradient-to-r from-slate-800/40 to-transparent transition-all">
                  <td className="px-6 py-5">
                    <div className="font-bold">Analyzer</div>
                    <div className="text-xs text-slate-400">$49 one-time</div>
                  </td>
                  <td className="px-6 py-5">$29.95</td>
                  <td className="px-6 py-5">$0</td>
                  <td className="px-6 py-5">-</td>
                  <td className="px-6 py-5 font-black text-slate-200 text-lg">$29.95 + $49</td>
                  <td className="px-6 py-5 font-black text-lg">$29.95</td>
                </tr>

                <tr className="hover:bg-cyan-900/20 bg-gradient-to-r from-cyan-900/10 to-transparent border-l-4 border-cyan-500 transition-all">
                  <td className="px-6 py-5">
                    <div className="font-bold text-cyan-300">Welcome</div>
                    <div className="text-xs text-slate-400">Disputes + tools</div>
                  </td>
                  <td className="px-6 py-5">$29.95</td>
                  <td className="px-6 py-5">$49.95</td>
                  <td className="px-6 py-5 text-cyan-300 font-bold">-$10/mo</td>
                  <td className="px-6 py-5 font-black text-cyan-300 text-lg">$69.90</td>
                  <td className="px-6 py-5 font-black text-lg">$79.90</td>
                </tr>

                <tr className="hover:bg-fuchsia-900/20 bg-gradient-to-r from-fuchsia-900/10 via-purple-900/10 to-transparent border-l-4 border-fuchsia-500 transition-all">
                  <td className="px-6 py-5">
                    <div className="font-bold text-fuchsia-300">Ultimate</div>
                    <div className="text-xs text-slate-400">Coaching + funding</div>
                  </td>
                  <td className="px-6 py-5">$29.95</td>
                  <td className="px-6 py-5">$69.95</td>
                  <td className="px-6 py-5 text-fuchsia-300 font-bold">-$15/mo</td>
                  <td className="px-6 py-5 font-black text-fuchsia-300 text-lg">$84.90</td>
                  <td className="px-6 py-5 font-black text-lg">$99.90</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 text-xs text-slate-500">
            Results vary. We do not guarantee score increases. Monitoring is provided by MyFreeScoreNow. 3B provides analysis and workflow tools.
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section id="comparison" className="py-20 sm:py-24 bg-slate-900/25 border-t border-slate-800">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-4xl sm:text-5xl font-black mb-10 sm:mb-12 text-center">
            Why 3B Beats Typical Credit Repair
          </h2>

          <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
            {[
              {
                title: "Lower Costs",
                body: "Most charge $79–$199/mo. 3B is designed to be fair and transparent.",
              },
              {
                title: "No Setup Fees",
                body: "No $99–$299 setup. Simple entry, clear upgrades.",
              },
              {
                title: "Transparent",
                body: "MFSN shown separately. You always know what’s what.",
              },
              {
                title: "Funding Focus",
                body: "Not just disputes — a roadmap that supports approvals.",
              },
            ].map((i) => (
              <div
                key={i.title}
                className="flex gap-4 p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/45 hover:border-cyan-500/60 hover:shadow-[0_0_25px_rgba(6,182,212,0.25)] hover:scale-[1.01] transition-all"
              >
                <div className="text-cyan-300 text-2xl sm:text-3xl font-black">
                  ✓
                </div>
                <div>
                  <h3 className="font-black text-lg mb-2">{i.title}</h3>
                  <p className="text-sm text-slate-400">{i.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 bg-black">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-slate-400">
          <p>
            3B Credit Builder • Powered by MyFreeScoreNow • Monitoring • Disputes • Funding
          </p>
        </div>
      </footer>
    </div>
  );
}
