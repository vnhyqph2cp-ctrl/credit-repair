import { createClient } from "npm:@supabase/supabase-js@2";

/* ------------------ CORS ------------------ */
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

/* ------------------ Server ------------------ */
Deno.serve(async (req) => {
  // ✅ Handle CORS preflight first
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !anonKey || !serviceKey) {
      return new Response(
        JSON.stringify({ ok: false, error: "ENV_MISCONFIGURED" }),
        { status: 500, headers: corsHeaders }
      );
    }

    /* ---------- Auth client (JWT required) ---------- */
    const supabase = createClient(supabaseUrl, anonKey, {
      global: {
        headers: {
          Authorization: req.headers.get("Authorization") ?? "",
        },
      },
    });

    /* ---------- Service client (internal writes) ---------- */
    const service = createClient(supabaseUrl, serviceKey);

    /* ---------- Authenticate user ---------- */
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response(
        JSON.stringify({ ok: false, error: "UNAUTHORIZED" }),
        { status: 401, headers: corsHeaders }
      );
    }

    /* ---------- Month key (rate limiting / enforcement) ---------- */
    const now = new Date();
    const monthKey = `${now.getUTCFullYear()}-${String(
      now.getUTCMonth() + 1
    ).padStart(2, "0")}`;

    /* ---------- Create analyzer session ---------- */
    const { data: session, error: insertError } = await service
      .from("analyzer_sessions")
      .insert({
        user_id: user.id,
        status: "INITIAL",
        month_key: monthKey,
      })
      .select("id")
      .single();

    if (insertError || !session) {
      console.error("Analyzer insert failed:", insertError);
      return new Response(
        JSON.stringify({ ok: false, error: "CREATE_FAILED" }),
        { status: 500, headers: corsHeaders }
      );
    }

    /* ---------- Success ---------- */
    return new Response(
      JSON.stringify({
        ok: true,
        analyzer_session_id: session.id,
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    console.error("Analyzer-start crash:", err);
    return new Response(
      JSON.stringify({ ok: false, error: "SERVER_ERROR" }),
      { status: 500, headers: corsHeaders }
    );
  }
});
