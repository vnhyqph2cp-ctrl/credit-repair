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

            <div className="space-y-6">
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

              {/* Snapshot + Dashboard CTAs */}
              <section className="credit-cta space-y-3">
                <h2 className="text-xl font-semibold">
                  Start with a FREE 3‑bureau Snapshot
                </h2>
                <p className="text-sm sm:text-base text-white/80">
                  See your TransUnion, Equifax, and Experian scores and get a
                  simple next‑step game plan.
                </p>

                <a
                  href="https://myfreescorenow.com/en/creditsnapshot/user/register/6153?source=default"
                  className="block w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-center text-white font-semibold"
                >
                  Start Free Snapshot →
                </a>

                <p className="text-xs text-white/60 text-center">
                  Takes less than 2 minutes. No impact to credit scores.
                </p>

                <div className="pt-2 text-center space-y-2">
                  <p className="text-sm text-white/70">
                    <strong>Already enrolled?</strong>
                  </p>
                  <a
                    href="https://credit.bouncebackbrian.com/dashboard"
                    className="inline-block px-4 py-2 rounded-lg border border-white/30 text-sm font-semibold text-white hover:bg-white/10"
                  >
                    Go to 3B Dashboard →
                  </a>
                </div>
              </section>
            </div>
          </div>

          {/* Right side placeholder / illustration */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
            <div className="h-64 w-full rounded-xl bg-gradient-to-br from-slate-800 via-slate-900 to-black flex items-center justify-center text-white/60 text-sm">
              Dashboard preview coming soon
            </div>
          </div>
        </section>

        {/* After Snapshot section */}
        <section className="mt-16 after-snapshot space-y-4">
          <h3 className="text-xl font-semibold">
            After your Snapshot (Where the 3B magic happens)
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-sm sm:text-base text-white/80">
            <li>
              <strong>Log in to MyFreeScoreNow</strong> to view your full
              3‑bureau scores and reports.
            </li>
            <li>
              <strong>Go to your 3B Dashboard</strong> at{" "}
              <a
                href="https://credit.bouncebackbrian.com/dashboard"
                className="underline text-[#00D9FF]"
              >
                credit.bouncebackbrian.com/dashboard
              </a>
              .
            </li>
            <li>
              <strong>3B builds your Credit Game Plan</strong> from your
              snapshot: what’s hurting your score most and your next 3 moves to
              bounce back.
            </li>
          </ol>
        </section>
      </div>
    </main>
  );
}

