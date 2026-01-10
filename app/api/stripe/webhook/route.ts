import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createServerSupabase } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-11-20",
  });

  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  // Verify event first (pseudo-example, adjust to your setup)
  let event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Use Supabase server client
  const supabase = await createServerSupabase();

  // TODO: handle event types here (checkout.session.completed, etc.)
  // e.g. write to Supabase

  return NextResponse.json({ received: true });
}
