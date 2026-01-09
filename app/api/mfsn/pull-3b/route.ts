// app/api/mfsn/pull-3b/route.ts
import { NextRequest, NextResponse } from "next/server";
import { mfsnFetch } from "@/lib/mfsnClient";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { ok: false, error: "username and password are required" },
        { status: 400 }
      );
    }

    // MyFreeScoreNow 3B endpoint (Epic 3B JSON)
    // Docs: POST https://api.myfreescorenow.com/api/auth/3B/report.json
    // Body: { "username": "...", "password": "..." }
    const res = await mfsnFetch("/api/auth/3B/report.json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("MFSN 3B error:", text);
      return NextResponse.json(
        { ok: false, error: "Failed to pull 3B report" },
        { status: 500 }
      );
    }

    const json = await res.json();
    // Response shape from docs: { success: true, data: { BundleComponent: [...] } }
    return NextResponse.json({ ok: true, data: json.data });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
