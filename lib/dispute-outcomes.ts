/**
 * Dispute Outcome Tracking
 * 
 * Tracks results of disputes to measure effectiveness and prove value.
 * Feeds back into analyzer rules for continuous improvement.
 */

import { prisma } from '@/lib/prisma';
import type { DisputeOutcome } from '@prisma/client';

// Re-export Prisma type for convenience
export type { DisputeOutcome };

export type DisputeOutcomeStatus = 
  | 'removed'       // Item deleted from report (WIN)
  | 'verified'      // Bureau confirmed item is accurate (LOSS)
  | 'updated'       // Item modified (partial win)
  | 'pending'       // Waiting for response
  | 'no_response';  // 30+ days, no reply (often treated as removal)

export interface OutcomeStats {
  total: number;
  removed: number;
  verified: number;
  updated: number;
  pending: number;
  noResponse: number;
  successRate: number; // (removed + noResponse) / total
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
 * Record a new dispute outcome
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
  return await prisma.disputeOutcome.create({
    data: {
      ...data,
      outcome: 'pending',
    }
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
  const resolvedAt = outcome !== 'pending' ? new Date() : null;

  return await prisma.disputeOutcome.update({
    where: { id },
    data: {
      outcome,
      resolvedAt,
      notes,
    }
  });
}

/**
 * Get outcomes for a member
 */
export async function getMemberOutcomes(memberId: string): Promise<DisputeOutcome[]> {
  return await prisma.disputeOutcome.findMany({
    where: { memberId },
    orderBy: { disputedAt: 'desc' }
  });
}

/**
 * Get outcome statistics for a member
 */
export async function getMemberOutcomeStats(memberId: string): Promise<OutcomeStats> {
  const outcomes = await getMemberOutcomes(memberId);

  const stats = outcomes.reduce((acc, outcome) => {
    acc.total++;
    if (outcome.outcome === 'removed') acc.removed++;
    if (outcome.outcome === 'verified') acc.verified++;
    if (outcome.outcome === 'updated') acc.updated++;
    if (outcome.outcome === 'pending') acc.pending++;
    if (outcome.outcome === 'no_response') acc.noResponse++;
    return acc;
  }, {
    total: 0,
    removed: 0,
    verified: 0,
    updated: 0,
    pending: 0,
    noResponse: 0,
  });

  const successRate = stats.total > 0
    ? ((stats.removed + stats.noResponse) / stats.total) * 100
    : 0;

  return { ...stats, successRate };
}

/**
 * Get rule effectiveness across all members (admin only)
 */
export async function getRuleEffectiveness(): Promise<RuleEffectiveness[]> {
  // Get all outcomes grouped by rule
  const outcomes = await prisma.disputeOutcome.findMany({
    where: {
      ruleKey: { not: null }
    }
  });

  // Group by rule key
  const byRule = outcomes.reduce((acc, outcome) => {
    const key = outcome.ruleKey!;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(outcome);
    return acc;
  }, {} as Record<string, typeof outcomes>);

  // Calculate stats for each rule
  const effectiveness: RuleEffectiveness[] = [];

  for (const [ruleKey, ruleOutcomes] of Object.entries(byRule)) {
    const removed = ruleOutcomes.filter(o => o.outcome === 'removed').length;
    const verified = ruleOutcomes.filter(o => o.outcome === 'verified').length;
    const updated = ruleOutcomes.filter(o => o.outcome === 'updated').length;
    const noResponse = ruleOutcomes.filter(o => o.outcome === 'no_response').length;
    
    const total = ruleOutcomes.length;
    const successRate = total > 0 
      ? ((removed + noResponse) / total) * 100 
      : 0;

    // Calculate average days to resolve
    const resolved = ruleOutcomes.filter(o => o.resolvedAt);
    const avgDays = resolved.length > 0
      ? resolved.reduce((sum, o) => {
          const days = Math.floor(
            (o.resolvedAt!.getTime() - o.disputedAt.getTime()) / (1000 * 60 * 60 * 24)
          );
          return sum + days;
        }, 0) / resolved.length
      : null;

    // Get rule description
    const rule = await prisma.analyzerRule.findUnique({
      where: { ruleKey },
      select: { description: true }
    });

    effectiveness.push({
      ruleKey,
      description: rule?.description || 'Unknown rule',
      totalDisputes: total,
      removed,
      verified,
      updated,
      successRate,
      avgDaysToResolve: avgDays,
    });
  }

  // Sort by success rate descending
  return effectiveness.sort((a, b) => b.successRate - a.successRate);
}

/**
 * Get outcomes by round (shows if later rounds are more/less effective)
 */
export async function getOutcomesByRound(): Promise<Record<number, OutcomeStats>> {
  const outcomes = await prisma.disputeOutcome.findMany();

  const byRound: Record<number, typeof outcomes> = { 1: [], 2: [], 3: [] };

  outcomes.forEach(outcome => {
    if (outcome.roundNumber >= 1 && outcome.roundNumber <= 3) {
      byRound[outcome.roundNumber].push(outcome);
    }
  });

  const stats: Record<number, OutcomeStats> = {};

  for (const [round, roundOutcomes] of Object.entries(byRound)) {
    const removed = roundOutcomes.filter(o => o.outcome === 'removed').length;
    const verified = roundOutcomes.filter(o => o.outcome === 'verified').length;
    const updated = roundOutcomes.filter(o => o.outcome === 'updated').length;
    const pending = roundOutcomes.filter(o => o.outcome === 'pending').length;
    const noResponse = roundOutcomes.filter(o => o.outcome === 'no_response').length;
    
    const total = roundOutcomes.length;
    const successRate = total > 0 
      ? ((removed + noResponse) / total) * 100 
      : 0;

    stats[parseInt(round)] = {
      total,
      removed,
      verified,
      updated,
      pending,
      noResponse,
      successRate,
    };
  }

  return stats;
}

/**
 * Get outcome label for UI
 */
export function getOutcomeLabel(outcome: string): string {
  switch (outcome) {
    case 'removed':
      return 'Removed ✓';
    case 'verified':
      return 'Verified (No Change)';
    case 'updated':
      return 'Updated';
    case 'pending':
      return 'Pending Response';
    case 'no_response':
      return 'No Response (30+ days)';
    default:
      return outcome; // Return raw value for unknown statuses
  }
}

/**
 * Get outcome color for UI
 */
export function getOutcomeColor(outcome: string): string {
  switch (outcome) {
    case 'removed':
      return 'text-green-400 bg-green-500/20';
    case 'verified':
      return 'text-red-400 bg-red-500/20';
    case 'updated':
      return 'text-blue-400 bg-blue-500/20';
    case 'pending':
      return 'text-gray-400 bg-gray-500/20';
    case 'no_response':
      return 'text-amber-400 bg-amber-500/20';
    default:
      return 'text-gray-400 bg-gray-500/20'; // Default neutral styling
  }
}

/**
 * Check if outcome is considered a "win"
 */
export function isSuccessfulOutcome(outcome: string): boolean {
  return outcome === 'removed' || outcome === 'no_response';
}
