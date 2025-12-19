// app/api/mfsn/3b/report/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    return NextResponse.json(
      {
        ok: true,
        message: "3B test route hit",
        body
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: "Server error", detail: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
