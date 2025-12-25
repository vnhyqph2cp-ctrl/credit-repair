// supabase/functions/mfsn-verify-score/index.ts
import { createClient } from "npm:@supabase/supabase-js@2";

const MFSN_BASE_URL = "https://api.myfreescorenow.com/api/auth/snapshot/credit";

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const mfsnApiKey = Deno.env.get("MFSN_API_KEY") ?? "";

    if (!supabaseUrl || !serviceRoleKey || !anonKey || !mfsnApiKey) {
      return json({ error: "Missing environment variables" }, 500);
    }

    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "");

    const supabaseAuth = createClient(supabaseUrl, anonKey);
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);

    if (authError || !user) {
      return json({ error: "Unauthorized" }, 401);
    }

    const customerId = user.id;
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    const { data: customer, error: customerError } = await supabaseAdmin
      .from("Customer")
      .select("mfsnMemberId, mfsnSmfaToken, mfsnUToken, mfsnDToken")
      .eq("id", customerId)
      .single();

    if (customerError || !customer?.mfsnMemberId) {
      return json({ error: "MFSN enrollment not found for customer" }, 400);
    }

    const { mfsnMemberId, mfsnSmfaToken, mfsnUToken, mfsnDToken } = customer;

    const verifyRes = await fetch(`${MFSN_BASE_URL}/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${mfsnApiKey}`,
      },
      body: JSON.stringify({
        userId: mfsnMemberId,
        smfaToken: mfsnSmfaToken,
        utoken: mfsnUToken,
        dtoken: mfsnDToken,
      }),
    });

    if (!verifyRes.ok) {
      const text = await verifyRes.text();
      return json({ error: "MFSN verify failed", details: text }, verifyRes.status);
    }

    const scoreRes = await fetch(`${MFSN_BASE_URL}/score`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${mfsnApiKey}`,
      },
      body: JSON.stringify({ userId: mfsnMemberId }),
    });

    if (!scoreRes.ok) {
      const text = await scoreRes.text();
      return json({ error: "MFSN score failed", details: text }, scoreRes.status);
    }

    const scoreJson = await scoreRes.json();
    const score = scoreJson?.creditScore?.score ?? scoreJson?.score ?? null;

    const { error: snapshotError } = await supabaseAdmin.from("Snapshot").upsert({
      customerId,
      rawdata: scoreJson,
      scoreTu: score,
      status: "complete",
    });

    if (snapshotError) {
      return json({ error: "Failed to write Snapshot" }, 500);
    }

    await supabaseAdmin.from("Customer").update({
      snapshotStatus: "complete",
      mfsnSmfaToken: null,
      mfsnUToken: null,
      mfsnDToken: null,
    }).eq("id", customerId);

    return json({
      status: "success",
      message: "Snapshot verified and score retrieved successfully.",
    });
  } catch (err) {
    console.error("mfsn-verify-score error", err);
    return json({ error: "Internal server error" }, 500);
  }
});

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

const corsHeaders: HeadersInit = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};
