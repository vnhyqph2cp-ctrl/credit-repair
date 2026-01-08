// lib/dashboard.ts
import { createServerSupabaseClient } from "./supabase-server";

export type DashboardPlan = "basic" | "analyzer" | "welcome" | "ultimate";

export type DashboardState = {
  hasReport: boolean;
  plan: DashboardPlan;
  report: {
    score_tu: number | null;
    score_eq: number | null;
    score_ex: number | null;
  } | null;
};

export async function getDashboardState(customerId: string): Promise<DashboardState> {
const supabase = await createServerSupabaseClient();


  // Example: adjust table/column names to your DB
  const { data: report, error } = await supabase
    .from("Snapshot") // or whatever table holds the MFSN snapshot
    .select("score_tu, score_eq, score_ex, plan")
    .eq("customerId", customerId)
    .order("createdAt", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    // Fail safe: treat as "no report yet" but don't leak details
    return {
      hasReport: false,
      plan: "basic",
      report: null,
    };
  }

  if (!report) {
    return {
      hasReport: false,
      plan: "basic",
      report: null,
    };
  }

  return {
    hasReport: true,
    plan: (report.plan as DashboardPlan) ?? "basic",
    report: {
      score_tu: report.score_tu ?? null,
      score_eq: report.score_eq ?? null,
      score_ex: report.score_ex ?? null,
    },
  };
}
