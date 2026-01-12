// lib/enforcement/rounds.stub.ts

export type StubRoundStatus = "pending" | "in_progress" | "completed";

export type RoundStatusStub = {
  round: number;
  status: StubRoundStatus;
  startedAt: Date | null;
  completedAt: Date | null;
};

/**
 * STUB ONLY
 * This exists to unblock UI + builds.
 * Real round state is enforced via mail evidence + violations.
 */
export async function getRoundStatuses(
  _memberId: string
): Promise<RoundStatusStub[]> {
  return [];
}
