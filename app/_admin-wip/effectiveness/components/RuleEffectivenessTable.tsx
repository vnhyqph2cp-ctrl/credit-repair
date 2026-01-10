"use client";

/**
 * Rule Effectiveness Table
 */

import { RuleEffectiveness } from "@/lib/dispute-outcomes";

interface RuleEffectivenessTableProps {
  rules: RuleEffectiveness[];
}

export default function RuleEffectivenessTable({ rules }: RuleEffectivenessTableProps) {
  if (rules.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
        <p className="text-gray-400">No dispute outcomes recorded yet.</p>
        <p className="mt-2 text-xs text-gray-500">
          Data will appear as users record dispute results.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-white/10 bg-white/5">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">
                Rule Key
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">
                Description
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400">
                Total Disputes
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400">
                Removed
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400">
                Verified
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400">
                Success Rate
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400">
                Avg Days
              </th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule) => (
              <tr key={rule.ruleKey} className="border-b border-white/10 hover:bg-white/5">
                <td className="px-4 py-3">
                  <code className="text-xs text-gray-400">{rule.ruleKey}</code>
                </td>
                <td className="px-4 py-3 text-sm">{rule.description}</td>
                <td className="px-4 py-3 text-center text-sm">{rule.totalDisputes}</td>
                <td className="px-4 py-3 text-center">
                  <span className="inline-block rounded bg-green-500/20 px-2 py-1 text-xs font-semibold text-green-400">
                    {rule.removed}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="inline-block rounded bg-red-500/20 px-2 py-1 text-xs font-semibold text-red-400">
                    {rule.verified}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <SuccessRateBadge rate={rule.successRate} />
                </td>
                <td className="px-4 py-3 text-center text-sm text-gray-400">
                  {rule.avgDaysToResolve ? `${rule.avgDaysToResolve.toFixed(0)}d` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SuccessRateBadge({ rate }: { rate: number }) {
  let color = 'text-red-400 bg-red-500/20';
  if (rate >= 70) {
    color = 'text-green-400 bg-green-500/20';
  } else if (rate >= 50) {
    color = 'text-blue-400 bg-blue-500/20';
  } else if (rate >= 30) {
    color = 'text-amber-400 bg-amber-500/20';
  }

  return (
    <span className={`inline-block rounded px-2 py-1 text-xs font-semibold ${color}`}>
      {rate.toFixed(1)}%
    </span>
  );
}
