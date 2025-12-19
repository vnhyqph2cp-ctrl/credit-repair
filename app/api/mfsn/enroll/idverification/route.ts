// app/api/mfsn/enroll/idverification/route.ts
import { NextRequest, NextResponse } from "next/server";
import { mfsnFetch } from "@/lib/mfsnClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { trackingToken, customerToken, referenceNumber, userInput } = body;
    const answers = userInput?.answers;
    const blackboxCode = userInput?.blackboxCode;

    if (!trackingToken || !customerToken || !referenceNumber || !answers?.length) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Missing required fields: trackingToken, customerToken, referenceNumber, answers",
        },
        { status: 400 }
      );
    }

    const res = await mfsnFetch("/api/auth/enroll/idverification", {
      method: "POST",
      body: JSON.stringify({
        referenceNumber,
        userInput: {
          answers,
          blackboxCode,
        },
        trackingToken,
        customerToken,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("MFSN idverification failed", res.status, text);
      return NextResponse.json(
        {
          ok: false,
          error: "MFSN ID verification failed",
          status: res.status,
          details: text,
        },
        { status: 400 }
      );
    }

    const data = await res.json();
    return NextResponse.json({ ok: true, data });
  } catch (err: any) {
    console.error("ID verification handler error", err);
    return NextResponse.json(
      {
        ok: false,
        error: "Server error",
        detail: err?.message ?? String(err),
      },
      { status: 500 }
    );
  }
}
