// lib/funding/readiness.ts
import { createClient } from "@/lib/supabase/server";
import { logBandChange } from "@/lib/funding/telemetry";

export type FundingBand = "BUILD" | "ALMOST" | "READY";

export type FundingReadinessResult = {
  frs: number;
  band: FundingBand;
  breakdown: {
    credit: number;
    utilization: number;
    derogatories: number;
    accounts: number;
    club: number;
  };
};

/**
 * Funding Readiness Score (FRS)
 * Internal decision score (0–100). NOT a credit score.
 */
export async function calculateFundingReadiness(
  userId: string
): Promise<FundingReadinessResult> {
  const supabase = await createClient();

  // -----------------------------
  // 1. Load latest Snapshot
  // -----------------------------
  const { data: snapshot } = await supabase
    .from("Snapshot")
    .select("*")
    .eq("customerId", userId)
    .order("createdAt", { ascending: false })
    .limit(1)
    .single();

  if (!snapshot) {
    throw new Error("No Snapshot found for user");
  }

  // -----------------------------
  // 2. Load normalized data
  // -----------------------------
  const [{ data: tradelines }, { data: club }] = await Promise.all([
    supabase
      .from("tradelines")
      .select("is_derogatory, status")
      .eq("user_id", userId),

    supabase
      .from("boost_club_members")
      .select("tier")
      .eq("user_id", userId)
      .single(),
  ]);

  // -----------------------------
  // 3. CREDIT SCORE (30)
  // -----------------------------
  const scores = [
    snapshot.score_tu,
    snapshot.score_eq,
    snapshot.score_ex,
  ].filter(Boolean) as number[];

  const avgScore =
    scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;

  let credit = 5;
  if (avgScore >= 760) credit = 30;
  else if (avgScore >= 720) credit = 25;
  else if (avgScore >= 680) credit = 20;
  else if (avgScore >= 640) credit = 15;
  else if (avgScore >= 600) credit = 10;

  // -----------------------------
  // 4. UTILIZATION (25)
  // -----------------------------
  const utilizationPct = snapshot.utilization_percent ?? 100;

  let utilization = 0;
  if (utilizationPct <= 10) utilization = 25;
  else if (utilizationPct <= 30) utilization = 20;
  else if (utilizationPct <= 50) utilization = 12;
  else if (utilizationPct <= 70) utilization = 5;

  // -----------------------------
  // 5. DEROGATORIES (25)
  // -----------------------------
  const derogCount =
    tradelines?.filter((t) => t.is_derogatory).length ?? 0;

  let derogatories = 0;
  if (derogCount === 0) derogatories = 25;
  else if (derogCount <= 2) derogatories = 15;
  else if (derogCount <= 5) derogatories = 5;

  // -----------------------------
  // 6. ACCOUNT DEPTH (10)
  // -----------------------------
  const openAccounts =
    tradelines?.filter((t) => t.status === "open").length ?? 0;

  let accounts = 0;
  if (openAccounts >= 5) accounts = 10;
  else if (openAccounts >= 3) accounts = 7;
  else if (openAccounts >= 1) accounts = 4;

  // -----------------------------
  // 7. CLUB TIER (10)
  // -----------------------------
  let clubPoints = 0;
  switch (club?.tier) {
    case "legend":
      clubPoints = 10;
      break;
    case "elite":
      clubPoints = 8;
      break;
    case "builder":
      clubPoints = 5;
      break;
    case "starter":
      clubPoints = 2;
      break;
  }

  // -----------------------------
  // 8. FINAL SCORE + BAND
  // -----------------------------
  const frs =
    credit + utilization + derogatories + accounts + clubPoints;

  const band: FundingBand =
    frs >= 80 ? "READY" : frs >= 60 ? "ALMOST" : "BUILD";

  // -----------------------------
  // 9. Band Change Logging
  // -----------------------------
  const { data: lastBand } = await supabase
    .from("funding_band_events")
    .select("to_band")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!lastBand || lastBand.to_band !== band) {
    await logBandChange(
      userId,
      lastBand?.to_band ?? null,
      band,
      frs
    );
  }

  return {
    frs,
    band,
    breakdown: {
      credit,
      utilization,
      derogatories,
      accounts,
      club: clubPoints,
    },
  };
}
