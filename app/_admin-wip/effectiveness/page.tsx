/**
 * Admin - Dispute Effectiveness Dashboard
 * 
 * Shows which rules/rounds are most effective at getting results.
 * Feedback loop for analyzer rule tuning.
 */

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getEffectivenessMetrics } from "./actions";
import RuleEffectivenessTable from "./components/RuleEffectivenessTable";
import RoundStatsCards from "./components/RoundStatsCards";
import { getSessionCustomer, isAdmin } from "@/lib/auth";

export default async function EffectivenessDashboardPage() {
  /* ─────────────────────────────
     1️⃣ AUTH CHECK (ADMIN ONLY)
  ───────────────────────────── */
  const customer = await getSessionCustomer();
  
  if (!customer) {
    redirect("/login");
  }

  if (!(await isAdmin(customer))) {
    redirect("/dashboard");
  }

  /* ─────────────────────────────
     2️⃣ LOAD METRICS
  ───────────────────────────── */
  const { ruleEffectiveness, roundStats } = await getEffectivenessMetrics();

  /* ─────────────────────────────
     3️⃣ UI
  ───────────────────────────── */
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dispute Effectiveness Dashboard</h1>
          <p className="mt-2 text-sm text-gray-400">
            Measure which analyzer rules and dispute rounds generate the best outcomes.
          </p>
        </div>

        {/* ROUND PERFORMANCE */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Performance by Round</h2>
          <RoundStatsCards roundStats={roundStats} />
        </div>

        {/* RULE EFFECTIVENESS */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Rule Effectiveness</h2>
          <RuleEffectivenessTable rules={ruleEffectiveness} />
        </div>

        {/* INSIGHTS */}
        {ruleEffectiveness.length > 0 && (
          <div className="mt-8 rounded-lg border border-white/10 bg-white/5 p-6">
            <h3 className="text-sm font-semibold">Key Insights</h3>
            <div className="mt-4 space-y-3 text-sm text-gray-300">
              <div>
                <strong className="text-white">Top Performer:</strong>{' '}
                {ruleEffectiveness[0].ruleKey} with {ruleEffectiveness[0].successRate.toFixed(1)}% success rate
                ({ruleEffectiveness[0].removed} removed out of {ruleEffectiveness[0].totalDisputes} disputes)
              </div>
              
              {ruleEffectiveness.filter(r => r.successRate < 30).length > 0 && (
                <div>
                  <strong className="text-yellow-400">Low Performers:</strong>{' '}
                  {ruleEffectiveness.filter(r => r.successRate < 30).length} rules have success rates below 30%.
                  Consider disabling or revising these rules.
                </div>
              )}

              <div>
                <strong className="text-white">Round Optimization:</strong>{' '}
                Round {Object.entries(roundStats).sort((a, b) => b[1].successRate - a[1].successRate)[0]?.[0] || 1} has the highest success rate.
              </div>
            </div>
          </div>
        )}

        {/* COMPLIANCE NOTE */}
        <div className="mt-8 rounded-lg border border-white/10 bg-white/5 p-4">
          <h3 className="text-sm font-semibold">Using This Data</h3>
          <ul className="mt-2 space-y-1 text-xs text-gray-400">
            <li>• <strong>Success Rate</strong> = (Removed + No Response) / Total disputes</li>
            <li>• <strong>Disable low performers</strong> — Rules consistently below 30% may need revision</li>
            <li>• <strong>Promote high performers</strong> — Consider suggesting these earlier (Round 1 vs 2/3)</li>
            <li>• <strong>Round timing</strong> — If Round 1 outperforms Round 2/3, focus energy on initial disputes</li>
            <li>• All metrics are historical. Past performance doesn't guarantee future results.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
