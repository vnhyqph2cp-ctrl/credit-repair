// app/dashboard/unclaimed/components/OfferCard.tsx

"use client";

import { useState } from "react";
import ConsentModal from "./ConsentModal";

export default function OfferCard({ match }: { match: any }) {
  const [open, setOpen] = useState(false);

  const fee = Number((match.amount * 0.1).toFixed(2));
  const net = Number((match.amount - fee).toFixed(2));

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="text-sm text-gray-400">{match.state}</div>
      <div className="text-lg font-semibold mt-1">
        {match.propertyType}
      </div>

      <div className="mt-3 space-y-1 text-sm text-gray-300">
        <div>Holder: {match.holder}</div>
        <div>Reported: {match.yearReported}</div>
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-black/40 p-4">
        <div className="flex justify-between text-sm">
          <span>Gross Amount</span>
          <span className="font-semibold">${match.amount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-400">
          <span>3B Fee (10%)</span>
          <span>− ${fee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm mt-2">
          <span>You Receive</span>
          <span className="font-semibold">${net.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        <button
          onClick={() => setOpen(true)}
          className="rounded-xl px-4 py-3 text-center font-semibold
                     bg-gradient-to-r from-teal-500 to-blue-500
                     hover:from-teal-400 hover:to-blue-400 transition"
        >
          Review & Accept Offer
        </button>

        <a
          href="https://unclaimed.org"
          target="_blank"
          className="text-center text-sm text-blue-400 underline"
        >
          Claim this directly from the state for free
        </a>
      </div>

      {open && (
        <ConsentModal
          match={match}
          fee={fee}
          onClose={() => setOpen(false)}
        />
      )}
    </section>
  );
}
