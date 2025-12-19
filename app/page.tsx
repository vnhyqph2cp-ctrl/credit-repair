// app/page.tsx

import Image from "next/image";

const mfsnSnapshotUrl =
  "https://myfreescorenow.com/en/creditsnapshot/user/register/6153?source=default";
const mfsnFundingSnapshotUrl =
  "https://myfreescorenow.com/En/fundingSnapshot/User/Register/6153";
const mfsnMonitoringUrl =
  "https://myfreescorenow.com/enroll/?AID=BounceBackCreditRepair&PID=57790";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-slate-800 bg-slate-950">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center gap-3">
          <Image
            src="/3b-credit-logo@2x.png"
            alt="3B Credit Builder"
            width={140}
            height={48}
            className="h-8 w-auto"
            priority
          />
        </div>
        <nav className="flex-1 px-4 py-4 text-xs space-y-1">
          <p className="text-slate-400 mb-2 uppercase tracking-[0.18em]">
            3B credit builder
          </p>
          <button className="w-full text-left rounded-md bg-slate-900/80 px-3 py-2 text-slate-100">
            Snapshot & onboarding
          </button>
          <button className="w-full text-left rounded-md px-3 py-2 text-slate-400 hover:bg-slate-900/60">
            Monitoring & alerts
          </button>
          <button className="w-full text-left rounded-md px-3 py-2 text-slate-400 hover:bg-slate-900/60">
            Disputes & letters
          </button>
          <button className="w-full text-left rounded-md px-3 py-2 text-slate-400 hover:bg-slate-900/60">
            Funding roadmap
          </button>
        </nav>
        <div className="px-4 py-4 border-t border-slate-800 text-[11px] text-slate-500">
          <p className="font-semibold text-slate-300 mb-1">Tester build</p>
          <p>V0.1 • Layout only • For internal preview.</p>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="border-b border-slate-800 px-6 py-3 flex items-center justify-between bg-gradient-to-r from-cyan-500/10 via-emerald-500/10 to-fuchsia-500/10 backdrop-blur">
          <div className="flex items-center gap-3 md:hidden">
            <Image
              src="/3b-credit-logo@2x.png"
              alt="3B Credit Builder"
              width={120}
              height={40}
              className="h-7 w-auto"
              priority
            />
          </div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-emerald-300 hidden md:block">
            Snapshot • Monitoring • Funding
          </p>
          <a
            href="/dashboard"
            className="rounded-full border border-slate-600 px-4 py-1 text-[11px] font-medium hover:bg-slate-900/70 transition"
          >
            Go to 3B dashboard
          </a>
        </header>

        {/* Content */}
        <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10 lg:flex-row lg:items-start">
          {/* Left section */}
          <section className="flex-1 space-y-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-fuchsia-400">
              Founding Tester Access
            </p>

            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              Start your <span className="text-emerald-300">3B Credit Builder</span>{" "}
              with a FREE Snapshot.
            </h1>

            <p className="max-w-xl text-sm text-slate-300">
              Connect to MyFreeScoreNow, see all three scores, and get a simple
              3‑step game plan for disputes, rebuilding, and funding. This page is
              only for our first 5 testers, so your feedback will shape the final
              version.
            </p>

            {/* CTAs */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href={mfsnSnapshotUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-8 py-3 text-base font-bold text-black shadow-lg hover:bg-emerald-300 hover:shadow-xl transition"
              >
                Start MyFreeScoreNow Snapshot
              </a>
              <div className="flex flex-col gap-2 sm:flex-row">
                <a
                  href={mfsnMonitoringUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-slate-600 bg-slate-900/70 px-6 py-2 text-xs font-semibold uppercase tracking-[0.18em] hover:bg-slate-800"
                >
                  Upgrade to full 3B monitoring
                </a>
                <a
                  href="/dashboard"
                  className="rounded-full border border-slate-700 px-6 py-2 text-xs font-semibold uppercase tracking-[0.18em] hover:bg-slate-900"
                >
                  Open my 3B dashboard
                </a>
              </div>
            </div>

            {/* Funding teaser */}
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-[12px] text-slate-200">
              <p className="font-semibold text-emerald-300 mb-1">
                Already around 680+ and focused on funding?
              </p>
              <p className="mb-1">
                Once your Snapshot is done, you can also run a Funding Snapshot to
                estimate potential approval ranges.
              </p>
              <a
                href={mfsnFundingSnapshotUrl}
                target="_blank"
                rel="noreferrer"
                className="text-cyan-300 underline hover:text-emerald-300"
              >
                Run Funding Snapshot (optional)
              </a>
            </div>

            {/* Bullets */}
            <div className="mt-5 grid gap-3 text-xs text-slate-300 sm:grid-cols-3">
              <div className="rounded-md border border-slate-800 bg-slate-900/50 p-3">
                <p className="font-semibold text-slate-100 mb-1">Snapshot</p>
                <p>Secure 3‑bureau pull through MyFreeScoreNow.</p>
              </div>
              <div className="rounded-md border border-slate-800 bg-slate-900/50 p-3">
                <p className="font-semibold text-slate-100 mb-1">Plan</p>
                <p>We map disputes and builder moves for you.</p>
              </div>
              <div className="rounded-md border border-slate-800 bg-slate-900/50 p-3">
                <p className="font-semibold text-slate-100 mb-1">Funding</p>
                <p>Track progress to funding‑ready 3B scores.</p>
              </div>
            </div>
          </section>

          {/* Right section */}
          <section className="flex-1">
            <div className="mx-auto max-w-md rounded-2xl border border-slate-800 bg-slate-950/80 p-5 shadow-[0_0_40px_rgba(15,23,42,0.9)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400 mb-3">
                Sample 3B dashboard preview
              </p>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-slate-400">Current 3B average</p>
                  <p className="text-3xl font-semibold text-emerald-300">682</p>
                  <p className="text-[11px] text-emerald-400 mt-1">
                    +24 points in last 30 days
                  </p>
                </div>
                <div className="h-14 w-14 rounded-full border border-slate-700 flex items-center justify-center">
                  <div className="h-10 w-10 rounded-full border-4 border-emerald-400 border-t-fuchsia-400 border-l-amber-400" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-200">
                <div className="rounded-md bg-slate-900/70 p-2">
                  <p className="font-semibold text-emerald-300 mb-1">Monitoring</p>
                  <p>Score changes & alerts.</p>
                </div>
                <div className="rounded-md bg-slate-900/70 p-2">
                  <p className="font-semibold text-cyan-300 mb-1">Disputes</p>
                  <p>Negative items flagged.</p>
                </div>
                <div className="rounded-md bg-slate-900/70 p-2">
                  <p className="font-semibold text-fuchsia-300 mb-1">Funding</p>
                  <p>Steps to approval.</p>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800 bg-black/60 px-6 py-4">
          <div className="mx-auto flex max-w-4xl flex-wrap gap-4 text-[11px] text-slate-400">
            <span className="font-semibold text-slate-200">3B Credit Builder</span>
            <span>Powered by MyFreeScoreNow Snapshot & Monitoring</span>
            <span>Monitoring · Disputes · Funding</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
