"use client";

/**
 * Round Stats Cards
 */

import { OutcomeStats } from "@/lib/dispute-outcomes";

interface RoundStatsCardsProps {
  roundStats: Record<number, OutcomeStats>;
}

export default function RoundStatsCards({ roundStats }: RoundStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map((round) => {
        const stats = roundStats[round];
        
        if (!stats || stats.total === 0) {
          return (
            <div key={round} className="rounded-lg border border-white/10 bg-white/5 p-4">
              <h3 className="text-sm font-semibold text-gray-400">Round {round}</h3>
              <p className="mt-2 text-xs text-gray-500">No data yet</p>
            </div>
          );
        }

        return (
          <div 
            key={round} 
            className={`rounded-lg border p-4 ${getRoundColor(round)}`}
          >
            <h3 className="text-sm font-semibold">Round {round}</h3>
            
            <div className="mt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total Disputes</span>
                <span className="font-semibold">{stats.total}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Removed</span>
                <span className="font-semibold text-green-400">{stats.removed}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Verified</span>
                <span className="font-semibold text-red-400">{stats.verified}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Pending</span>
                <span className="font-semibold text-gray-400">{stats.pending}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-gray-400">Success Rate</span>
                <span className="text-2xl font-bold">
                  {stats.successRate.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function getRoundColor(round: number): string {
  switch (round) {
    case 1:
      return 'border-blue-500/30 bg-blue-500/10';
    case 2:
      return 'border-amber-500/30 bg-amber-500/10';
    case 3:
      return 'border-red-500/30 bg-red-500/10';
    default:
      return 'border-white/10 bg-white/5';
  }
}
