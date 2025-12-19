import { NextResponse } from "next/server";

const MFSN_BASE_URL = process.env.MFSN_BASE_URL!;
const EMAIL = process.env.MFSN_API_EMAIL!;
const PASSWORD = process.env.MFSN_API_PASSWORD!;

export async function POST() {
  try {
    const res = await fetch(`${MFSN_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("MFSN login failed:", text);
      return NextResponse.json(
        { ok: false, error: "MFSN login failed" },
        { status: 500 }
      );
    }

    const json = await res.json();
    const token = json?.data?.token as string | undefined;

    if (!token) {
      return NextResponse.json(
        { ok: false, error: "No token in response" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, token });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
