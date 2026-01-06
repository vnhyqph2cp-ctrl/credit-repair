import { createClient } from '@/lib/supabase/server';

type Band = "BUILD" | "ALMOST" | "READY";

export async function logBandChange(
  userId: string,
  fromBand: Band | null,
  toBand: Band,
  frs: number
) {
  const supabase = await createClient();

  await supabase.from("funding_band_events").insert({
    user_id: userId,
    from_band: fromBand,
    to_band: toBand,
    frs,
  });
}

export async function logOfferImpression(
  userId: string,
  offerId: string,
  offerType: string,
  band: Band,
  frs: number
) {
  const supabase = await createClient();

  await supabase.from("funding_offer_events").insert({
    user_id: userId,
    offer_id: offerId,
    offer_type: offerType,
    event_type: "impression",
    band,
    frs,
  });
}

export async function logOfferClick(
  userId: string,
  offerId: string,
  offerType: string,
  band: Band,
  frs: number
) {
  const supabase = await createClient();

  await supabase.from("funding_offer_events").insert({
    user_id: userId,
    offer_id: offerId,
    offer_type: offerType,
    event_type: "click",
    band,
    frs,
  });
}
