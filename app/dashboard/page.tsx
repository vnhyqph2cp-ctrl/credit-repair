import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return (
      <div className="max-w-3xl space-y-2">
        <h1 className="text-2xl font-semibold">
          Authentication Required
        </h1>
        <p className="text-muted-foreground">
          You must be logged in to view the dashboard.
        </p>
      </div>
    );
  }

  const username = user.email.split("@")[0];

  return (
    <div className="max-w-6xl space-y-10">
      {/* Welcome */}
      <section className="rounded-xl border border-white/10 bg-black/30 p-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
          Welcome back
        </p>
        <h1 className="text-2xl font-semibold">
          {username},{" "}
          <span className="text-muted-foreground">
            your credit playbook is live.
          </span>
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Track progress, monitor enforcement, and run your Analyzer Blueprint
          when you’re ready.
        </p>
      </section>

      {/* Analyzer Entry */}
      <section className="rounded-xl border border-white/10 bg-black/30 p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            3B Analyzer Blueprint
          </h2>
          <p className="mt-1 text-sm text-muted-foreground max-w-lg">
            Generate a structured, enforcement-ready credit action plan based on
            detected reporting violations.
          </p>
        </div>

        <Link
          href="/dashboard/analyzer"
          className="inline-flex items-center justify-center rounded-lg bg-neon-teal px-5 py-2 text-sm font-semibold text-black hover:brightness-110"
        >
          Go to Analyzer
        </Link>
      </section>
    </div>
  );
}
