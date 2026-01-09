/**
 * Commission Tracking Utilities
 * 
 * Server-side only - tracks reseller commissions for client milestones
 * Always use service-role client for these operations
 */

import { createClient } from "@supabase/supabase-js";

// Commission rates (in USD)
export const COMMISSION_RATES = {
  EPIC_REPORT_COMPLETED: 25.00,
  ANALYZER_COMPLETED: 15.00,
  SUBSCRIPTION_BASIC: 10.00,
  SUBSCRIPTION_ANALYZER: 25.00,
  SUBSCRIPTION_WELCOME: 50.00,
  SUBSCRIPTION_ULTIMATE: 100.00,
  FUNDING_READY: 50.00,
} as const;

export type CommissionReason = keyof typeof COMMISSION_RATES;

export type CommissionStatus = "pending" | "approved" | "paid" | "cancelled";

interface CreateCommissionParams {
  resellerId: string;
  userId: string;
  amount: number;
  reason: string;
  metadata?: Record<string, any>;
}

interface CommissionRecord {
  id: string;
  resellerId: string;
  userId: string;
  amount: number;
  reason: string;
  status: CommissionStatus;
  createdAt: string;
  paidAt: string | null;
}

/**
 * Create a Supabase admin client for commission operations
 * Must be called server-side only
 */
function getAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error("Commission operations must be server-side only");
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase environment variables");
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Award commission to a reseller for a client milestone
 * 
 * @example
 * await awardCommission({
 *   resellerId: "uuid",
 *   userId: "uuid",
 *   amount: COMMISSION_RATES.EPIC_REPORT_COMPLETED,
 *   reason: "Epic Report Completed",
 *   metadata: { reportId: "abc123" }
 * });
 */
export async function awardCommission(params: CreateCommissionParams): Promise<CommissionRecord | null> {
  const supabase = getAdminClient();

  try {
    // Verify reseller exists and has reseller role
    const { data: reseller, error: resellerError } = await supabase
      .from("Customer")
      .select("id, role")
      .eq("id", params.resellerId)
      .single();

    if (resellerError || !reseller || reseller.role !== "reseller") {
      console.warn(`Invalid reseller: ${params.resellerId}`);
      return null;
    }

    // Insert commission record
    const { data, error } = await supabase
      .from("reseller_commissions")
      .insert({
        reseller_id: params.resellerId,
        user_id: params.userId,
        amount: params.amount,
        reason: params.reason,
        metadata: params.metadata || {},
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to award commission:", error);
      return null;
    }

    console.log(`✅ Commission awarded: $${params.amount} to ${params.resellerId} for ${params.reason}`);
    return data as CommissionRecord;

  } catch (err) {
    console.error("Unexpected error awarding commission:", err);
    return null;
  }
}

/**
 * Get total commissions for a reseller
 */
export async function getResellerCommissions(resellerId: string, status?: CommissionStatus) {
  const supabase = getAdminClient();

  let query = supabase
    .from("reseller_commissions")
    .select("*")
    .eq("reseller_id", resellerId)
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch commissions:", error);
    return [];
  }

  return data as CommissionRecord[];
}

/**
 * Calculate total earnings for a reseller
 */
export async function calculateResellerEarnings(resellerId: string) {
  const commissions = await getResellerCommissions(resellerId);

  const total = commissions.reduce((sum, c) => sum + Number(c.amount), 0);
  const pending = commissions
    .filter((c) => c.status === "pending")
    .reduce((sum, c) => sum + Number(c.amount), 0);
  const paid = commissions
    .filter((c) => c.status === "paid")
    .reduce((sum, c) => sum + Number(c.amount), 0);

  return {
    total,
    pending,
    paid,
    count: commissions.length,
  };
}

/**
 * Award commission if user has a reseller
 * Safe to call even if user has no reseller (will be no-op)
 * 
 * @example
 * // In your Epic Report completion handler:
 * await awardCommissionIfReferred(
 *   userId,
 *   COMMISSION_RATES.EPIC_REPORT_COMPLETED,
 *   "Epic Report Completed"
 * );
 */
export async function awardCommissionIfReferred(
  userId: string,
  amount: number,
  reason: string,
  metadata?: Record<string, any>
): Promise<CommissionRecord | null> {
  const supabase = getAdminClient();

  // Look up user's reseller
  const { data: user, error } = await supabase
    .from("Customer")
    .select("reseller_id")
    .eq("id", userId)
    .single();

  if (error || !user?.reseller_id) {
    // No reseller - this is fine, just no commission
    return null;
  }

  // Award commission to reseller
  return awardCommission({
    resellerId: user.reseller_id,
    userId,
    amount,
    reason,
    metadata,
  });
}

/**
 * Update commission status (e.g., mark as paid)
 */
export async function updateCommissionStatus(
  commissionId: string,
  status: CommissionStatus,
  paidAt?: Date
) {
  const supabase = getAdminClient();

  const updateData: any = { status };
  if (paidAt && status === "paid") {
    updateData.paid_at = paidAt.toISOString();
  }

  const { data, error } = await supabase
    .from("reseller_commissions")
    .update(updateData)
    .eq("id", commissionId)
    .select()
    .single();

  if (error) {
    console.error("Failed to update commission status:", error);
    return null;
  }

  return data as CommissionRecord;
}
