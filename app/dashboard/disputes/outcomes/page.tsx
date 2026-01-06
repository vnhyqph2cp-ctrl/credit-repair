/**
 * Dispute Outcomes Page
 * 
 * Shows user their dispute history and results
 */

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMemberOutcomes, getMemberOutcomeStats } from "@/lib/dispute-outcomes";
import OutcomesTable from "./components/OutcomesTable";
import StatsCards from "./components/StatsCards";

export default async function DisputeOutcomesPage() {
  const supabase = await createClient();

  /* ─────────────────────────────
     1️⃣ AUTH CHECK
  ───────────────────────────── */
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  /* ─────────────────────────────
     2️⃣ LOAD OUTCOMES
  ───────────────────────────── */
  const outcomes = await getMemberOutcomes(user.id);
  const stats = await getMemberOutcomeStats(user.id);

  /* ─────────────────────────────
     3️⃣ UI
  ───────────────────────────── */
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dispute Outcomes</h1>
          <p className="mt-2 text-sm text-gray-400">
            Track the results of your disputes. Update outcomes as you receive bureau responses.
          </p>
        </div>

        {/* STATS */}
        <StatsCards stats={stats} />

        {/* OUTCOMES TABLE */}
        <div className="mt-8">
          <OutcomesTable outcomes={outcomes} />
        </div>

        {/* EMPTY STATE */}
        {outcomes.length === 0 && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
            <p className="text-lg font-semibold">No Disputes Recorded Yet</p>
            <p className="mt-2 text-sm text-gray-400">
              When you send disputes, record them here to track outcomes.
            </p>
            <a
              href="/dashboard/disputes"
              className="mt-6 inline-block rounded-xl px-6 py-3 font-semibold
                         bg-gradient-to-r from-teal-500 to-blue-500
                         hover:from-teal-400 hover:to-blue-400 transition"
            >
              View Dispute Templates
            </a>
          </div>
        )}

        {/* COMPLIANCE NOTE */}
        <div className="mt-8 rounded-lg border border-white/10 bg-white/5 p-4">
          <h3 className="text-sm font-semibold">Understanding Outcomes</h3>
          <ul className="mt-2 space-y-1 text-xs text-gray-400">
            <li>• <strong>Removed</strong> — Item deleted from your report (success)</li>
            <li>• <strong>Verified</strong> — Bureau confirmed item is accurate (no change)</li>
            <li>• <strong>Updated</strong> — Item was modified (partial success)</li>
            <li>• <strong>No Response (30+ days)</strong> — Often treated as removal per FCRA</li>
            <li>• <strong>Pending</strong> — Waiting for bureau response (allow 30-45 days)</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
