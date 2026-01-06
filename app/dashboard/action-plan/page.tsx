import Link from "next/link";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type ActionPlanSection = {
  section_key: string;
  title: string;
  description: string;
  base_required: boolean;
  sort_order: number;
};

export default async function ActionPlanPage() {
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

  // STATE 1 — not logged in
  if (!user) redirect("/login");

  // ─────────────────────────────────────────────
  // Epic Credit Report (3-Bureau Full File)
  // NOTE: Stored in "Snapshot" table (legacy naming)
  // Contains full 3B report payload + extracted scores
  // Source: MFSN /api/auth/3B/report.json
  // ─────────────────────────────────────────────
  const { data: snapshot } = await supabase
    .from("Snapshot") // legacy table name
    .select("status")
    .eq("customerId", user.id)
    .order("createdAt", { ascending: false })
    .limit(1)
    .maybeSingle();

  // STATE 2 — Epic Report not ready
  if (!snapshot || snapshot.status !== "ready") {
    return (
      <main className="container col">
        <section className="surface card col">
          <h1>Action Plan Locked</h1>
          <p className="text-muted">
            Your Epic Credit Report must be completed before your action plan
            can be generated.
          </p>
          <Link href="/snapshot" className="btn glow-neon">
            Pull Epic Credit Report
          </Link>
        </section>
      </main>
    );
  }

  // Resolve the action plan
  const { data: plan, error } = await supabase.rpc(
    "resolve_dispute_profile",
    { p_user_id: user.id }
  );

  // STATE 3 — building / processing
  if (!error && (!plan || plan.length === 0)) {
    return (
      <main className="container col">
        <section className="surface card glow-soft col">
          <h1>Building Your Action Plan</h1>
          <p className="text-muted">
            We're analyzing your Epic Credit Report and prioritizing next steps.
            This usually takes under a minute.
          </p>

          <div className="col mt-4">
            <div className="shimmer-line w-2/3" />
            <div className="shimmer-line w-full" />
            <div className="shimmer-line w-5/6" />
            <small className="mt-2 text-muted">
              Prioritizing actions based on impact…
            </small>
          </div>
        </section>
      </main>
    );
  }

  // STATE 3b — unexpected error (rare)
  if (error) {
    return (
      <main className="container col">
        <section className="surface card col">
          <h1>Something Went Wrong</h1>
          <p className="text-muted">
            We ran into an issue generating your action plan. Please try again.
          </p>
          <Link href="/dashboard" className="btn glow-soft">
            Back to Dashboard
          </Link>
        </section>
      </main>
    );
  }

  // STATE 4 — plan ready
  const sortedPlan = [...plan].sort(
    (a: ActionPlanSection, b: ActionPlanSection) =>
      a.sort_order - b.sort_order
  );

  return (
    <main className="container col">
      <header className="col">
        <h1>Your Action Plan</h1>
        <p className="text-muted">
          These steps are based on your Epic Credit Report.
          Focus on one section at a time.
        </p>
      </header>

      <div className="col" style={{ gap: 20 }}>
        {sortedPlan.map((section: ActionPlanSection) => (
          <section
            key={section.section_key}
            className="surface card glow-soft col action-section"
          >
            <div className="section-accent" />

            <h3>{section.title}</h3>
            <p>{section.description}</p>

            {section.base_required && (
              <span className="badge-required">Required</span>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}
