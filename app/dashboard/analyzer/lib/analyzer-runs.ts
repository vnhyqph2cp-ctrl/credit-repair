/**
 * Analyzer Run History
 * 
 * Stores snapshots of credit analysis results to track progress over time.
 * Compliant: No guarantees, no projections, just historical facts.
 */

import { prisma } from '@/lib/prisma';

export interface AnalyzerSnapshot {
  scoreAvg: number | null;
  scoreEq: number | null;
  scoreEx: number | null;
  scoreTu: number | null;
  negativesCount: number;
  utilizationPct: number;
  inquiriesCount: number;
}

export interface AnalyzerRunWithDelta {
  id: string;
  runNumber: number;
  createdAt: Date;
  snapshot: AnalyzerSnapshot;
  delta?: {
    scoreAvg: number;
    scoreEq: number;
    scoreEx: number;
    scoreTu: number;
    negativesCount: number;
    utilizationPct: number;
    inquiriesCount: number;
  };
}

/**
 * Save a new analyzer run snapshot
 */
export async function saveAnalyzerRun(
  memberId: string,
  snapshot: AnalyzerSnapshot
) {
  // Get the latest run number
  const latestRun = await prisma.analyzerRun.findFirst({
    where: { memberId },
    orderBy: { runNumber: 'desc' },
    select: { runNumber: true }
  });

  const nextRunNumber = (latestRun?.runNumber ?? 0) + 1;

  return await prisma.analyzerRun.create({
    data: {
      memberId,
      runNumber: nextRunNumber,
      scoreAvg: snapshot.scoreAvg,
      scoreEq: snapshot.scoreEq,
      scoreEx: snapshot.scoreEx,
      scoreTu: snapshot.scoreTu,
      negativesCount: snapshot.negativesCount,
      utilizationPct: snapshot.utilizationPct,
      inquiriesCount: snapshot.inquiriesCount,
    }
  });
}

/**
 * Get the last two runs for comparison
 */
export async function getAnalyzerRunsWithDelta(memberId: string): Promise<{
  current: AnalyzerRunWithDelta | null;
  previous: AnalyzerRunWithDelta | null;
}> {
  const runs = await prisma.analyzerRun.findMany({
    where: { memberId },
    orderBy: { createdAt: 'desc' },
    take: 2
  });

  if (runs.length === 0) {
    return { current: null, previous: null };
  }

  const current = runs[0];
  const previous = runs.length > 1 ? runs[1] : null;

  const currentWithDelta: AnalyzerRunWithDelta = {
    id: current.id,
    runNumber: current.runNumber,
    createdAt: current.createdAt,
    snapshot: {
      scoreAvg: current.scoreAvg,
      scoreEq: current.scoreEq,
      scoreEx: current.scoreEx,
      scoreTu: current.scoreTu,
      negativesCount: current.negativesCount ?? 0,
      utilizationPct: current.utilizationPct ?? 0,
      inquiriesCount: current.inquiriesCount ?? 0,
    }
  };

  if (previous) {
    currentWithDelta.delta = {
      scoreAvg: (current.scoreAvg ?? 0) - (previous.scoreAvg ?? 0),
      scoreEq: (current.scoreEq ?? 0) - (previous.scoreEq ?? 0),
      scoreEx: (current.scoreEx ?? 0) - (previous.scoreEx ?? 0),
      scoreTu: (current.scoreTu ?? 0) - (previous.scoreTu ?? 0),
      negativesCount: (current.negativesCount ?? 0) - (previous.negativesCount ?? 0),
      utilizationPct: (current.utilizationPct ?? 0) - (previous.utilizationPct ?? 0),
      inquiriesCount: (current.inquiriesCount ?? 0) - (previous.inquiriesCount ?? 0),
    };
  }

  const previousWithDelta = previous ? {
    id: previous.id,
    runNumber: previous.runNumber,
    createdAt: previous.createdAt,
    snapshot: {
      scoreAvg: previous.scoreAvg,
      scoreEq: previous.scoreEq,
      scoreEx: previous.scoreEx,
      scoreTu: previous.scoreTu,
      negativesCount: previous.negativesCount ?? 0,
      utilizationPct: previous.utilizationPct ?? 0,
      inquiriesCount: previous.inquiriesCount ?? 0,
    }
  } : null;

  return { current: currentWithDelta, previous: previousWithDelta };
}

