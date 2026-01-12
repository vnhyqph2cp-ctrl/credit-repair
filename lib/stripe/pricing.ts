// lib/stripe/pricing.ts
/**
 * Stripe Pricing Configuration
 *
 * Maps Stripe price IDs to internal plan tiers.
 * Stripe IDs are external implementation details.
 * The platform operates ONLY on plan tiers.
 */

export type PlanTier = "basic" | "analyzer" | "welcome" | "ultimate";
export type BillingInterval = "monthly" | "yearly";

export const STRIPE_PRICE_IDS = {
  basic: {
    monthly: process.env.STRIPE_PRICE_BASIC_MONTHLY ?? "",
    yearly: process.env.STRIPE_PRICE_BASIC_YEARLY ?? "",
  },
  analyzer: {
    monthly: process.env.STRIPE_PRICE_ANALYZER_MONTHLY ?? "",
    yearly: process.env.STRIPE_PRICE_ANALYZER_YEARLY ?? "",
  },
  welcome: {
    monthly: process.env.STRIPE_PRICE_WELCOME_MONTHLY ?? "",
    yearly: process.env.STRIPE_PRICE_WELCOME_YEARLY ?? "",
  },
  ultimate: {
    monthly: process.env.STRIPE_PRICE_ULTIMATE_MONTHLY ?? "",
    yearly: process.env.STRIPE_PRICE_ULTIMATE_YEARLY ?? "",
  },
} as const;

/**
 * Validate Stripe pricing configuration at runtime.
 * Logs warnings only — does NOT crash the app.
 */
export function validateStripePricing(): void {
  const missing: string[] = [];

  for (const [tier, prices] of Object.entries(STRIPE_PRICE_IDS)) {
    if (!prices.monthly) {
      missing.push(`${tier}.monthly`);
    }
    if (!prices.yearly) {
      missing.push(`${tier}.yearly`);
    }
  }

  if (missing.length > 0) {
    console.warn(
      `[Stripe Pricing] Missing price IDs:\n${missing
        .map((m) => ` - ${m}`)
        .join("\n")}`
    );
  }
}

/**
 * Map a Stripe price ID → internal plan tier
 */
export function mapPriceIdToTier(priceId: string): PlanTier {
  for (const [tier, prices] of Object.entries(STRIPE_PRICE_IDS)) {
    if (prices.monthly === priceId || prices.yearly === priceId) {
      return tier as PlanTier;
    }
  }

  console.warn(
    `[Stripe Pricing] Unknown price ID "${priceId}". Defaulting to "basic".`
  );

  return "basic";
}

/**
 * Get Stripe price ID for a plan tier + billing interval
 */
export function getPriceId(
  tier: PlanTier,
  interval: BillingInterval
): string {
  return STRIPE_PRICE_IDS[tier][interval];
}

/**
 * Internal reference pricing (display / analytics only)
 * NOT used for billing enforcement.
 */
export const PLAN_PRICING = {
  basic: {
    monthly: 4900,
    yearly: 47040,
  },
  analyzer: {
    monthly: 9900,
    yearly: 95040,
  },
  welcome: {
    monthly: 14900,
    yearly: 142560,
  },
  ultimate: {
    monthly: 19900,
    yearly: 190080,
  },
} as const;

/**
 * Display names (UI only)
 */
export function getTierDisplayName(tier: PlanTier): string {
  const names: Record<PlanTier, string> = {
    basic: "3B Basic",
    analyzer: "3B Analyzer",
    welcome: "3B Welcome",
    ultimate: "3B Ultimate",
  };

  return names[tier];
}
