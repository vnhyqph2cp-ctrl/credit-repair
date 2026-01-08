import Link from "next/link";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#070A12] text-slate-50">
      <div className="landing-center" style={{ textAlign: "left", paddingTop: 48, paddingBottom: 72 }}>
        {/* Header */}
        <header style={{ marginBottom: 32 }}>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm opacity-70 hover:opacity-100 mb-4"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to Home
          </Link>

          <p
            style={{
              fontSize: 12,
              letterSpacing: 2,
              textTransform: "uppercase",
              opacity: 0.7,
              marginBottom: 6,
            }}
          >
            Simple, transparent plans
          </p>
          <h1 className="landing-headline" style={{ fontSize: "2.6rem" }}>
            Choose your 3B plan
          </h1>
          <p
            className="landing-subhead"
            style={{ margin: "8px 0 0 0", maxWidth: 520 }}
          >
            No hidden fees. Cancel anytime. Start with a free Snapshot and
            upgrade when you are ready for automation.
          </p>
        </header>

        {/* Pricing cards */}
        <section style={{ marginBottom: 40 }}>
          <div
            className="pricing-grid"
            style={{ rowGap: 24, columnGap: 24 }}
          >
            {/* Free Snapshot */}
            <div className="surface-card">
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  opacity: 0.8,
                  marginBottom: 8,
                }}
              >
                Free
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>
                Credit Snapshot
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
                $0
              </div>
              <p style={{ fontSize: 14, opacity: 0.8, marginBottom: 14 }}>
                Get started with a 3‑bureau view and basic summary.
              </p>

              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 16px 0",
                  fontSize: 13,
                  opacity: 0.9,
                }}
              >
                <li>• 3‑bureau Snapshot</li>
                <li>• Basic credit summary</li>
                <li>• Monthly updates</li>
                <li style={{ opacity: 0.5 }}>• AI Analyzer (not included)</li>
                <li style={{ opacity: 0.5 }}>• Dispute tools (not included)</li>
              </ul>

              <Link href="/register" className="btn btn-large glow-neon">
                Get started free
              </Link>
            </div>

            {/* Basic */}
            <div className="surface-card">
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  opacity: 0.8,
                  marginBottom: 8,
                }}
              >
                Basic
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>
                Credit Builder
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
                $29<span style={{ fontSize: 14 }}>/mo</span>
              </div>
              <p style={{ fontSize: 14, opacity: 0.8, marginBottom: 14 }}>
                Core tools to track and build your credit.
              </p>

              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 16px 0",
                  fontSize: 13,
                  opacity: 0.9,
                }}
              >
                <li>• Everything in Free</li>
                <li>• Weekly credit monitoring</li>
                <li>• Score tracking & trends</li>
                <li>• Progress dashboard</li>
                <li style={{ opacity: 0.5 }}>• AI Analyzer (not included)</li>
              </ul>

              <Link href="/register" className="btn btn-large glow-soft">
                Start building
              </Link>
            </div>

            {/* Analyzer – featured */}
            <div
              className="surface-card"
              style={{
                border: "1px solid rgba(45,212,191,0.7)",
                boxShadow: "0 0 30px rgba(45,212,191,0.35)",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: "#22d3ee",
                  marginBottom: 8,
                }}
              >
                Most popular
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>
                AI Analyzer
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
                $79<span style={{ fontSize: 14 }}>/mo</span>
              </div>
              <p style={{ fontSize: 14, opacity: 0.8, marginBottom: 14 }}>
                AI‑powered analysis, action plan, and dispute automation.
              </p>

              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 16px 0",
                  fontSize: 13,
                  opacity: 0.95,
                }}
              >
                <li>• Everything in Basic</li>
                <li>• AI credit Analyzer</li>
                <li>• Personalized action plan</li>
                <li>• Dispute letter generator</li>
                <li>• Priority support</li>
              </ul>

              <Link href="/register" className="btn btn-large glow-neon">
                Start optimizing
              </Link>
            </div>

            {/* Ultimate */}
            <div className="surface-card">
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: "#f472ff",
                  marginBottom: 8,
                }}
              >
                Ultimate
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>
                Full service
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
                $149<span style={{ fontSize: 14 }}>/mo</span>
              </div>
              <p style={{ fontSize: 14, opacity: 0.8, marginBottom: 14 }}>
                Done‑with‑you enforcement and funding readiness.
              </p>

              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 16px 0",
                  fontSize: 13,
                  opacity: 0.95,
                }}
              >
                <li>• Everything in Analyzer</li>
                <li>• Automated dispute rounds</li>
                <li>• Legal document library</li>
                <li>• Dedicated success manager</li>
                <li>• Funding readiness tools</li>
              </ul>

              <Link href="/register" className="btn btn-large glow-soft">
                Go Ultimate
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ / CTA */}
        <section style={{ marginTop: 8 }}>
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
              Common questions
            </h2>
            <p style={{ fontSize: 14, opacity: 0.8 }}>
              Cancel anytime. No long‑term contracts. Clear pricing from day one.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
              gap: 16,
              marginBottom: 32,
            }}
          >
            <div className="surface-card">
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>
                Can I cancel anytime?
              </h3>
              <p style={{ fontSize: 13, opacity: 0.8 }}>
                Yes. No penalties or long‑term commitments.
              </p>
            </div>
            <div className="surface-card">
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>
                Can I upgrade or downgrade?
              </h3>
              <p style={{ fontSize: 13, opacity: 0.8 }}>
                Switch plans whenever your goals change.
              </p>
            </div>
          </div>

          <div
            className="surface-card glow-soft"
            style={{ textAlign: "center" }}
          >
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
              Ready to transform your credit?
            </h2>
            <p style={{ fontSize: 14, opacity: 0.8, marginBottom: 16 }}>
              Join 3B Credit Builder and let the system do the heavy lifting.
            </p>
            <Link href="/register" className="btn btn-large glow-neon">
              Get started today
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
