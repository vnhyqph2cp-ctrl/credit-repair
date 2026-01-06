import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function CreditBuilderCardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-16">

        {/* HERO */}
        <section className="text-center max-w-3xl mx-auto">
          <span className="inline-block mb-4 rounded-full px-4 py-2 text-sm font-semibold
            bg-teal-500/10 text-teal-400 border border-teal-500/20">
            BUILD PHASE TOOL
          </span>

          <h1 className="text-4xl font-extrabold tracking-tight">
            Build Positive Credit — Starting Today
          </h1>

          <p className="mt-4 text-lg text-gray-400">
            A secured credit card designed to help establish on-time payment
            history and report responsible usage to all three major credit bureaus.
          </p>

          <a
            href="https://www.creditbuildercard.com/bouncebackcreditrepair"
            target="_blank"
            rel="nofollow noopener"
            className="
              inline-block mt-8 rounded-xl px-8 py-4 text-base font-semibold
              bg-gradient-to-r from-teal-500 to-blue-500 text-black
              shadow-[0_0_30px_rgba(20,184,166,0.35)]
            "
          >
            Apply for Credit Builder Card
          </a>

          <p className="mt-3 text-xs text-gray-500">
            Trusted partner • No hard inquiry to apply
          </p>
        </section>

        {/* DETAILS CARD */}
        <section className="mt-16 rounded-2xl border border-white/10
          bg-gradient-to-br from-slate-900 to-black p-8 shadow-xl">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

            {/* LEFT */}
            <div>
              <h2 className="text-2xl font-bold mb-4">
                How This Card Helps
              </h2>

              <p className="text-gray-400 mb-6">
                This is a secured credit card built specifically for people
                rebuilding or establishing credit. Responsible usage can help
                strengthen your profile over time.
              </p>

              <ul className="space-y-3 text-sm text-gray-300 list-disc list-inside">
                <li>Reports to Experian, Equifax, and TransUnion</li>
                <li>No traditional credit check required</li>
                <li>Your refundable deposit becomes your credit limit</li>
                <li>Designed for rebuilds, thin files, or restarts</li>
              </ul>
            </div>

            {/* RIGHT */}
            <div className="rounded-xl border border-white/10 bg-black/40 p-6">
              <h3 className="font-semibold mb-3">
                Best Practices (Important)
              </h3>

              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Keep utilization under 30%</li>
                <li>• Make payments before the statement date</li>
                <li>• Never miss a due date</li>
                <li>• Use consistently, not aggressively</li>
              </ul>

              <a
                href="/dashboard/action-plan"
                className="
                  inline-block mt-6 rounded-xl px-5 py-3 text-sm font-semibold
                  bg-white/10 border border-white/10 hover:bg-white/15
                "
              >
                Back to Action Plan
              </a>
            </div>

          </div>
        </section>

        {/* DISCLAIMER */}
        <p className="mt-16 text-xs text-gray-500 text-center max-w-3xl mx-auto leading-relaxed">
          Affiliate disclosure: We may receive compensation if you apply through
          this link. This product is a credit-building tool and does not remove
          negative items from your credit report. Credit improvement depends on
          responsible usage, reporting accuracy, and time. No specific outcomes
          are guaranteed.
        </p>

      </div>
    </main>
  );
}
