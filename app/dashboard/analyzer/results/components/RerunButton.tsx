"use client";

/**
 * Re-run Analyzer Button
 * 
 * Gated by:
 * - monitoring_active = true
 * - 30-day throttle since last run
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { rerunAnalyzer } from "../actions";

interface RerunButtonProps {
  memberId: string;
}

export default function RerunButton({ memberId }: RerunButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleRerun() {
    setIsLoading(true);
    try {
      const result = await rerunAnalyzer(memberId);

      if (!result.success) {
        alert(result.error || "Unable to re-run analyzer at this time");
        setIsLoading(false);
        return;
      }

      // Refresh the page to show new delta
      router.refresh();
    } catch (error) {
      console.error("Re-run failed:", error);
      alert("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <button
      onClick={handleRerun}
      disabled={isLoading}
      className="rounded-xl px-6 py-3 font-semibold whitespace-nowrap
                 bg-gradient-to-r from-teal-500 to-blue-500
                 hover:from-teal-400 hover:to-blue-400
                 disabled:opacity-50 disabled:cursor-not-allowed
                 transition"
    >
      {isLoading ? "Running..." : "Re-run Analyzer"}
    </button>
  );
}
