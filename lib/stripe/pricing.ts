// lib/stripe/pricing.ts
/**
 * Stripe Pricing Configuration
 * 
 * Maps Stripe price IDs to plan tiers
 */

export const STRIPE_PRICE_IDS = {
  basic: {
    monthly: process.env.STRIPE_PRICE_BASIC_MONTHLY || '',
    yearly: process.env.STRIPE_PRICE_BASIC_YEARLY || '',
  },
  analyzer: {
    monthly: process.env.STRIPE_PRICE_ANALYZER_MONTHLY || '',
    yearly: process.env.STRIPE_PRICE_ANALYZER_YEARLY || '',
  },
  welcome: {
    monthly: process.env.STRIPE_PRICE_WELCOME_MONTHLY || '',
    yearly: process.env.STRIPE_PRICE_WELCOME_YEARLY || '',
  },
  ultimate: {
    monthly: process.env.STRIPE_PRICE_ULTIMATE_MONTHLY || '',
    yearly: process.env.STRIPE_PRICE_ULTIMATE_YEARLY || '',
  },
} as const;

export type PlanTier = 'basic' | 'analyzer' | 'welcome' | 'ultimate';

/**
 * Map Stripe price ID to plan tier
 */
export function mapPriceIdToTier(priceId: string): PlanTier {
  // Check each tier
  for (const [tier, prices] of Object.entries(STRIPE_PRICE_IDS)) {
    if (prices.monthly === priceId || prices.yearly === priceId) {
      return tier as PlanTier;
    }
  }
  
  // Default to basic if no match
  console.warn(`Unknown Stripe price ID: ${priceId}, defaulting to basic`);
  return 'basic';
}

/**
 * Get price ID for a tier
 */
export function getPriceId(tier: PlanTier, interval: 'monthly' | 'yearly'): string {
  return STRIPE_PRICE_IDS[tier][interval];
}

/**
 * Plan tier pricing (in cents)
 */
export const PLAN_PRICING = {
  basic: {
    monthly: 4900, // $49/month
    yearly: 47040, // $39.20/month billed yearly
  },
  analyzer: {
    monthly: 9900, // $99/month
    yearly: 95040, // $79.20/month billed yearly
  },
  welcome: {
    monthly: 14900, // $149/month
    yearly: 142560, // $118.80/month billed yearly
  },
  ultimate: {
    monthly: 19900, // $199/month
    yearly: 190080, // $158.40/month billed yearly
  },
} as const;

/**
 * Get display name for tier
 */
export function getTierDisplayName(tier: PlanTier): string {
  const names: Record<PlanTier, string> = {
    basic: '3B Basic',
    analyzer: '3B Analyzer',
    welcome: '3B Welcome',
    ultimate: '3B Ultimate',
  };
  return names[tier];
}
