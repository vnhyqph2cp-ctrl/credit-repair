// app/dashboard/unclaimed/claims/page.tsx

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ClaimCard from "./ClaimCard";

export default async function ClaimsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Gate: must be a customer
  const { data: customer } = await supabase
    .from("Customer")
    .select("id, monitoring_active")
    .eq("user_id", user.id)
    .single();

  if (!customer?.monitoring_active) redirect("/dashboard");

  // Read unclaimed properties + agreements
  const { data: properties, error } = await supabase
    .from("unclaimedProperties")
    .select(`
      unclaimedPropertyId,
      state,
      holder,
      assetType,
      amountCents,
      status,
      createdAt,
      updatedAt,
      metadata,
      unclaimedAgreements (
        signedAt,
        feePercentage
      )
    `)
    .eq("customerId", customer.id)
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Failed to fetch claims:", error);
  }

  const claims = properties?.filter(
    (p) => p.unclaimedAgreements && p.unclaimedAgreements.length > 0
  );

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-bold">Unclaimed Property Claims</h1>
        <p className="mt-2 text-gray-300 max-w-3xl">
          Track the status of each authorized claim. We'll only move forward
          according to the consent you provided.
        </p>

        {(!claims || claims.length === 0) && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-gray-300">
              No claims yet. When you authorize a recovery, it will appear here.
            </p>
            <a
              href="/dashboard/unclaimed"
              className="mt-4 inline-block text-teal-400 hover:text-teal-300"
            >
              View available properties →
            </a>
          </div>
        )}

        <div className="mt-8 space-y-6">
          {claims?.map((claim) => (
            <ClaimCard key={claim.unclaimedPropertyId} claim={claim} />
          ))}
        </div>
      </div>
    </main>
  );
}
