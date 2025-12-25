// app/page.tsx
import React from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-4 py-16">
        {/* Hero section */}
        <section className="grid gap-12 md:grid-cols-2 items-center">
          <div className="space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              3B Credit Builder
            </h1>
            <p className="text-base sm:text-lg text-white/80">
              Launch clients into a structured, automated credit‑building
              program connected to your 3B ecosystem, payments, and fleet of
              financial tools.
            </p>

            <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/60 p-5">
              <h2 className="text-lg font-semibold text-white">
                What you get today
              </h2>
              <ul className="space-y-3 text-sm sm:text-base">
                <li className="flex items-start gap-3 text-white/90">
                  <span className="text-[#00D9FF] text-xl">✓</span>
                  <span>Interactive dashboard with progress tracking</span>
                </li>
                <li className="flex items-start gap-3 text-white/90">
                  <span className="text-[#00D9FF] text-xl">✓</span>
                  <span>Automated rounds, plans, and letter workflows</span>
                </li>
                <li className="flex items-start gap-3 text-white/90">
                  <span className="text-[#00D9FF] text-xl">✓</span>
                  <span>Dashboard tools unlocked</span>
                </li>
                <li className="flex items-start gap-3 text-white/90">
                  <span className="text-[#00D9FF] text-xl">✓</span>
                  <span>Cancel anytime before trial ends</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <a
                href="https://myfreescorenow.com/en/creditsnapshot/user/register/6153?source=default"
                className="block w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-center text-white font-semibold"
              >
                Start Your Free Credit Snapshot
              </a>
              <p className="text-xs text-white/60 text-center">
                Takes less than 2 minutes. No impact to credit scores.
              </p>
            </div>
          </div>

          {/* Right side placeholder / illustration */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
            <div className="h-64 w-full rounded-xl bg-gradient-to-br from-slate-800 via-slate-900 to-black flex items-center justify-center text-white/60 text-sm">
              Dashboard preview coming soon
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
