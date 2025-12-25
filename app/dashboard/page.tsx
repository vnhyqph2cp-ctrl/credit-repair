// app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { getDashboardState } from "@/lib/dashboard";

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

  // No snapshot / MFSN not connected yet
  if (!state.hasReport) {
    return (
      <main className="min-h-screen bg-black text-white p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-black">Connect MyFreeScoreNow</h1>
          <p className="text-slate-300 mt-2">
            Connect MyFreeScoreNow to pull your Snapshot and scores into 3B Credit
            Builder.
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
              We securely pull your Snapshot and scores, then unlock your personalized
              dashboard with analysis, dispute planning, and funding readiness — all in
              a calm, guided experience.
            </p>
          </section>
        </div>
      </main>
    );
  }

  // Snapshot/report exists
  const plan = state.plan as "basic" | "analyzer" | "welcome" | "ultimate";

  return (
    <main className="min-h-screen bg-black text-white p-6 space-y-6">
      {/* Scores / Snapshot summary */}
      <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
        <div className="text-lg font-black">Your Snapshot is Ready</div>
        <div className="mt-3 text-slate-300">
          TU: {state.report?.score_tu ?? "--"} • EQF: {state.report?.score_eq ?? "--"}{" "}
          • EXP: {state.report?.score_ex ?? "--"}
        </div>
      </section>

      {plan === "basic" && (
        <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
          <div className="font-black">Upgrade to see your AI analysis</div>
          <p className="text-slate-400 mt-2">
            Analysis, dispute plan, and letters are locked on Basic. Upgrade to unlock a
            guided dispute strategy built on your Snapshot.
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
              Your Snapshot has been processed. This section will summarize what is most
              important to dispute first.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
            <div className="font-black">Generate Plan</div>
            <p className="text-slate-400 mt-2">
              When enabled, this will build your dispute timeline and rounds based on
              your Snapshot and goals.
            </p>
            <button className="mt-4 rounded-full bg-cyan-500/15 border border-cyan-400/30 px-5 py-2 font-black text-cyan-200">
              Generate Plan →
            </button>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
            <div className="font-black">Letters</div>
            <p className="text-slate-400 mt-2">
              Download-only letters will appear here as your disputes are prepared.
            </p>
          </section>
        </>
      )}

      {plan === "ultimate" && (
        <>
          <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
            <div className="font-black">Analysis + Plan</div>
            <p className="text-slate-400 mt-2">
              Your analysis and dispute roadmap are fully unlocked for this account.
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

          <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
            <div className="font-black">Funding / 700+ Section</div>
            <p className="text-slate-400 mt-2">
              Funding readiness, limits, and 700+ strategy will be surfaced here once
              your Snapshot and disputes are on track.
            </p>
          </section>
        </>
      )}
    </main>
  );
}
