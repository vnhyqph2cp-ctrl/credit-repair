// app/dashboard/plans/PlanCard.tsx

"use client";

import { useState } from "react";
import { createCheckoutSession } from "./actions";

type PlanTier = "basic" | "standard" | "works";

export default function PlanCard({
  title,
  tier,
  price,
  bullets,
  current,
}: {
  title: string;
  tier: PlanTier;
  price: string;
  bullets: string[];
  current: PlanTier;
}) {
  const [loading, setLoading] = useState(false);
  const isCurrent = tier === current;
  const isHighlighted = tier === "works";

  async function handleUpgrade() {
    setLoading(true);
    try {
      const { url } = await createCheckoutSession(tier);
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Failed to start checkout. Please try again.");
      setLoading(false);
    }
  }

  return (
    <section
      className={`rounded-2xl border p-6 ${
        isHighlighted
          ? "border-teal-500/30 bg-gradient-to-br from-teal-500/10 to-blue-500/10"
          : "border-white/10 bg-white/5"
      }`}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        {isCurrent && (
          <span className="text-xs rounded-full px-2 py-1 bg-teal-500/20 border border-teal-500/30 text-teal-400">
            Current
          </span>
        )}
      </div>

      <div className="mt-2 text-3xl font-bold">{price}</div>

      <ul className="mt-6 space-y-2 text-sm text-gray-300">
        {bullets.map((b) => (
          <li key={b}>• {b}</li>
        ))}
      </ul>

      <button
        onClick={handleUpgrade}
        disabled={isCurrent || loading}
        className={`mt-6 w-full rounded-xl px-4 py-3 font-semibold transition
          ${
            isCurrent || loading
              ? "bg-white/5 border border-white/10 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-400 hover:to-blue-400"
          }`}
      >
        {loading ? "Loading..." : isCurrent ? "Current Plan" : "Upgrade Now"}
      </button>
    </section>
  );
}
