// app/dashboard/plans/actions.ts

"use server";

import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export async function createCheckoutSession(tier: "basic" | "standard" | "works") {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const lookup: Record<string, string> = {
    basic: "plan_basic_monthly",
    standard: "plan_standard_monthly",
    works: "plan_works_monthly",
  };

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: lookup[tier], quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard?upgrade=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard/plans`,
    metadata: { user_id: user.id, plan_tier: tier },
  });

  return { url: session.url };
}
