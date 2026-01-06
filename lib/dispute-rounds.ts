/**
 * Dispute Round Tracking
 * 
 * Organizes disputes into sequential rounds with time-gating.
 * Compliant: No auto-sending, no guarantees, user-controlled.
 */

import { prisma } from '@/lib/prisma';
import { differenceInDays } from 'date-fns';

export interface DisputeRound {
  id: string;
  memberId: string;
  roundNumber: number;
  startedAt: Date;
  completedAt: Date | null;
  createdAt: Date;
}

export interface RoundStatus {
  roundNumber: 1 | 2 | 3;
  status: 'not-started' | 'active' | 'completed';
  canStart: boolean;
  daysUntilAvailable: number | null;
  startedAt: Date | null;
  completedAt: Date | null;
}

const ROUND_WAIT_DAYS = 30;

/**
 * Get all rounds for a member with calculated status
 */
export async function getRoundStatuses(memberId: string): Promise<RoundStatus[]> {
  const rounds = await prisma.disputeRound.findMany({
    where: { memberId },
    orderBy: { roundNumber: 'asc' }
  });

  const statuses: RoundStatus[] = [];

  for (let roundNum = 1; roundNum <= 3; roundNum++) {
    const round = rounds.find(r => r.roundNumber === roundNum);
    const previousRound = rounds.find(r => r.roundNumber === roundNum - 1);

    let status: RoundStatus['status'] = 'not-started';
    let canStart = false;
    let daysUntilAvailable: number | null = null;

    if (round) {
      // Round exists in DB
      status = round.completedAt ? 'completed' : 'active';
      canStart = !round.completedAt;
    } else {
      // Round not started yet
      if (roundNum === 1) {
        // Round 1 can always start
        canStart = true;
      } else {
        // Round 2/3 requires previous round + time gate
        if (previousRound) {
          const daysSince = differenceInDays(new Date(), previousRound.startedAt);
          
          if (daysSince >= ROUND_WAIT_DAYS) {
            canStart = true;
          } else {
            daysUntilAvailable = ROUND_WAIT_DAYS - daysSince;
          }
        }
      }
    }

    statuses.push({
      roundNumber: roundNum as 1 | 2 | 3,
      status,
      canStart,
      daysUntilAvailable,
      startedAt: round?.startedAt ?? null,
      completedAt: round?.completedAt ?? null,
    });
  }

  return statuses;
}

/**
 * Start a new dispute round
 */
export async function startDisputeRound(
  memberId: string,
  roundNumber: 1 | 2 | 3
): Promise<{ success: boolean; error?: string; round?: DisputeRound }> {
  // Check if round already exists
  const existingRound = await prisma.disputeRound.findFirst({
    where: { memberId, roundNumber }
  });

  if (existingRound) {
    return { 
      success: false, 
      error: `Round ${roundNumber} has already been started` 
    };
  }

  // For Round 2/3, verify previous round exists and time-gate
  if (roundNumber > 1) {
    const previousRound = await prisma.disputeRound.findFirst({
      where: { memberId, roundNumber: roundNumber - 1 }
    });

    if (!previousRound) {
      return {
        success: false,
        error: `You must complete Round ${roundNumber - 1} first`
      };
    }

    const daysSince = differenceInDays(new Date(), previousRound.startedAt);
    if (daysSince < ROUND_WAIT_DAYS) {
      const daysRemaining = ROUND_WAIT_DAYS - daysSince;
      return {
        success: false,
        error: `Round ${roundNumber} will be available in ${daysRemaining} days`
      };
    }
  }

  // Create the round
  const round = await prisma.disputeRound.create({
    data: {
      memberId,
      roundNumber
    }
  });

  return { success: true, round };
}

/**
 * Mark a round as completed
 */
export async function completeDisputeRound(
  memberId: string,
  roundNumber: number
): Promise<{ success: boolean; error?: string }> {
  const round = await prisma.disputeRound.findFirst({
    where: { memberId, roundNumber }
  });

  if (!round) {
    return { success: false, error: 'Round not found' };
  }

  if (round.completedAt) {
    return { success: false, error: 'Round already completed' };
  }

  await prisma.disputeRound.update({
    where: { id: round.id },
    data: { completedAt: new Date() }
  });

  return { success: true };
}

/**
 * Get active round for a member
 */
export async function getActiveRound(memberId: string): Promise<DisputeRound | null> {
  return await prisma.disputeRound.findFirst({
    where: { 
      memberId,
      completedAt: null
    },
    orderBy: { roundNumber: 'desc' }
  });
}

/**
 * Get suggested voice style for round
 */
export function getSuggestedVoice(roundNumber: number): string {
  switch (roundNumber) {
    case 1:
      return 'standard'; // Professional, neutral
    case 2:
      return 'smitty'; // Firmer
    case 3:
      return 'darain'; // Most assertive
    default:
      return 'standard';
  }
}

/**
 * Get round description (for UI)
 */
export function getRoundDescription(roundNumber: number): string {
  switch (roundNumber) {
    case 1:
      return 'Initial dispute round. Professional tone, focuses on inaccuracies.';
    case 2:
      return 'Follow-up round. Firmer language, references previous requests.';
    case 3:
      return 'Final escalation. Most assertive approach within legal bounds.';
    default:
      return '';
  }
}
