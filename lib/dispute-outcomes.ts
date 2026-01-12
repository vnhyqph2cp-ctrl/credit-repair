/**
 * Dispute Outcome Tracking
 *
 * Tracks post-dispute results to:
 * - Measure enforcement effectiveness
 * - Prove deletions and compliance wins
 * - Feed analyzer rule tuning
 *
 * Epic Report + Enforcement only.
 */

import { prisma } from "@/lib/prisma";
import type { DisputeOutcome } from "@prisma/client";

// Re-export Prisma type for consumers
export type { DisputeOutcome };

// Canonical outcome statuses
export type DisputeOutcomeStatus =
  | "removed"        // Deleted (WIN)
  | "verified"       // Verified accurate (LOSS)
  | "updated"        // Corrected (PARTIAL WIN)
  | "pending"        // Awaiting response
  | "no_response";   // 31+ day silence (STATUTORY WIN)

export interface OutcomeStats {
  total: number;
  removed: number;
  verified: number;
  updated: number;
  pending: number;
  noResponse: number;
  successRate: number; // (removed + no_response) / total
}

export interface RuleEffectiveness {
  ruleKey: string;
  description: string;
  totalDisputes: number;
  removed: number;
  verified: number;
  updated: number;
  successRate: number;
  avgDaysToResolve: number | null;
}

/**
 * Create a new dispute outcome record (initially pending)
 */
export async function recordDisputeOutcome(data: {
  memberId: string;
  suggestionId?: string;
  ruleKey?: string;
  bureau: string;
  creditor: string;
  disputeReason: string;
  roundNumber: number;
  disputedAt: Date;
}): Promise<DisputeOutcome> {
  return prisma.disputeOutcome.create({
    data: {
      ...data,
      outcome: "pending",
    },
  });
}

/**
 * Update outcome status
 */
export async function updateDisputeOutcome(
  id: string,
  outcome: DisputeOutcomeStatus,
  notes?: string
): Promise<DisputeOutcome> {
  return prisma.disputeOutcome.update({
    where: { id },
    data: {
      outcome,
      resolvedAt: outcome !== "pending" ? new Date() : null,
      notes,
    },
  });
}

/**
 * Get all outcomes for a member
 */
export async function getMemberOutcomes(
  memberId: string
): Promise<DisputeOutcome[]> {
  return prisma.disputeOutcome.findMany({
    where: { memberId },
    orderBy: { disputedAt: "desc" },
  });
}

/**
 * Aggregate outcome stats for a member
 */
export async function getMemberOutcomeStats(
  memberId: string
): Promise<OutcomeStats> {
  const outcomes = await getMemberOutcomes(memberId);

  const base = {
    total: 0,
    removed: 0,
    verified: 0,
    updated: 0,
    pending: 0,
    noResponse: 0,
  };

  const stats = outcomes.reduce((acc, o) => {
    acc.total++;
    if (o.outcome === "removed") acc.removed++;
    if (o.outcome === "verified") acc.verified++;
    if (o.outcome === "updated") acc.updated++;
    if (o.outcome === "pending") acc.pending++;
    if (o.outcome === "no_response") acc.noResponse++;
    return acc;
  }, base);

  const successRate =
    stats.total > 0
      ? ((stats.removed + stats.noResponse) / stats.total) * 100
      : 0;

  return { ...stats, successRate };
}

/**
 * Analyzer rule effectiveness (admin analytics)
 */
export async function getRuleEffectiveness(): Promise<RuleEffectiveness[]> {
  const outcomes = await prisma.disputeOutcome.findMany({
    where: { ruleKey: { not: null } },
  });

  const grouped = outcomes.reduce<Record<string, DisputeOutcome[]>>(
    (acc, o) => {
      acc[o.ruleKey!] ||= [];
      acc[o.ruleKey!].push(o);
      return acc;
    },
    {}
  );

  const results: RuleEffectiveness[] = [];

  for (const [ruleKey, rows] of Object.entries(grouped)) {
    const total = rows.length;
    const removed = rows.filter(o => o.outcome === "removed").length;
    const verified = rows.filter(o => o.outcome === "verified").length;
    const updated = rows.filter(o => o.outcome === "updated").length;
    const noResponse = rows.filter(o => o.outcome === "no_response").length;

    const successRate =
      total > 0 ? ((removed + noResponse) / total) * 100 : 0;

    const resolved = rows.filter(o => o.resolvedAt);
    const avgDays =
      resolved.length > 0
        ? resolved.reduce((sum, o) => {
            return (
              sum +
              Math.floor(
                (o.resolvedAt!.getTime() - o.disputedAt.getTime()) /
                  (1000 * 60 * 60 * 24)
              )
            );
          }, 0) / resolved.length
        : null;

    const rule = await prisma.analyzerRule.findUnique({
      where: { ruleKey },
      select: { description: true },
    });

    results.push({
      ruleKey,
      description: rule?.description ?? "Unknown rule",
      totalDisputes: total,
      removed,
      verified,
      updated,
      successRate,
      avgDaysToResolve: avgDays,
    });
  }

  return results.sort((a, b) => b.successRate - a.successRate);
}

/**
 * Outcome label (UI-safe)
 */
export function getOutcomeLabel(outcome: DisputeOutcomeStatus): string {
  switch (outcome) {
    case "removed":
      return "Removed ✓";
    case "verified":
      return "Verified (No Change)";
    case "updated":
      return "Updated";
    case "pending":
      return "Pending Response";
    case "no_response":
      return "No Response (31+ Days)";
  }
}

/**
 * Outcome color (UI-safe)
 */
export function getOutcomeColor(outcome: DisputeOutcomeStatus): string {
  switch (outcome) {
    case "removed":
      return "text-green-400 bg-green-500/20";
    case "verified":
      return "text-red-400 bg-red-500/20";
    case "updated":
      return "text-blue-400 bg-blue-500/20";
    case "pending":
      return "text-gray-400 bg-gray-500/20";
    case "no_response":
      return "text-amber-400 bg-amber-500/20";
  }
}

/**
 * Success check
 */
export function isSuccessfulOutcome(
  outcome: DisputeOutcomeStatus
): boolean {
  return outcome === "removed" || outcome === "no_response";
}
