import Link from "next/link";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AnalyzerPage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  // ─────────────────────────────────────────────
  // AUTH: Must be logged in via MFSN
  // ─────────────────────────────────────────────
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login"); // MFSN login ONLY
  }

  // ─────────────────────────────────────────────
  // CHECK: Does user have Analyzer access?
  // (you can later swap this to a subscriptions table)
  // ─────────────────────────────────────────────
  const { data: analyzerAccess } = await supabase
    .from("plans")
    .select("id")
    .eq("user_id", user.id)
    .eq("product", "3b_analyzer")
    .maybeSingle();

  if (!analyzerAccess) {
    return (
      <main className="analyzer-page">
        <div className="analyzer-hero">
          <h1 className="analyzer-title">Unlock 3B Analyzer</h1>
          <p className="analyzer-subtitle">
            The Analyzer reviews your full 3-bureau report and generates
            disputes, violations, and a step-by-step action plan.
          </p>

          <Link
            href="/pricing/analyzer"
            className="btn-analyzer btn-primary"
          >
            Unlock Analyzer
          </Link>

          <p className="text-muted-sm">
            Requires active MFSN account
          </p>
        </div>
      </main>
    );
  }

  // ─────────────────────────────────────────────
  // DATA: Pull Epic Report (legacy Snapshot table)
  // ─────────────────────────────────────────────
  const { data: snapshot } = await supabase
    .from("Snapshot")
    .select("status, scoreEQ, scoreEX, scoreTU")
    .eq("customerId", user.id)
    .order("createdAt", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!snapshot || snapshot.status !== "ready") {
    return (
      <main className="analyzer-page">
        <div className="analyzer-hero">
          <h1 className="analyzer-title">Preparing Your Report</h1>
          <p className="analyzer-subtitle">
            Your credit data is syncing. This usually takes a few minutes.
          </p>
          <p className="text-muted-sm">
            We’ll unlock analysis automatically.
          </p>
        </div>
      </main>
    );
  }

  const avgScore = Math.round(
    ((snapshot.scoreEQ || 0) +
      (snapshot.scoreEX || 0) +
      (snapshot.scoreTU || 0)) / 3
  );

  // ─────────────────────────────────────────────
  // ANALYZER DASHBOARD
  // ─────────────────────────────────────────────
  return (
    <main className="analyzer-page">
      <header className="analyzer-header">
        <h1>3B Credit Analyzer</h1>
        <p>AI-driven review of your 3-bureau credit file</p>
      </header>

      <section className="score-summary">
        <div className="score">{avgScore}</div>
        <span>Average Bureau Score</span>
      </section>

      <section className="analyzer-actions">
        <Link
          href="/dashboard/analyzer/run"
          className="btn-analyzer btn-primary"
        >
          Run AI Analysis
        </Link>

        <Link
          href="/dashboard/action-plan"
          className="btn-analyzer btn-secondary"
        >
          View Action Plan
        </Link>
      </section>
    </main>
  );
}
