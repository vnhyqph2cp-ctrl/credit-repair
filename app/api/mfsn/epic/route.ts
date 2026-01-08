import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Never expose this route publicly without protection.
  // At minimum: require admin or special key.
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ ok: false, error: "Missing username/password" }, { status: 400 });
  }

  const token = process.env.MFSN_API_BEARER_TOKEN;
  if (!token) {
    return NextResponse.json({ ok: false, error: "Missing MFSN_API_BEARER_TOKEN" }, { status: 500 });
  }

  const url = "https://api.myfreescorenow.com/api/auth/v2/3B/epic/report.json";

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const json = await resp.json().catch(() => null);

  if (!resp.ok) {
    return NextResponse.json({ ok: false, error: "MFSN request failed", details: json }, { status: 502 });
  }

  return NextResponse.json({ ok: true, epic: json });
}
