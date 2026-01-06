"use client";

/**
 * Round Tracker Component
 * 
 * Displays dispute rounds with status and gating
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RoundStatus } from "@/lib/dispute-rounds";
import { startRound } from "../actions";

interface RoundTrackerProps {
  memberId: string;
  rounds: RoundStatus[];
}

export default function RoundTracker({ memberId, rounds }: RoundTrackerProps) {
  const router = useRouter();
  const [loadingRound, setLoadingRound] = useState<number | null>(null);

  async function handleStartRound(roundNumber: 1 | 2 | 3) {
    setLoadingRound(roundNumber);
    try {
      const result = await startRound(memberId, roundNumber);

      if (!result.success) {
        alert(result.error || "Unable to start round");
        setLoadingRound(null);
        return;
      }

      router.refresh();
    } catch (error) {
      console.error("Failed to start round:", error);
      alert("Something went wrong. Please try again.");
      setLoadingRound(null);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-xl font-semibold">Dispute Rounds</h2>
      <p className="mt-2 text-sm text-gray-400">
        Organize your disputes into structured rounds. Each round must wait 30 days after the previous.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {rounds.map((round) => (
          <RoundCard
            key={round.roundNumber}
            round={round}
            isLoading={loadingRound === round.roundNumber}
            onStart={() => handleStartRound(round.roundNumber)}
          />
        ))}
      </div>

      <p className="mt-4 text-xs text-gray-500">
        Rounds are organizational only. No disputes are sent automatically.
      </p>
    </div>
  );
}

function RoundCard({
  round,
  isLoading,
  onStart,
}: {
  round: RoundStatus;
  isLoading: boolean;
  onStart: () => void;
}) {
  const getStatusColor = () => {
    switch (round.status) {
      case 'completed':
        return 'border-green-500/30 bg-green-500/10';
      case 'active':
        return 'border-blue-500/30 bg-blue-500/10';
      default:
        return 'border-white/10 bg-white/5';
    }
  };

  const getStatusBadge = () => {
    switch (round.status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-1 text-xs font-medium text-green-400">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
            Completed
          </span>
        );
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/20 px-2 py-1 text-xs font-medium text-blue-400">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
            Active
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-xs font-medium text-gray-400">
            Not Started
          </span>
        );
    }
  };

  const getButtonText = () => {
    if (round.status === 'active') return 'Continue Round';
    if (round.status === 'completed') return 'View Round';
    if (round.daysUntilAvailable) return `Available in ${round.daysUntilAvailable} days`;
    return 'Start Round';
  };

  return (
    <div className={`rounded-xl border p-4 transition ${getStatusColor()}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Round {round.roundNumber}</h3>
        {getStatusBadge()}
      </div>

      {round.startedAt && (
        <p className="mt-2 text-xs text-gray-400">
          Started: {new Date(round.startedAt).toLocaleDateString()}
        </p>
      )}

      {round.completedAt && (
        <p className="mt-1 text-xs text-gray-400">
          Completed: {new Date(round.completedAt).toLocaleDateString()}
        </p>
      )}

      <div className="mt-4">
        <button
          onClick={onStart}
          disabled={!round.canStart || isLoading || round.status === 'completed'}
          className="w-full rounded-lg px-4 py-2 text-sm font-semibold
                     bg-white/10 hover:bg-white/15
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition"
        >
          {isLoading ? 'Starting...' : getButtonText()}
        </button>
      </div>

      {round.daysUntilAvailable !== null && (
        <p className="mt-2 text-xs text-center text-gray-500">
          Wait period: 30 days between rounds
        </p>
      )}
    </div>
  );
}
