// app/api/mfsn/3b/report/route.ts
import { NextRequest, NextResponse } from "next/server";
import { mfsnFetch } from "@/lib/mfsnClient";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { ok: false, error: "Missing username or password" },
        { status: 400 }
      );
    }

    const res = await mfsnFetch("/api/auth/3B/report.json", {
      method: "POST",
      body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("MFSN 3B report failed", res.status, text);
      return NextResponse.json(
        {
          ok: false,
          error: "Failed to pull 3B report",
          status: res.status,
          detail: text
        },
        { status: 400 }
      );
    }

    const data = await res.json();
    return NextResponse.json({ ok: true, data });
  } catch (err: any) {
    console.error("3B report handler error", err);
    return NextResponse.json(
      { ok: false, error: "Server error", detail: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
