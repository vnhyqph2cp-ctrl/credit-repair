import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-[#070A12] text-slate-50">
      <div
        className="landing-center"
        style={{ textAlign: "left", paddingTop: 64, paddingBottom: 64 }}
      >
        {/* Header */}
        <header style={{ marginBottom: 32 }}>
          <p
            style={{
              fontSize: 12,
              letterSpacing: 2,
              textTransform: "uppercase",
              opacity: 0.7,
              marginBottom: 6,
            }}
          >
            Get started
          </p>
          <h1 className="landing-headline" style={{ fontSize: "2.6rem" }}>
            Join 3B Credit Builder
          </h1>
          <p
            className="landing-subhead"
            style={{ margin: "8px 0 0 0", maxWidth: 520 }}
          >
            Choose a plan, unlock the full system, and start executing your
            credit strategy.
          </p>
        </header>

        {/* Plan Cards */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div className="surface-card">
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
              Basic
            </h2>
            <p style={{ fontSize: 13, opacity: 0.8, marginBottom: 14 }}>
              Core tools + tracking
            </p>
            <button className="btn btn-large glow-soft w-full">Select</button>
          </div>

          <div
            className="surface-card glow-soft"
            style={{
              border: "1px solid rgba(45,212,191,0.5)",
            }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
              Pro
            </h2>
            <p style={{ fontSize: 13, opacity: 0.8, marginBottom: 14 }}>
              Automation + enforcement
            </p>
            <button className="btn btn-large glow-neon w-full">Select</button>
          </div>

          <div className="surface-card">
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
              Elite
            </h2>
            <p style={{ fontSize: 13, opacity: 0.8, marginBottom: 14 }}>
              Everything + priority
            </p>
            <button className="btn btn-large glow-soft w-full">Select</button>
          </div>
        </section>

        {/* Login Link */}
        <div style={{ textAlign: "center" }}>
          <Link
            href="/login"
            className="text-sm opacity-80 hover:opacity-100 underline"
          >
            Already a member? Login
          </Link>
        </div>
      </div>
    </main>
  );
}
