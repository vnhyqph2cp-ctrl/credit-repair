/**
 * Progress Card - Shows delta between current and previous analyzer run
 */

import { AnalyzerRunWithDelta, getDeltaExplanation } from "../../lib/analyzer-runs";
import { formatDistanceToNow } from "date-fns";

interface ProgressCardProps {
  current: AnalyzerRunWithDelta;
  previous: AnalyzerRunWithDelta;
}

export default function ProgressCard({ current, previous }: ProgressCardProps) {
  if (!current.delta) return null;

  const { delta } = current;
  const explanation = getDeltaExplanation(delta);

  return (
    <div className="mt-8 rounded-2xl border border-teal-500/30 bg-gradient-to-br from-teal-500/10 to-blue-500/10 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Progress Since Last Check</h2>
        <span className="text-sm text-gray-400">
          Last run: {formatDistanceToNow(previous.createdAt, { addSuffix: true })}
        </span>
      </div>

      {/* Average Score Delta */}
      <div className="mt-6 flex items-center gap-4">
        <div>
          <p className="text-sm text-gray-400">Average Score</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold">
              {current.snapshot.scoreAvg ?? "—"}
            </span>
            {delta.scoreAvg !== 0 && (
              <span
                className={`text-lg font-semibold ${
                  delta.scoreAvg > 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {delta.scoreAvg > 0 ? "+" : ""}
                {delta.scoreAvg}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bureau Breakdown */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <BureauDelta
          bureau="Equifax"
          current={current.snapshot.scoreEq}
          delta={delta.scoreEq}
        />
        <BureauDelta
          bureau="Experian"
          current={current.snapshot.scoreEx}
          delta={delta.scoreEx}
        />
        <BureauDelta
          bureau="TransUnion"
          current={current.snapshot.scoreTu}
          delta={delta.scoreTu}
        />
      </div>

      {/* Key Changes */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <MetricDelta
          label="Negative Items"
          current={current.snapshot.negativesCount}
          delta={delta.negativesCount}
          inverse // Fewer is better
        />
        <MetricDelta
          label="Utilization"
          current={`${current.snapshot.utilizationPct.toFixed(1)}%`}
          delta={delta.utilizationPct}
          inverse // Lower is better
          suffix="%"
        />
        <MetricDelta
          label="Hard Inquiries"
          current={current.snapshot.inquiriesCount}
          delta={delta.inquiriesCount}
          inverse // Fewer is better
        />
      </div>

      {/* Explanation */}
      {explanation && (
        <p className="mt-6 text-sm text-gray-300">
          Since your last analysis on{" "}
          <strong>{new Date(previous.createdAt).toLocaleDateString()}</strong>,{" "}
          {explanation}.
        </p>
      )}

      {/* Disclaimer */}
      <p className="mt-4 text-xs text-gray-500">
        Credit changes depend on many factors, including creditor updates and reporting timelines.
      </p>
    </div>
  );
}

function BureauDelta({
  bureau,
  current,
  delta,
}: {
  bureau: string;
  current: number | null;
  delta: number;
}) {
  return (
    <div className="rounded-xl bg-white/5 p-4">
      <p className="text-xs text-gray-400">{bureau}</p>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-lg font-semibold">
          {current ?? "—"}
        </span>
        {delta !== 0 && (
          <span
            className={`text-sm font-medium ${
              delta > 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {delta > 0 ? "↑" : "↓"} {Math.abs(delta)}
          </span>
        )}
      </div>
    </div>
  );
}

function MetricDelta({
  label,
  current,
  delta,
  inverse = false,
  suffix = "",
}: {
  label: string;
  current: string | number;
  delta: number;
  inverse?: boolean;
  suffix?: string;
}) {
  const isImprovement = inverse ? delta < 0 : delta > 0;
  const showDelta = delta !== 0;

  return (
    <div className="rounded-xl bg-white/5 p-4">
      <p className="text-xs text-gray-400">{label}</p>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-lg font-semibold">{current}</span>
        {showDelta && (
          <span
            className={`text-sm font-medium ${
              isImprovement ? "text-green-400" : "text-red-400"
            }`}
          >
            {delta > 0 ? "+" : ""}
            {delta}
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
