/**
 * Admin - Analyzer Rules Editor
 * 
 * Control plane for dispute suggestion logic.
 * No user access. Service role only.
 */

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getRules, seedRules } from "./actions";
import RulesTable from "./components/RulesTable";
import { getSessionCustomer, isAdmin } from "@/lib/auth";

export default async function AnalyzerRulesAdminPage() {
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
  // if (profile?.role !== "admin") redirect("/dashboard");

  /* ─────────────────────────────
     2️⃣ LOAD RULES
  ───────────────────────────── */
  const rules = await getRules();

  /* ─────────────────────────────
     3️⃣ UI
  ───────────────────────────── */
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Analyzer Rules Editor</h1>
          <p className="mt-2 text-sm text-gray-400">
            Control what becomes a dispute suggestion. Changes apply immediately to new analyzer runs.
          </p>
        </div>

        {/* STATS */}
        <div className="mb-6 grid grid-cols-4 gap-4">
          <StatCard
            label="Total Rules"
            value={rules.length}
            color="blue"
          />
          <StatCard
            label="Enabled"
            value={rules.filter(r => r.enabled).length}
            color="green"
          />
          <StatCard
            label="Section A"
            value={rules.filter(r => r.analyzerSection === 'A').length}
            color="amber"
          />
          <StatCard
            label="Section B+C"
            value={rules.filter(r => r.analyzerSection !== 'A').length}
            color="purple"
          />
        </div>

        {/* SEED BUTTON (if no rules) */}
        {rules.length === 0 && (
          <div className="mb-6 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
            <p className="text-sm text-yellow-300">
              No rules found. Seed default rules to get started.
            </p>
            <form action={seedRules} className="mt-2">
              <button
                type="submit"
                className="rounded bg-yellow-600 px-4 py-2 text-sm font-semibold hover:bg-yellow-500"
              >
                Seed Default Rules
              </button>
            </form>
          </div>
        )}

        {/* RULES TABLE */}
        <RulesTable rules={rules} />

        {/* COMPLIANCE NOTE */}
        <div className="mt-8 rounded-lg border border-white/10 bg-white/5 p-4">
          <h3 className="text-sm font-semibold">Compliance Notes</h3>
          <ul className="mt-2 space-y-1 text-xs text-gray-400">
            <li>• Rules determine which items become dispute suggestions</li>
            <li>• All rule changes are logged with timestamps</li>
            <li>• Disabling a rule does not delete existing suggestions</li>
            <li>• Section assignments control analyzer categorization (A=errors, B=structure, C=history)</li>
            <li>• Default rounds guide users but do not auto-send disputes</li>
          </ul>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: 'blue' | 'green' | 'amber' | 'purple';
}) {
  const colorClasses = {
    blue: 'border-blue-500/30 bg-blue-500/10',
    green: 'border-green-500/30 bg-green-500/10',
    amber: 'border-amber-500/30 bg-amber-500/10',
    purple: 'border-purple-500/30 bg-purple-500/10',
  };

  return (
    <div className={`rounded-lg border p-4 ${colorClasses[color]}`}>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}
