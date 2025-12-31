// app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { getDashboardState } from "@/lib/dashboard";
import { calculateFundingReadiness } from "@/lib/funding/readiness";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const state = await getDashboardState(user.id);

  // Calculate FRS if snapshot exists (safe - won't break if it fails)
  let frsData = null;
  if (state.hasReport) {
    try {
      frsData = await calculateFundingReadiness(user.id);
    } catch (err) {
      console.error("[Dashboard] FRS calculation failed:", err);
      // Graceful degradation - dashboard still works
    }
  }

  // No snapshot / MFSN not connected yet
  if (!state.hasReport) {
    return (
      <main className="min-h-screen bg-black text-white p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-black">Connect MyFreeScoreNow</h1>
          <p className="text-slate-300 mt-2">
            Connect MyFreeScoreNow to pull your Snapshot and scores into 3B
            Credit Builder.
          </p>

          <a
            href="/go/mfsn"
            className="inline-flex mt-6 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 px-6 py-3 font-black text-black hover:opacity-90"
          >
            Start MyFreeScoreNow Snapshot →
          </a>

          <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
            <div className="font-black text-sm text-slate-100">
              What happens after you connect
            </div>
            <p className="text-slate-400 mt-2 text-sm">
              We securely pull your Snapshot and scores, then unlock your
              personalized dashboard with analysis, dispute planning, and
              funding readiness – all in a calm, guided experience.
            </p>
          </section>
        </div>
      </main>
    );
  }

  // Snapshot/report exists
  const plan = state.plan as "basic" | "analyzer" | "welcome" | "ultimate";

  // Band colors
  const bandColors = {
    BUILD: "from-orange-500 to-red-500",
    ALMOST: "from-yellow-500 to-orange-500",
    READY: "from-green-500 to-emerald-500",
  };

  const bandText = {
    BUILD: "Building Foundation",
    ALMOST: "Almost Ready",
    READY: "Funding Ready",
  };

  return (
    <main className="min-h-screen bg-black text-white p-6 space-y-6">
      {/* Scores / Snapshot summary */}
      <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
        <div className="text-lg font-black">Your Snapshot is Ready</div>
        <div className="mt-3 text-slate-300">
          TU: {state.report?.score_tu ?? "--"} • EQF:{" "}
          {state.report?.score_eq ?? "--"} • EXP:{" "}
          {state.report?.score_ex ?? "--"}
        </div>
      </section>

      {/* 3B value explainer */}
      <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
        <div className="font-black text-base">
          What 3B adds beyond monitoring
        </div>
        <p className="text-slate-400 mt-2 text-sm">
          MyFreeScoreNow shows you your 3‑bureau scores and alerts. 3B turns
          that data into a step‑by‑step plan: analysis of what hurts you most,
          dispute options, and a funding readiness score so you always know
          your next move.
        </p>
      </section>

      {/* FRS Display - shown for all users with snapshot */}
      {frsData && (
        <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
          <div className="font-black text-lg">Funding Readiness</div>

          <div className="mt-4 flex items-center gap-6">
            {/* FRS Score Circle */}
            <div className="relative w-24 h-24">
              <div
                className={`absolute inset-0 rounded-full bg-gradient-to-br ${bandColors[frsData.band]} opacity-20`}
              ></div>
              <div className="absolute inset-2 rounded-full bg-black flex items-center justify-center">
                <span className="text-3xl font-black">{frsData.frs}</span>
              </div>
            </div>

            {/* Band & Description */}
            <div className="flex-1">
              <div
                className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${bandColors[frsData.band]} text-black font-black text-sm`}
              >
                {bandText[frsData.band]}
              </div>
              <p className="text-slate-400 mt-2 text-sm">
                {frsData.band === "BUILD" &&
                  "Focus on credit building and reducing utilization to improve your score."}
                {frsData.band === "ALMOST" &&
                  "You're close! A few improvements will unlock better funding options."}
                {frsData.band === "READY" &&
                  "Your profile is strong. Explore personalized funding offers below."}
              </p>
            </div>
          </div>

          {/* Breakdown */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="rounded-lg bg-slate-900/60 p-3">
              <div className="text-xs text-slate-400">Credit</div>
              <div className="font-black text-lg">
                {frsData.breakdown.credit}/30
              </div>
            </div>
            <div className="rounded-lg bg-slate-900/60 p-3">
              <div className="text-xs text-slate-400">Utilization</div>
              <div className="font-black text-lg">
                {frsData.breakdown.utilization}/25
              </div>
            </div>
            <div className="rounded-lg bg-slate-900/60 p-3">
              <div className="text-xs text-slate-400">Clean</div>
              <div className="font-black text-lg">
                {frsData.breakdown.derogatories}/25
              </div>
            </div>
            <div className="rounded-lg bg-slate-900/60 p-3">
              <div className="text-xs text-slate-400">Accounts</div>
              <div className="font-black text-lg">
                {frsData.breakdown.accounts}/10
              </div>
            </div>
            <div className="rounded-lg bg-slate-900/60 p-3">
              <div className="text-xs text-slate-400">Club</div>
              <div className="font-black text-lg">
                {frsData.breakdown.club}/10
              </div>
            </div>
          </div>
        </section>
      )}

      {plan === "basic" && (
        <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
          <div className="font-black">Upgrade to see your AI analysis</div>
          <p className="text-slate-400 mt-2">
            Analysis, dispute plan, and letters are locked on Basic. Upgrade to
            unlock a guided dispute strategy built on your Snapshot.
          </p>
          <a
            className="inline-flex mt-4 rounded-full border border-cyan-400/40 px-5 py-2 font-black text-cyan-200"
            href="/upgrade"
          >
            Upgrade →
          </a>
        </section>
      )}

      {plan === "analyzer" && (
        <>
          <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
            <div className="font-black">Analysis (Unlocked)</div>
            <p className="text-slate-400 mt-2">
              Your disputable items and risk summary will appear here as soon as
              analysis is enabled for your account.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
            <div className="font-black">Plan + Letters (Locked)</div>
            <a
              className="inline-flex mt-4 rounded-full border border-fuchsia-400/40 px-5 py-2 font-black text-fuchsia-200"
              href="/upgrade"
            >
              Upgrade to unlock full dispute plan →
            </a>
          </section>
        </>
      )}

      {plan === "welcome" && (
        <>
          <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
            <div className="font-black">Analysis</div>
            <p className="text-slate-400 mt-2">
              Your Snapshot has been processed. This section will summarize what
              is most important to dispute first.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
            <div className="font-black">Generate Plan</div>
            <p className="text-slate-400 mt-2">
              When enabled, this will build your dispute timeline and rounds
              based on your Snapshot and goals.
            </p>
            <button className="mt-4 rounded-full bg-cyan-500/15 border border-cyan-400/30 px-5 py-2 font-black text-cyan-200">
              Generate Plan →
            </button>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
            <div className="font-black">Letters</div>
            <p className="text-slate-400 mt-2">
              Download-only letters will appear here as your disputes are
              prepared.
            </p>
          </section>
        </>
      )}

      {plan === "ultimate" && (
        <>
          <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
            <div className="font-black">Analysis + Plan</div>
            <p className="text-slate-400 mt-2">
              Your analysis and dispute roadmap are fully unlocked for this
              account.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
            <div className="font-black">Letters</div>
            <div className="flex gap-2 mt-4 flex-wrap">
              <button className="rounded-full bg-white/5 border border-slate-700 px-5 py-2 font-black">
                Download PDF
              </button>
              <button className="rounded-full bg-fuchsia-500/15 border border-fuchsia-400/30 px-5 py-2 font-black text-fuchsia-200">
                Send via LetterStream →
              </button>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
