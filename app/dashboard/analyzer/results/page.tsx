// app/dashboard/analyzer/results/page.tsx

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAnalyzerRunsWithDelta } from "../lib/analyzer-runs";
import ProgressCard from "./components/ProgressCard";
import RerunButton from "./components/RerunButton";

export default async function AnalyzerResultsPage() {
  const supabase = await createClient();

  /* ─────────────────────────────
     1️⃣ AUTH + MONITORING CHECK
  ───────────────────────────── */
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: customer, error } = await supabase
    .from("Customer")
    .select("monitoring_active, analyzer_completed_at")
    .eq("user_id", user.id)
    .single();

  if (error || !customer) redirect("/dashboard");
  if (!customer.monitoring_active) redirect("/start-analysis");
  if (!customer.analyzer_completed_at) redirect("/dashboard/analyzer");

  /* ─────────────────────────────
     2️⃣ GET ANALYZER RUN HISTORY
  ───────────────────────────── */
  const { current, previous } = await getAnalyzerRunsWithDelta(user.id);

  /* ─────────────────────────────
     3️⃣ FETCH REAL ANALYZER RESULTS
     Epic Credit Report items with mail enforcement status
  ───────────────────────────── */
  const { data: analyzerItems } = await supabase
    .from("analyzer_items")
    .select(`
      *,
      mail_evidence:mail_evidence(count)
    `)
    .eq("user_id", user.id)
    .order("impact_score", { ascending: false });

  // Group by AI action
  const autoDispute = analyzerItems?.filter(item => item.ai_action === 'auto_dispute') || [];
  const recommendDispute = analyzerItems?.filter(item => item.ai_action === 'recommend_dispute') || [];
  const monitor = analyzerItems?.filter(item => item.ai_action === 'monitor') || [];
  const violations = analyzerItems?.filter(item => item.procedural_violation === true) || [];

  const results = {
    sectionA: {
      title: "Procedural Violations (Auto-Dispute)",
      summary: `${violations.length} items with documented violations - ready for immediate legal action`,
      items: violations.slice(0, 5).map(item => 
        `${item.account_name} - ${item.next_action || 'FCRA violation documented'}`
      ),
      count: violations.length,
    },
    sectionB: {
      title: "Recommended Disputes",
      summary: `${recommendDispute.length} items flagged by AI for dispute consideration`,
      items: recommendDispute.slice(0, 5).map(item => 
        `${item.account_name} - ${item.dispute_ground || 'Verification questionable'}`
      ),
      count: recommendDispute.length,
    },
    sectionC: {
      title: "Monitor Items",
      summary: `${monitor.length} items under watch for changes or opportunities`,
      items: monitor.slice(0, 5).map(item => 
        `${item.account_name} - Monitoring for updates`
      ),
      count: monitor.length,
    },
  };

  /* ─────────────────────────────
     4️⃣ RESULTS UI
  ───────────────────────────── */
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* HEADER */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Your Credit Analyzer Results
            </h1>
            <p className="mt-2 text-gray-300 max-w-3xl">
              We reviewed your full credit data and grouped what we found into
              three clear sections. This helps you understand what can be fixed
              now versus what needs strategy.
            </p>
          </div>

          <RerunButton memberId={user.id} />
        </div>

        {/* PROGRESS SINCE LAST CHECK */}
        {current && previous && (
          <ProgressCard current={current} previous={previous} />
        )}

        {/* RESULTS SECTIONS */}
        <div className="mt-10 space-y-8">
          <ResultSection {...results.sectionA} />
          <ResultSection {...results.sectionB} />
          <ResultSection {...results.sectionC} />
        </div>

        {/* NEXT STEPS */}
        <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold">
            What Happens Next
          </h2>

          <p className="mt-2 text-gray-300 max-w-3xl">
            Based on what we found, you can now choose how hands-on you want to
            be. Nothing happens automatically — you stay in control.
          </p>

          <div className="mt-6 flex flex-col md:flex-row gap-4">
            <a
              href="/dashboard"
              className="rounded-xl px-6 py-3 text-center font-semibold
                         bg-gradient-to-r from-teal-500 to-blue-500
                         hover:from-teal-400 hover:to-blue-400 transition"
            >
              Choose a Plan & Start Fixing
            </a>

            <a
              href="/dashboard/unclaimed"
              className="rounded-xl px-6 py-3 text-center font-semibold
                         bg-white/10 hover:bg-white/15 border border-white/10"
            >
              Check for Unclaimed Property
            </a>
          </div>

          <p className="mt-4 text-xs text-gray-400">
            Disputes and recovery actions only start after you explicitly opt in.
          </p>
        </div>
      </div>
    </main>
  );
}

/* ───────── UI COMPONENT ───────── */

function ResultSection({
  title,
  summary,
  items,
  count,
}: {
  title: string;
  summary: string;
  items: string[];
  count?: number;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-start justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        {count !== undefined && (
          <div className="bg-teal-500/20 text-teal-400 px-3 py-1 rounded-full text-sm font-bold">
            {count} items
          </div>
        )}
      </div>
      <p className="mt-2 text-gray-300">{summary}</p>

      <ul className="mt-4 space-y-2 text-sm text-gray-300">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </section>
  );
}
