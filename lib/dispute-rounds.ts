// lib/dispute-rounds.ts

export type RoundStatus = {
  round: number;
  status: "pending" | "in_progress" | "completed";
  startedAt: Date | null;
  completedAt: Date | null;
};

/**
 * TEMP: hard-coded empty dispute-rounds state so build can succeed.
 * Later you can wire this up to a real Prisma model.
 */
export async function getRoundStatuses(
  _memberId: string
): Promise<RoundStatus[]> {
  return [];
}
