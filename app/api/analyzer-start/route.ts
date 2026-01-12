import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient, createClient } from "@supabase/ssr";

export async function POST() {
  const cookieStore = cookies();

  // 1️⃣ User-scoped client (auth only)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {}, // not needed here
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  // 2️⃣ Service-role client (writes only)
  const service = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await service
    .from("analyzer_sessions")
    .insert({
      user_id: user.id,
      status: "INITIAL",
    })
    .select("id")
    .single();

  if (error) {
    console.error("Analyzer start failed:", error);
    return NextResponse.json({ error: "FAILED" }, { status: 500 });
  }

  return NextResponse.json({
    analyzer_session_id: data.id,
  });
}
