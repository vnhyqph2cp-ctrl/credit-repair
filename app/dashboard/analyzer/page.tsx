"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AnalyzerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRunAnalyzer() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/analyzer-start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      let data: any = null;

      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok) {
        throw new Error(data?.error || "Analyzer failed to start");
      }

      if (!data?.analyzer_session_id) {
        throw new Error("Missing analyzer session ID");
      }

      router.push(`/dashboard/analyzer-results/${data.analyzer_session_id}`);
    } catch (err: any) {
      console.error("Analyzer error:", err);
      setError("Analyzer failed to start. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">
          Run 3B Analyzer Blueprint
        </h1>
        <p className="text-sm text-muted-foreground">
          This analyzer scans your credit data and generates a structured,
          compliance-driven dispute plan. No disputes are sent automatically.
        </p>
      </header>

      <button
        onClick={handleRunAnalyzer}
        disabled={loading}
        className="inline-flex items-center justify-center rounded-xl
          bg-neon-teal px-6 py-3 font-semibold text-black
          transition disabled:opacity-50 disabled:cursor-not-allowed
          hover:brightness-110 active:scale-[0.98]"
      >
        {loading ? "Running Analyzer…" : "Run Analyzer"}
      </button>

      {error && (
        <p className="text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
