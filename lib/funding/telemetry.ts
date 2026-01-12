/**
 * Funding Telemetry
 * =================
 *
 * Write-only analytics + state transition logging.
 *
 * IMPORTANT:
 * - Telemetry must NEVER block core flows
 * - Failures are swallowed intentionally
 * - This file performs NO business logic
 */

import { createClient } from "@/lib/supabase/server";
import type { FundingBand } from "@/lib/funding/readiness";

/**
 * Log funding band transitions (BUILD → ALMOST → READY)
 */
export async function logBandChange(
  userId: string,
  fromBand: FundingBand | null,
  toBand: FundingBand,
  frs: number
): Promise<void> {
  try {
    const supabase = await createClient();

    await supabase.from("funding_band_events").insert({
      user_id: userId,
      from_band: fromBand,
      to_band: toBand,
      frs,
    });
  } catch (error) {
    // Telemetry must never block execution
    console.error("logBandChange failed", error);
  }
}

/**
 * Log offer impressions (viewed)
 */
export async function logOfferImpression(
  userId: string,
  offerId: string,
  offerType: string,
  band: FundingBand,
  frs: number
): Promise<void> {
  try {
    const supabase = await createClient();

    await supabase.from("funding_offer_events").insert({
      user_id: userId,
      offer_id: offerId,
      offer_type: offerType,
      event_type: "impression",
      band,
      frs,
    });
  } catch (error) {
    console.error("logOfferImpression failed", error);
  }
}

/**
 * Log offer clicks (engagement)
 */
export async function logOfferClick(
  userId: string,
  offerId: string,
  offerType: string,
  band: FundingBand,
  frs: number
): Promise<void> {
  try {
    const supabase = await createClient();

    await supabase.from("funding_offer_events").insert({
      user_id: userId,
      offer_id: offerId,
      offer_type: offerType,
      event_type: "click",
      band,
      frs,
    });
  } catch (error) {
    console.error("logOfferClick failed", error);
  }
}
