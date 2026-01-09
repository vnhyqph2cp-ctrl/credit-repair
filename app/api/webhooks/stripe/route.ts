// app/api/webhooks/stripe/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { mapPriceIdToTier } from "@/lib/stripe/pricing";

// Make this route dynamic to avoid build-time errors
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  // Initialize Stripe inside the function to avoid build-time env var issues
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-12-15.clover" });

  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  // Handle subscription updates
  if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated") {
    const sub = event.data.object as Stripe.Subscription;
    const stripeCustomerId = String(sub.customer);
    const subId = sub.id;

    // Map price ID to tier
    const tier = mapStripeSubscriptionToTier(sub);

    await prisma.customer.updateMany({
      where: { stripeCustomerId: stripeCustomerId },
      data: {
        currentPlanTier: tier,
        updatedAt: new Date(),
      },
    });
  }

  // Handle subscription deletions
  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    const stripeCustomerId = String(sub.customer);

    await prisma.customer.updateMany({
      where: { stripeCustomerId: stripeCustomerId },
      data: {
        currentPlanTier: "basic",
        updatedAt: new Date(),
      },
    });
  }

  return NextResponse.json({ ok: true });
}

function mapStripeSubscriptionToTier(sub: Stripe.Subscription): string {
  // Get the first price ID from subscription items
  const priceId = sub.items.data[0]?.price?.id;
  
  if (!priceId) {
    console.warn("No price ID found in subscription");
    return "basic";
  }

  return mapPriceIdToTier(priceId);
}
