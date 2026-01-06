// app/dashboard/disputes/generate/GeneratorForm.tsx

"use client";

import { useState, useEffect } from "react";
import { generateDispute } from "../actions";

export default function GeneratorForm({ plan }: { plan: string }) {
  const [voice, setVoice] = useState("standard");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState({
    bureau: "",
    creditor: "",
    reason: "",
  });

  // Auto-populate from URL params (deep-link support)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bureau = params.get("bureau");
    const creditor = params.get("creditor");
    const reason = params.get("reason");

    if (bureau || creditor || reason) {
      setContext({
        bureau: bureau || "",
        creditor: creditor || "",
        reason: reason || "",
      });
    }
  }, []);

  const voices =
    plan === "works"
      ? ["standard", "smitty", "darain"]
      : ["standard"];

  async function handleGenerate() {
    setLoading(true);
    try {
      // Use context from URL params or defaults
      const disputeContext = context.bureau && context.creditor && context.reason
        ? context
        : {
            bureau: "Equifax",
            creditor: "Capital One",
            reason: "Inaccurate balance reported - showing $1,500 but account was paid in full",
          };

      const text = await generateDispute({ 
        voice: voice as any,
        context: disputeContext 
      });
      setResult(text);
    } catch (error) {
      console.error("Failed to generate:", error);
      alert("Failed to generate. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 space-y-6">
      {/* Show pre-filled context if available */}
      {context.bureau && context.creditor && (
        <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-4">
          <div className="text-sm font-semibold text-teal-400 mb-2">Pre-filled from analyzer:</div>
          <div className="text-sm text-gray-300 space-y-1">
            <div><strong>Bureau:</strong> {context.bureau}</div>
            <div><strong>Creditor:</strong> {context.creditor}</div>
            <div><strong>Reason:</strong> {context.reason}</div>
          </div>
        </div>
      )}
      {plan === "works" && (
        <div>
          <label className="text-sm text-gray-300">Dispute Style</label>
          <select
            value={voice}
            onChange={(e) => setVoice(e.target.value)}
            className="mt-2 w-full rounded-xl bg-black border border-white/10 p-3 text-white"
          >
            {voices.map((v) => (
              <option key={v} value={v}>
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full rounded-xl px-4 py-3 font-semibold
                   bg-gradient-to-r from-teal-500 to-blue-500
                   hover:from-teal-400 hover:to-blue-400 transition
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Generating..." : "Generate Letter"}
      </button>

      {result && (
        <div className="space-y-3">
          <textarea
            readOnly
            value={result}
            rows={16}
            className="w-full rounded-xl bg-black border border-white/10 p-4 text-sm font-mono"
          />
          
          <div className="flex gap-3">
            <button
              onClick={() => {
                const blob = new Blob([result], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `dispute-letter-${voice}-${Date.now()}.txt`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="flex-1 rounded-xl px-4 py-3 font-semibold
                         bg-white/10 hover:bg-white/15 border border-white/10 transition"
            >
              Download Letter
            </button>
            
            <button
              onClick={() => setResult(null)}
              className="rounded-xl px-4 py-3 font-semibold
                         bg-white/5 border border-white/10 hover:bg-white/10 transition"
            >
              Generate New
            </button>
          </div>

          <p className="text-xs text-gray-400">
            Review carefully, print, and mail via certified mail. Keep a copy for your records.
          </p>
        </div>
      )}
    </div>
  );
}
