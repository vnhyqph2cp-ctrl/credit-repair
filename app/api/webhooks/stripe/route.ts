// app/api/webhooks/stripe/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });

export async function POST(req: Request) {
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

    // Map your pricing/product to tiers here:
    const tier = mapStripeSubscriptionToTier(sub);

    await prisma.customer.updateMany({
      where: { stripe_customer_id: stripeCustomerId },
      data: {
        stripe_subscription_id: subId,
        current_plan_tier: tier,
      },
    });
  }

  return NextResponse.json({ ok: true });
}

function mapStripeSubscriptionToTier(sub: Stripe.Subscription): any {
  // TODO: map by price IDs
  // Example:
  // if (sub.items.data.some(i => i.price.id === process.env.STRIPE_PRICE_ULTIMATE)) return "ultimate";
  return "basic";
}
