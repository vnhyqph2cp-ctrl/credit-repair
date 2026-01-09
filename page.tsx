"use client";
import { CreditGauge } from "@/components/ui/CreditGauge";



export default function HomePage() {
  return (
    <main className="landing-page min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="landing-backdrop">
        <div className="gradient-orb orb-1" />
        <div className="gradient-orb orb-2" />
        <div className="gradient-orb orb-3" />
      </div>

      {/* Top Navigation */}
      <header className="relative z-10 w-full px-6 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <div className="font-bold text-lg tracking-wide">
          3B Credit Builder
        </div>

        <nav className="flex items-center gap-6 text-sm">
          <a href="/about" className="hover:underline">About</a>
          <a href="/pricing" className="hover:underline">Pricing</a>
          <a
            href="/dashboard/mfsn/verify-pending"
            className="hover:underline"
          >
            MFSN Login
          </a>
          <a
            href="/login"
            className="btn glow-soft px-4 py-2"
          >
            3B Login
          </a>
        </nav>
      </header>

      {/* Main Content */}
      <section className="relative z-10 landing-content">
        {/* Hero */}
        <div className="landing-center landing-header">
          <h1 className="landing-headline">
            Build Credit With Structure — Not Guesswork
          </h1>

          <p className="landing-subhead">
            Monitoring • Disputes • Funding  
            <br />
            A system designed to enforce accuracy and progress.
          </p>
        </div>

        {/* Primary Actions */}
        <div className="feature-grid max-w-5xl w-full">
          {/* Snapshot Lead */}
          <a
            href="/snapshot"
            className="feature-tile btn-snapshot"
          >
            <div className="tile-icon icon-purple">📊</div>
            <h3 className="tile-title">Free Credit Snapshot</h3>
            <p className="tile-description">
              Pull your snapshot and see where you actually stand.
              No signup required.
            </p>
          </a>

          {/* 3B Login */}
          <a
            href="/login"
            className="feature-tile btn-login"
          >
            <div className="tile-icon icon-green">🔐</div>
            <h3 className="tile-title">3B Member Login</h3>
            <p className="tile-description">
              Access your dashboard, disputes, and funding tools.
            </p>
          </a>

          {/* MFSN */}
          <a
            href="/dashboard/mfsn/verify-pending"
            className="feature-tile btn-mfsn"
          >
            <div className="tile-icon icon-blue">🧾</div>
            <h3 className="tile-title">MFSN Returning Users</h3>
            <p className="tile-description">
              Resume monitoring through MyFreeScoreNow.
            </p>
          </a>
        </div>

        {/* Trust Footer */}
        <div className="text-center text-sm text-muted mt-8">
          Built for clarity, compliance, and long-term credit power.
        </div>
      </section>
    </main>
  );
}
