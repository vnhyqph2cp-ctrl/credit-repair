import { supabaseServer } from "@/lib/supabase/server";

export default async function EnforcementPage() {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="max-w-3xl space-y-4">
        <h1 className="text-2xl font-semibold">Authentication Required</h1>
        <p className="text-muted-foreground">
          You must be signed in to access the enforcement dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">
          Enforcement Dashboard
        </h1>
        <p className="text-muted-foreground">
          Track disputes, timelines, and compliance actions generated from your
          analyzer results.
        </p>
      </header>

      {/* EMPTY STATE */}
      <section className="rounded-xl border border-white/10 bg-black/30 p-6 space-y-4">
        <h2 className="text-xl font-semibold">
          No Enforcement Actions Yet
        </h2>
        <p className="text-sm text-muted-foreground">
          Enforcement actions are created automatically after running the 3B
          Analyzer. Once generated, they will appear here with status tracking
          and deadlines.
        </p>
      </section>

      {/* FUTURE MOUNT POINT */}
      {/*
        <EnforcementDashboard />
      */}
    </div>
  );
}
