// app/dashboard/disputes/generate/page.tsx

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import GeneratorForm from "./GeneratorForm";

export default async function GenerateDisputePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: customer } = await supabase
    .from("Customer")
    .select("monitoring_active, analyzer_completed_at, plan_tier")
    .eq("user_id", user.id)
    .single();

  if (!customer?.monitoring_active) redirect("/start-analysis");
  if (!customer?.analyzer_completed_at) redirect("/dashboard/analyzer");

  if (customer.plan_tier === "basic") {
    redirect("/dashboard/plans");
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-3xl font-bold">Generate Dispute Letter</h1>
        <p className="mt-2 text-gray-300">
          This tool generates a personalized dispute letter. You review,
          download, and mail it yourself.
        </p>

        <GeneratorForm plan={customer.plan_tier} />
      </div>
    </main>
  );
}
