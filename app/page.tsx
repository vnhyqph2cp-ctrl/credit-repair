import Link from "next/link";
import { CreditGauge } from "@/components/ui/CreditGauge";

export default function HomePage() {
  return (
    <main className="relative overflow-hidden">

      {/* BACKGROUND ORBS */}
      <div className="gradient-orb orb-1 delay-1" />
      <div className="gradient-orb orb-2 delay-2" />
      <div className="gradient-orb orb-3 delay-3" />

      {/* HERO */}
      <section className="landing-center py-28 relative z-10">
        <header className="landing-header">
          <h1 className="landing-headline">
            Build Real Credit — Backed by Systems, Not Guesswork
          </h1>

          <p className="landing-subhead">
            3B Credit Builder enforces accurate reporting using automation,
            timelines, and compliance — not generic disputes. A system that
            identifies errors, enforces compliance, and executes the next move
            automatically.
          </p>
        </header>

        {/* CTA ROW */}
        <div className="landing-cta-row mt-10">
          <Link href="/snapshot" className="btn btn-large glow-neon btn-3d">
            Start Free Snapshot
          </Link>

          <Link href="/login" className="btn btn-large glow-soft btn-3d">
            Returning Member Login
          </Link>
        </div>

        {/* PROOF */}
        <div className="mt-16 flex flex-col items-center gap-3">
          <CreditGauge value={742} label="3B System Score" />
          <div className="text-sm opacity-70 text-center">
            Clean inputs. Clear plan. Repeatable execution.
          </div>
        </div>

        {/* FEATURES */}
        <div className="landing-features mt-20">
          <Link href="/snapshot" className="feature-card surface-teal">
            <div className="feature-icon">📊</div>
            <strong>Free Snapshot</strong>
            <span className="opacity-80 text-sm">
              See what the system sees
            </span>
          </Link>

          <Link href="/signup" className="feature-card">
            <div className="feature-icon">🚀</div>
            <strong>Join 3B Credit Builder</strong>
            <span className="opacity-80 text-sm">
              Automation + enforcement
            </span>
          </Link>

          <Link href="/pricing" className="feature-card">
            <div className="feature-icon">💳</div>
            <strong>Pricing</strong>
            <span className="opacity-80 text-sm">
              Simple & transparent
            </span>
          </Link>

          <Link href="/about" className="feature-card">
            <div className="feature-icon">🧠</div>
            <strong>About 3B</strong>
            <span className="opacity-80 text-sm">
              Why this system exists
            </span>
          </Link>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final-cta text-center py-24 relative z-10 px-5">
        <h2 className="text-3xl font-bold mb-4">
          Start with the Snapshot. Let the system do the work.
        </h2>

        <p className="opacity-70 max-w-2xl mx-auto mb-8">
          You’ll get clarity fast: what’s hurting you, what’s disputable,
          and what the next move is — without guessing.
        </p>

        <Link href="/snapshot" className="btn btn-large glow-neon btn-3d">
          Get Started Free
        </Link>
      </section>
    </main>
  );
}
