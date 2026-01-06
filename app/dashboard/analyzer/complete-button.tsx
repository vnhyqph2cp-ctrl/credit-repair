// app/dashboard/analyzer/complete-button.tsx

"use client";

import { useState } from "react";
import { completeAnalyzer } from "./actions";

export default function CompleteAnalyzerButton({ customerId }: { customerId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleComplete() {
    setLoading(true);
    try {
      const result = await completeAnalyzer(customerId);
      
      if (result.success) {
        // Redirect to results
        window.location.href = "/dashboard/analyzer/results";
      } else {
        alert(result.error || "Failed to complete. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Failed to complete analyzer:", error);
      alert("Failed to complete. Please try again.");
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleComplete}
      disabled={loading}
      className="rounded-xl px-6 py-3 font-semibold
                 bg-gradient-to-r from-teal-500 to-blue-500
                 hover:from-teal-400 hover:to-blue-400 transition
                 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "Analyzing..." : "Complete Analysis"}
    </button>
  );
}
