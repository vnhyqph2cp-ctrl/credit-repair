// File: app/api/billing/subscription-intents/route.ts
import { NextRequest } from 'next/server';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      threeBId,
      product,
      planId,
      addOns = [],
      mfsnMemberId,
    } = body ?? {};

    if (!threeBId || !product || !planId) {
      return new Response(
        JSON.stringify({
          data: null,
          error: { code: 'BAD_REQUEST', message: 'Missing required fields.' },
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // TODO: Later: calculate real amount from DB / pricing table.
    const baseAmounts: Record<string, number> = {
      credit_builder_base: 1990,
      credit_builder_pro: 3990,
      credit_builder_ultimate: 4990,
    };

    const base = baseAmounts[planId] ?? 1990;
    const addOnTotal = addOns.includes('dispute_letters') ? 990 : 0;
    const amountDueCents = base + addOnTotal;

    const intentId = `si_${randomUUID()}`;

    const intent = {
      intentId,
      checkoutUrl: `https://payment.bouncebackbrian.com/checkout/${intentId}`,
      amountDueCents,
      currency: 'USD',
      prorated: false,
      threeBId,
      product,
      planId,
      addOns,
      mfsnMemberId: mfsnMemberId ?? null,
    };

    return new Response(JSON.stringify({ data: intent, error: null }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('subscription-intents error', err);
    return new Response(
      JSON.stringify({
        data: null,
        error: { code: 'INTERNAL_ERROR', message: 'Unexpected error.' },
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
