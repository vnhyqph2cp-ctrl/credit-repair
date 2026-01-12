// lib/dashboard/state.ts

import { PlanTier } from "@/lib/stripe/pricing";

/**
 * Dashboard access & readiness state
 * This does NOT load reports.
 * It only determines availability and gating.
 */

export type DashboardState = {
  hasEpicReport: boolean;
  hasAnalyzerResults: boolean;
  plan: PlanTier;
};

/**
 * TEMP implementation
 * Real DB logic will replace this once:
 * - Epic Report ingestion is finalized
 * - Analyzer sessions are locked
 */
export async function getDashboardState(
  _customerId: string
): Promise<DashboardState> {
  return {
    hasEpicReport: false,
    hasAnalyzerResults: false,
    plan: "basic",
  };
}
