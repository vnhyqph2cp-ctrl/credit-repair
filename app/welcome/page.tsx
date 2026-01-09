// app/welcome/page.tsx
import Link from "next/link";
<Link
  href="/"
  className="inline-flex items-center gap-2 text-sm opacity-70 hover:opacity-100 mb-6"
>
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m15 18-6-6 6-6" />
  </svg>
  Back to Home
</Link>

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-[#070A12] text-slate-50 flex items-center justify-center p-6">
      <div className="max-w-2xl text-center">
        <section className="surface-card glow-soft">
          <div
            style={{
              display: "inline-flex",
              padding: "6px 14px",
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: 1,
              background: "rgba(34,197,94,0.15)",
              color: "#4ade80",
              marginBottom: 16,
            }}
          >
            Welcome to 3B
          </div>

          <h1 className="landing-headline" style={{ fontSize: "2.4rem", marginBottom: 12 }}>
            Welcome to 3B Credit Builder
          </h1>

          <p style={{ fontSize: 16, opacity: 0.85, marginBottom: 20 }}>
            This platform helps you understand, organize, and improve your
            credit using clear steps—not guesswork.
          </p>

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: "0 0 24px 0",
              fontSize: 15,
              opacity: 0.9,
              textAlign: "left",
              display: "inline-block",
            }}
          >
            <li style={{ marginBottom: 8 }}>✔ Review your credit snapshot</li>
            <li style={{ marginBottom: 8 }}>✔ Understand what matters most</li>
            <li style={{ marginBottom: 8 }}>✔ Follow a personalized action plan</li>
          </ul>

          <Link href="/dashboard" className="btn btn-large glow-neon">
            Go to Dashboard
          </Link>
        </section>
      </div>
    </main>
  );
}
