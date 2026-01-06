import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { user_id } = await req.json();

  if (!user_id) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
  }

  // Resolve profile (system → reseller → client)
  const { data, error } = await supabaseAdmin.rpc(
    "resolve_dispute_profile",
    { p_user_id: user_id }
  );

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Resolver failed" }, { status: 500 });
  }

  // Persist action plan if you store it
  // (or just return it for now)
  return NextResponse.json({ plan: data });
}
