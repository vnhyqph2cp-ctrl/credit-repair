// app/api/mfsn/enroll/route.ts
import { NextRequest, NextResponse } from "next/server";
import { mfsnFetch } from "@/lib/mfsnClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      aid,
      pid,
      firstName,
      lastName,
      email,
      password,
      mobile,
      streetAddress,
      zip,
      city,
      state,
      ssn,
      dob,
      blackboxCode,
    } = body;

    if (
      !aid ||
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !mobile ||
      !streetAddress ||
      !zip ||
      !city ||
      !state ||
      !ssn ||
      !dob ||
      blackboxCode === undefined
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Missing required fields: aid, firstName, lastName, email, password, mobile, streetAddress, zip, city, state, ssn, dob, blackboxCode",
        },
        { status: 400 }
      );
    }

    const mfsnBody = {
      aid,
      pid,
      firstName,
      lastName,
      email,
      password,
      mobile,
      streetAddress,
      zip,
      city,
      state,
      ssn,
      dob,
      blackboxCode,
    };

    const res = await mfsnFetch("/api/auth/enroll/start", {
      method: "POST",
      body: JSON.stringify(mfsnBody),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("MFSN enroll failed", res.status, text);
      return NextResponse.json(
        {
          ok: false,
          error: "Failed to start enrollment",
          status: res.status,
          detail: text,
        },
        { status: 400 }
      );
    }

    const data = await res.json();
    return NextResponse.json({ ok: true, data });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
