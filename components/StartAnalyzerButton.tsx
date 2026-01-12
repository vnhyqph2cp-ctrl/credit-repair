"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function StartAnalyzerButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    if (loading) return; // hard guard
    setLoading(true);

    try {
      const res = await fetch("/api/analyzer-start", {
        method: "POST",
        credentials: "include", // 🔐 ensure auth cookies are sent
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Analyzer start failed:", text);
        setLoading(false);
        return;
      }

      const json = await res.json();
      const sessionId = json.analyzer_session_id as string;

      if (!sessionId) {
        console.error("Analyzer start returned no session id");
        setLoading(false);
        return;
      }

      // ✅ standard client redirect
      router.push(
        `/dashboard/analyzer-results?session_id=${encodeURIComponent(
          sessionId
        )}`
      );
    } catch (err) {
      console.error("Failed to start analyzer:", err);
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="btn btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? "Starting Analysis…" : "Run Credit Analyzer"}
    </button>
  );
}
