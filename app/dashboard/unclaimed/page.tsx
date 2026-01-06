// app/dashboard/unclaimed/page.tsx

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import OfferCard from "./components/OfferCard";

export default async function UnclaimedPage() {
  const supabase = await createClient();

  /* ─────────────────────────────
     AUTH + GATES
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
     MOCK UNCLAIMED MATCHES (v1)
  ───────────────────────────── */
  const mockMatches = [
    {
      id: "nv-001",
      state: "Nevada",
      holder: "Former Utility Provider",
      propertyType: "Utility Deposit",
      amount: 842.17,
      yearReported: 2019,
    },
    {
      id: "ca-002",
      state: "California",
      holder: "Old Employer",
      propertyType: "Unpaid Wages",
      amount: 1260.5,
      yearReported: 2018,
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* HEADER */}
        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Unclaimed Property</h1>
            <a
              href="/dashboard/unclaimed/claims"
              className="rounded-lg px-4 py-2 text-sm font-semibold
                         bg-white/10 hover:bg-white/15 border border-white/10 transition"
            >
              View My Claims
            </a>
          </div>
          <p className="mt-2 text-gray-300 max-w-3xl">
            States hold billions in forgotten money. Based on your profile, we
            found potential matches. You decide if you want help recovering
            them.
          </p>
        </div>

        {/* EDUCATION */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-gray-300">
          <ul className="space-y-2">
            <li>• You can always claim directly from the state for free.</li>
            <li>• Our service is optional and success-based only.</li>
            <li>• If you choose 3B, our fee is a flat 10% — only if you get paid.</li>
          </ul>
        </div>

        {/* OFFERS */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockMatches.map((m) => (
            <OfferCard key={m.id} match={m} />
          ))}
        </div>
      </div>
    </main>
  );
}
