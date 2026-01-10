"use server";

/**
 * Admin Actions - Outcome Effectiveness
 */

import { getRuleEffectiveness, getOutcomesByRound } from "@/lib/dispute-outcomes";
import { requireAdmin } from "@/lib/auth";

/**
 * Get rule effectiveness metrics (admin only)
 */
export async function getEffectivenessMetrics() {
  await requireAdmin();
  try {
    const ruleEffectiveness = await getRuleEffectiveness();
    const roundStats = await getOutcomesByRound();

    return { 
      success: true, 
      ruleEffectiveness,
      roundStats 
    };
  } catch (error) {
    console.error("Failed to get effectiveness metrics:", error);
    return { 
      success: false, 
      error: "Failed to get metrics",
      ruleEffectiveness: [],
      roundStats: {}
    };
  }
}