/**
 * Check if user can re-run analyzer (30-day throttle)
 */
export async function canRerunAnalyzer(memberId: string): Promise<{
  allowed: boolean;
  nextAllowedDate: Date | null;
  daysSinceLastRun: number | null;
}> {
  const latestRun = await prisma.analyzerRun.findFirst({
    where: { memberId },
    orderBy: { createdAt: 'desc' },
    select: { createdAt: true }
  });

  if (!latestRun) {
    return {
      allowed: true,
      nextAllowedDate: null,
      daysSinceLastRun: null
    };
  }

  const now = new Date();
  const daysSince = Math.floor(
    (now.getTime() - latestRun.createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  const THROTTLE_DAYS = 30;
  const allowed = daysSince >= THROTTLE_DAYS;

  const nextAllowedDate = new Date(latestRun.createdAt);
  nextAllowedDate.setDate(nextAllowedDate.getDate() + THROTTLE_DAYS);

  return {
    allowed,
    nextAllowedDate,
    daysSinceLastRun: daysSince
  };
}

/**
 * Calculate human-readable delta explanation
 */
export function getDeltaExplanation(delta: AnalyzerRunWithDelta['delta']): string {
  if (!delta) {
    return '';
  }

  const parts: string[] = [];

  // Score change
  if (delta.scoreAvg > 0) {
    parts.push(`your average score increased by ${delta.scoreAvg} points`);
  } else if (delta.scoreAvg < 0) {
    parts.push(`your average score decreased by ${Math.abs(delta.scoreAvg)} points`);
  }

  // Negatives
  if (delta.negativesCount < 0) {
    parts.push(`${Math.abs(delta.negativesCount)} negative items were removed`);
  } else if (delta.negativesCount > 0) {
    parts.push(`${delta.negativesCount} new negative items appeared`);
  }

  // Utilization
  if (delta.utilizationPct < -5) {
    parts.push(`utilization improved by ${Math.abs(delta.utilizationPct).toFixed(1)}%`);
  } else if (delta.utilizationPct > 5) {
    parts.push(`utilization increased by ${delta.utilizationPct.toFixed(1)}%`);
  }

  // Inquiries
  if (delta.inquiriesCount < 0) {
    parts.push(`${Math.abs(delta.inquiriesCount)} hard inquiries aged off`);
  } else if (delta.inquiriesCount > 0) {
    parts.push(`${delta.inquiriesCount} new hard inquiries were added`);
  }

  if (parts.length === 0) {
    return 'No significant changes detected';
  }

  return parts.join(', ');
}

/**
 * Get all analyzer runs for trend visualization (last 12 runs max)
 */
export async function getAnalyzerTrend(memberId: string): Promise<AnalyzerRunWithDelta[]> {
  const runs = await prisma.analyzerRun.findMany({
    where: { memberId },
    orderBy: { createdAt: 'asc' },
    take: 12
  });

  return runs.map((run) => ({
    id: run.id,
    runNumber: run.runNumber,
    createdAt: run.createdAt,
    snapshot: {
      scoreAvg: run.scoreAvg,
      scoreEq: run.scoreEq,
      scoreEx: run.scoreEx,
      scoreTu: run.scoreTu,
      negativesCount: run.negativesCount ?? 0,
      utilizationPct: run.utilizationPct ?? 0,
      inquiriesCount: run.inquiriesCount ?? 0,
    }
  }));
}
