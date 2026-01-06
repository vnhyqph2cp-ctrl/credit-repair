"use server";

/**
 * Dispute Outcomes Actions
 */

import { createClient } from "@/lib/supabase/server";
import { 
  recordDisputeOutcome, 
  updateDisputeOutcome, 
  getMemberOutcomes,
  getMemberOutcomeStats,
  DisputeOutcomeStatus 
} from "@/lib/dispute-outcomes";

/**
 * Record a new dispute (user action)
 */
export async function recordDispute(data: {
  suggestionId?: string;
  ruleKey?: string;
  bureau: string;
  creditor: string;
  disputeReason: string;
  roundNumber: number;
}) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const outcome = await recordDisputeOutcome({
      memberId: user.id,
      ...data,
      disputedAt: new Date(),
    });

    return { success: true, outcome };
  } catch (error) {
    console.error("Failed to record dispute:", error);
    return { success: false, error: "Failed to record dispute" };
  }
}

/**
 * Update dispute outcome (user reports result)
 */
export async function updateOutcome(
  outcomeId: string,
  status: DisputeOutcomeStatus,
  notes?: string
) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const outcome = await updateDisputeOutcome(outcomeId, status, notes);
    return { success: true, outcome };
  } catch (error) {
    console.error("Failed to update outcome:", error);
    return { success: false, error: "Failed to update outcome" };
  }
}

/**
 * Get outcomes for current user
 */
export async function getMyOutcomes() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Unauthorized", outcomes: [] };
  }

  try {
    const outcomes = await getMemberOutcomes(user.id);
    const stats = await getMemberOutcomeStats(user.id);
    return { success: true, outcomes, stats };
  } catch (error) {
    console.error("Failed to get outcomes:", error);
    return { success: false, error: "Failed to get outcomes", outcomes: [] };
  }
}
