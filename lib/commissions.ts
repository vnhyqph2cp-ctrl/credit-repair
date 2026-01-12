/**
 * Commission Tracking Utilities
 *
 * Server-side only — tracks reseller commissions for client milestones.
 * Always uses Supabase service-role client.
 *
 * This system activates ONLY after Epic Report (post-MFSN).
 */

import { createClient } from "@supabase/supabase-js";

// ─────────────────────────────────────────────
// Commission Rates (USD)
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface CreateCommissionParams {
  resellerId: string;
  userId: string;
  amount: number;
  reason: CommissionReason;
  metadata?: Record<string, any>;
}

interface CommissionRecord {
  id: string;
  resellerId: string;
  userId: string;
  amount: number;
  reason: CommissionReason;
  status: CommissionStatus;
  createdAt: string;
  paidAt: string | null;
}

// ─────────────────────────────────────────────
// Admin Client (Service Role Only)
// ─────────────────────────────────────────────

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
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// ─────────────────────────────────────────────
// Core Operations
// ─────────────────────────────────────────────

export async function awardCommission(
  params: CreateCommissionParams
): Promise<CommissionRecord | null> {
  const supabase = getAdminClient();

  try {
    // Validate reseller
    const { data: reseller, error: resellerError } = await supabase
      .from("Customer")
      .select("id, role")
      .eq("id", params.resellerId)
      .single();

    if (resellerError || !reseller || reseller.role !== "reseller") {
      console.warn(`Invalid reseller: ${params.resellerId}`);
      return null;
    }

    // Create commission record
    const { data, error } = await supabase
      .from("reseller_commissions")
      .insert({
        reseller_id: params.resellerId,
        user_id: params.userId,
        amount: params.amount,
        reason: params.reason,
        metadata: params.metadata ?? {},
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to award commission:", error);
      return null;
    }

    return data as CommissionRecord;
  } catch (err) {
    console.error("Unexpected commission error:", err);
    return null;
  }
}

// ─────────────────────────────────────────────
// Conditional Award (Safe No-Op)
// ─────────────────────────────────────────────

export async function awardCommissionIfReferred(
  userId: string,
  amount: number,
  reason: CommissionReason,
  metadata?: Record<string, any>
): Promise<CommissionRecord | null> {
  const supabase = getAdminClient();

  const { data: user, error } = await supabase
    .from("Customer")
    .select("reseller_id")
    .eq("id", userId)
    .single();

  if (error || !user?.reseller_id) {
    return null;
  }

  return awardCommission({
    resellerId: user.reseller_id,
    userId,
    amount,
    reason,
    metadata,
  });
}

// ─────────────────────────────────────────────
// Queries & Aggregates
// ─────────────────────────────────────────────

export async function getResellerCommissions(
  resellerId: string,
  status?: CommissionStatus
) {
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

export async function calculateResellerEarnings(resellerId: string) {
  const commissions = await getResellerCommissions(resellerId);

  const total = commissions.reduce((s, c) => s + Number(c.amount), 0);
  const pending = commissions
    .filter((c) => c.status === "pending")
    .reduce((s, c) => s + Number(c.amount), 0);
  const paid = commissions
    .filter((c) => c.status === "paid")
    .reduce((s, c) => s + Number(c.amount), 0);

  return {
    total,
    pending,
    paid,
    count: commissions.length,
  };
}

// ─────────────────────────────────────────────
// Admin Update
// ─────────────────────────────────────────────

export async function updateCommissionStatus(
  commissionId: string,
  status: CommissionStatus,
  paidAt?: Date
) {
  const supabase = getAdminClient();

  const updateData: Record<string, any> = { status };

  if (status === "paid" && paidAt) {
    updateData.paid_at = paidAt.toISOString();
  }

  const { data, error } = await supabase
    .from("reseller_commissions")
    .update(updateData)
    .eq("id", commissionId)
    .select()
    .single();

  if (error) {
    console.error("Failed to update commission:", error);
    return null;
  }

  return data as CommissionRecord;
}
