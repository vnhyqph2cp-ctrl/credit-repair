import Link from "next/link";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import BadgeSection from "@/components/BadgeSection";

export default async function DashboardPage() {
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // ─────────────────────────────────────────────
  // Epic Credit Report (3-Bureau Full File)
  // NOTE: Stored in "Snapshot" table (legacy naming)
  // Contains full 3B report payload + extracted scores
  // Source: MFSN /api/auth/3B/report.json
  // ─────────────────────────────────────────────
  const { data: snapshot } = await supabase
    .from("Snapshot")
    .select("id, status")
    .eq("customerId", user.id)
    .order("createdAt", { ascending: false })
    .limit(1)
    .maybeSingle();

  const hasSnapshot = snapshot?.status === "ready";

  // Analyzer ready - using action plan resolver
  const { data: plan } = await supabase
    .rpc("resolve_dispute_profile", { p_user_id: user.id });

  const hasAnalyzer = !!plan && plan.length > 0;
  const hasActionPlan = hasAnalyzer;

  // Calculate real progress
  const progress = !hasSnapshot ? 20 : !hasAnalyzer ? 45 : !hasActionPlan ? 70 : 100;

  // Determine next step
  const nextStepHref = !hasSnapshot
    ? "/snapshot"
    : !hasAnalyzer
    ? "/dashboard/analyzer"
    : !hasActionPlan
    ? "/dashboard/action-plan"
    : "/dashboard/disputes";

  return (
    <main>
      <div className="container col">

        {/* HEADER */}
        <header className="col">
          <h1>Welcome Back</h1>
          <p>Your credit journey, organized and intentional.</p>
          <small>BUILD PHASE · {progress}% complete</small>
        </header>

        {/* BADGE PROGRESS */}
        <BadgeSection />

        {/* PROGRESS BAR */}
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* CTA */}
        <section className="surface card glow-soft col">
          <h2>
            {!hasSnapshot
              ? "Pull Your Epic Credit Report"
              : !hasAnalyzer
              ? "Analyzing Your Report"
              : !hasActionPlan
              ? "Build Your Action Plan"
              : "Execute Your Plan"}
          </h2>
          <p>
            {!hasSnapshot
              ? "Get your complete 3-bureau credit analysis"
              : !hasAnalyzer
              ? "Review your report and complete the analyzer"
              : !hasActionPlan
              ? "Get personalized steps to improve your credit"
              : "Follow your action plan to reach your goals"}
          </p>
          <Link href={nextStepHref} className="btn glow-neon">
            Continue
          </Link>
        </section>

      </div>
    </main>
  );
}
