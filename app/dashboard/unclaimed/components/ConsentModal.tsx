"use client";

import { useState } from "react";
import { acceptUnclaimedConsent } from "../actions";

export default function ConsentModal({
  match,
  fee,
  onClose,
}: {
  match: any;
  fee: number;
  onClose: () => void;
}) {
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAccept() {
    setAccepting(true);
    setError(null);
    
    const result = await acceptUnclaimedConsent({
      propertyId: match.id,
      finderFeePercent: fee,
    });

    if (result.success) {
      alert("Consent accepted! We'll begin the recovery process.");
      onClose();
    } else {
      setError(result.error || "Failed to accept consent");
      setAccepting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-black border border-white/10 rounded-2xl p-6 max-w-md">
        <h2 className="text-xl font-semibold">
          Authorization to Recover Unclaimed Property
        </h2>

        <div className="mt-4 text-sm text-gray-300 space-y-2">
          <p>
            You authorize us to research, file claims, and recover unclaimed property on your behalf.
          </p>
          <p>
            <strong>Finder Fee:</strong> {fee}% of recovered amount (Nevada cap: 10%)
          </p>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 btn"
            disabled={accepting}
          >
            Cancel
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 btn glow-neon"
            disabled={accepting}
          >
            {accepting ? "Processing..." : "Accept & Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
