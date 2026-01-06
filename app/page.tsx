import Link from "next/link";
import { CreditGauge } from "@/components/ui/CreditGauge";

export default function HomePage() {
  return (
    <main className="relative overflow-hidden">

      {/* Floating Orbs */}
      <div className="gradient-orb orb-1 delay-1" />
      <div className="gradient-orb orb-2 delay-2" />
      <div className="gradient-orb orb-3 delay-3" />

      {/* HERO */}
      <section className="landing-center py-32 relative z-10">
        <header className="landing-header">
          <h1 className="landing-headline">
            Build Real Credit — Backed by Systems, Not Guesswork
          </h1>
          <p className="landing-subhead">
            3B Credit Builder enforces accurate reporting using automation,
            timelines, and compliance — not generic disputes.
          </p>
        </header>

        {/* CTAs */}
        <div className="landing-cta-row flex">
          <Link href="/snapshot" className="btn btn-large glow-neon btn-3d">
            Start Free Snapshot
          </Link>
          <Link href="/login" className="btn btn-large glow-soft btn-3d">
            Returning Member Login
          </Link>
        </div>
      </section>

      {/* VISUAL PROOF */}
      <section className="flex justify-center py-24 relative z-10">
        <CreditGauge value={742} label="System Credit Score" />
      </section>

      {/* PATH SELECTION */}
      <section className="landing-features flex py-24 relative z-10">
        <Link href="/snapshot" className="feature-card tile-3d surface-teal p-6 rounded-xl">
          <div className="feature-icon">📊</div>
          <strong>Free Snapshot</strong>
          <span className="opacity-80 text-sm">
            See what the system sees
          </span>
        </Link>

        <Link href="/signup" className="feature-card tile-3d p-6 rounded-xl">
          <div className="feature-icon">🚀</div>
          <strong>Join 3B Credit Builder</strong>
          <span className="opacity-80 text-sm">
            Full automation + enforcement
          </span>
        </Link>

        <Link href="/pricing" className="feature-card tile-3d p-6 rounded-xl">
          <div className="feature-icon">💳</div>
          <strong>Pricing</strong>
          <span className="opacity-80 text-sm">
            Simple. Transparent.
          </span>
        </Link>

        <Link href="/about" className="feature-card tile-3d p-6 rounded-xl">
          <div className="feature-icon">🧠</div>
          <strong>About 3B</strong>
          <span className="opacity-80 text-sm">
            Why this system exists
          </span>
        </Link>
      </section>

      {/* FINAL CTA */}
      <section className="text-center py-32 relative z-10">
        <h2 className="text-3xl font-bold mb-4">
          Start with the Snapshot. Let the system do the work.
        </h2>
        <Link href="/snapshot" className="btn btn-large glow-neon btn-3d">
          Get Started Free
        </Link>
      </section>

    </main>
  );
}
