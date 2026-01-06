// app/dashboard/unclaimed/claims/ClaimCard.tsx

"use client";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Authorized",
  CLAIMED: "Submitted to State",
  REJECTED: "Closed",
  FUNDED: "Paid",
};

const STATUS_ORDER = ["PENDING", "CLAIMED", "FUNDED"];

export default function ClaimCard({ claim }: { claim: any }) {
  const currentIndex = STATUS_ORDER.indexOf(claim.status);
  const agreement = claim.unclaimedAgreements?.[0];
  const amountDollars = claim.amountCents / 100;
  const fee = agreement?.feePercentage
    ? (amountDollars * agreement.feePercentage) / 100
    : 0;
  const netAmount = amountDollars - fee;

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="text-sm text-gray-400">{claim.state}</div>
          <div className="text-lg font-semibold">{claim.assetType}</div>
          <div className="mt-1 text-sm text-gray-300">
            Holder: {claim.holder}
          </div>
          {claim.metadata?.yearReported && (
            <div className="text-xs text-gray-400">
              Reported: {claim.metadata.yearReported}
            </div>
          )}
        </div>

        <div className="text-right">
          <div className="text-sm text-gray-400">Gross Amount</div>
          <div className="text-lg font-semibold">
            ${amountDollars.toFixed(2)}
          </div>
          {fee > 0 && (
            <div className="text-xs text-gray-400">
              You receive: ${netAmount.toFixed(2)}
            </div>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="mt-6">
        <div className="flex items-center gap-2 overflow-x-auto">
          {STATUS_ORDER.map((s, i) => {
            const done = i <= currentIndex;
            const isCurrent = s === claim.status;
            return (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`h-3 w-3 rounded-full ${
                    done
                      ? isCurrent
                        ? "bg-teal-400 ring-2 ring-teal-400 ring-offset-2 ring-offset-black"
                        : "bg-teal-400"
                      : "bg-gray-600"
                  }`}
                />
                <div
                  className={`text-xs whitespace-nowrap ${
                    done ? "text-white" : "text-gray-400"
                  }`}
                >
                  {STATUS_LABELS[s]}
                </div>
                {i < STATUS_ORDER.length - 1 && (
                  <div
                    className={`h-px w-6 ${
                      done ? "bg-teal-400" : "bg-gray-700"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-3 text-xs text-gray-400">
          Current status:{" "}
          <span className="text-white">{STATUS_LABELS[claim.status]}</span>
          {agreement?.signedAt && (
            <span className="ml-3">
              • Authorized on{" "}
              {new Date(agreement.signedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {/* Status-specific messages */}
      {claim.status === "PENDING" && (
        <div className="mt-4 rounded-lg bg-blue-500/10 border border-blue-500/20 p-3 text-xs text-blue-300">
          We're preparing your claim documents. No action required from you.
        </div>
      )}

      {claim.status === "CLAIMED" && (
        <div className="mt-4 rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-300">
          Submitted to {claim.state} treasury. Processing typically takes 4-8
          weeks.
        </div>
      )}

      {claim.status === "FUNDED" && (
        <div className="mt-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-300">
          Paid! You should receive your portion (${netAmount.toFixed(2)}) within
          7-10 business days.
        </div>
      )}

      {claim.status === "REJECTED" && (
        <div className="mt-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-300">
          This claim could not be processed. No fee was charged.
        </div>
      )}

      <div className="mt-4 text-xs text-gray-400">
        Updates reflect official state processing timelines. We'll notify you if
        action is required.
      </div>
    </section>
  );
}
