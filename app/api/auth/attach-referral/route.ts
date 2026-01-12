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
 * Server-side only (service role).
 * Silent failure by design.
 */
export async function POST(req: Request) {
  try {
    const { user_id, ref } = await req.json();

    // Silent success if no referral
    if (!user_id || !ref) {
      return NextResponse.json({ ok: true });
    }

    // Find reseller
    const { data: reseller } = await supabaseAdmin
      .from("Customer")
      .select("id")
      .eq("referralCode", ref)
      .eq("role", "reseller")
      .maybeSingle();

    if (!reseller) {
      return NextResponse.json({ ok: true, attached: false });
    }

    // Attach only if not already set
    const { error } = await supabaseAdmin
      .from("Customer")
      .update({ resellerId: reseller.id })
      .eq("id", user_id)
      .is("resellerId", null);

    if (error) {
      console.error("Referral attach failed:", error);
      return NextResponse.json({ ok: true, attached: false });
    }

    console.log(`✅ Referral attached: ${user_id} → ${reseller.id}`);
    return NextResponse.json({ ok: true, attached: true });
  } catch (err) {
    console.error("attach-referral crash:", err);
    return NextResponse.json({ ok: true, attached: false });
  }
}
