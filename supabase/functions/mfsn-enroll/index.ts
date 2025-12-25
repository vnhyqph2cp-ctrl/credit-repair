// supabase/functions/mfsn-enroll/index.ts
import { createClient } from "npm:@supabase/supabase-js@2";

type EnrollRequestBody = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  aid: string;
  mobile: string;
  streetAddress1: string;
  zip: string;
  city: string;
  state: string;
  ssn: string;
  dob: string;
};

const MFSN_BASE_URL = "https://api.myfreescorenow.com/api/auth/snapshot/credit";

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const body = (await req.json()) as EnrollRequestBody;

    const requiredFields: (keyof EnrollRequestBody)[] = [
      "firstName", "lastName", "email", "password", "aid", "mobile",
      "streetAddress1", "zip", "city", "state", "ssn", "dob",
    ];

    for (const field of requiredFields) {
      if (!body[field] || String(body[field]).trim() === "") {
        return json({ error: `Missing required field: ${field}` }, 400);
      }
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const mfsnApiKey = Deno.env.get("MFSN_API_KEY") ?? "";

    if (!supabaseUrl || !serviceRoleKey || !anonKey || !mfsnApiKey) {
      return json({ error: "Missing required environment variables" }, 500);
    }

    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return json({ error: "Missing authorization token" }, 401);
    }

    const supabaseAuth = createClient(supabaseUrl, anonKey);
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);

    if (authError || !user) {
      return json({ error: "Unauthorized" }, 401);
    }

    const customerId = user.id;
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    const enrollResponse = await fetch(`${MFSN_BASE_URL}/enroll`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${mfsnApiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!enrollResponse.ok) {
      const text = await enrollResponse.text();
      return json({ error: "MFSN enroll failed", status: enrollResponse.status, body: text }, enrollResponse.status);
    }

    const enrollJson = (await enrollResponse.json()) as { status: string; userId: string; message?: string };
    const mfsnUserId = enrollJson.userId;

    const getLinkResponse = await fetch(`${MFSN_BASE_URL}/getlink`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${mfsnApiKey}`,
      },
      body: JSON.stringify({ userId: mfsnUserId, type: "email" }),
    });

    if (!getLinkResponse.ok) {
      const text = await getLinkResponse.text();
      return json({ error: "MFSN getlink failed", status: getLinkResponse.status, body: text }, getLinkResponse.status);
    }

    const getLinkJson = (await getLinkResponse.json()) as {
      status: string; userId: string; message?: string;
      smfaToken?: string; utoken?: string; dtoken?: string;
    };

    const { error: updateError } = await supabaseAdmin.from("Customer").update({
      mfsnMemberId: mfsnUserId,
      snapshotStatus: "verify_link_sent",
      mfsnSmfaToken: getLinkJson.smfaToken ?? null,
      mfsnUToken: getLinkJson.utoken ?? null,
      mfsnDToken: getLinkJson.dtoken ?? null,
    }).eq("id", customerId);

    if (updateError) {
      return json({ error: "Failed to update customer with MFSN data" }, 500);
    }

    return json({
      status: "success",
      message: "Enrollment started and verification link requested successfully.",
      mfsnUserId,
    }, 200);
  } catch (e) {
    console.error("mfsn-enroll error", e);
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
