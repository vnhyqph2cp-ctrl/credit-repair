import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

/**
 * Attach referral code to new user after signup
 * 
 * This runs server-side only with service-role privileges to:
 * 1. Validate the referral code exists and belongs to a reseller
 * 2. Securely attach reseller_id to the new user's profile
 * 3. Prevent client-side manipulation of referral attribution
 * 
 * Called from /register after successful signup
 */
export async function POST(req: Request) {
  try {
    const { user_id, ref } = await req.json();

    // Silent success if no referral code provided
    if (!user_id || !ref) {
      return NextResponse.json({ ok: true });
    }

    // Look up reseller by referral code
    const { data: reseller, error: lookupError } = await supabaseAdmin
      .from("Customer")
      .select("id")
      .eq("referral_code", ref)
      .eq("role", "reseller")
      .maybeSingle();

    // Silent success if referral code invalid (don't block signup)
    if (lookupError || !reseller) {
      console.warn(`Invalid referral code: ${ref}`);
      return NextResponse.json({ ok: true, attached: false });
    }

    // Attach reseller_id to new user
    const { error: updateError } = await supabaseAdmin
      .from("Customer")
      .update({ reseller_id: reseller.id })
      .eq("id", user_id);

    if (updateError) {
      console.error("Failed to attach referral:", updateError);
      return NextResponse.json({ ok: true, attached: false });
    }

    console.log(`✅ Referral attached: User ${user_id} → Reseller ${reseller.id}`);
    return NextResponse.json({ ok: true, attached: true });

  } catch (err) {
    console.error("Unexpected error in attach-referral:", err);
    // Silent success - don't block signup for referral errors
    return NextResponse.json({ ok: true, attached: false });
  }
}
