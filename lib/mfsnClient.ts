// lib/mfsnClient.ts
const MFSN_BASE_URL = process.env.MFSN_BASE_URL!;
const MFSN_LOGIN_EMAIL = process.env.MFSN_LOGIN_EMAIL!;
const MFSN_LOGIN_PASSWORD = process.env.MFSN_LOGIN_PASSWORD!;

let cachedToken: string | null = null;
let tokenExpiresAt = 0; // epoch ms

async function login(): Promise<string> {
  console.log(
    "MFSN env test",
    "BASE:", MFSN_BASE_URL,
    "EMAIL:", MFSN_LOGIN_EMAIL,
    "PASS:", MFSN_LOGIN_PASSWORD ? "SET" : "MISSING"
  );

  const res = await fetch(`${MFSN_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: MFSN_LOGIN_EMAIL,
      password: MFSN_LOGIN_PASSWORD,
    }),
  });

  const text = await res.text();
  console.log("MFSN login response", res.status, text);

  if (!res.ok) {
    console.error("MFSN login failed:", text);
    throw new Error("MFSN login failed");
  }

  const json = JSON.parse(text);
  const token = json?.data?.token as string | undefined;
  if (!token) {
    throw new Error("No token in login response");
  }

  const TEN_MIN = 10 * 60 * 1000;
  cachedToken = token;
  tokenExpiresAt = Date.now() + TEN_MIN;

  return token;
}

export async function mfsnFetch(path: string, init: RequestInit = {}) {
  const now = Date.now();
  if (!cachedToken || now >= tokenExpiresAt) {
    await login();
  }

  const headers = {
    "Content-Type": "application/json",
    ...(init.headers || {}),
    Authorization: `Bearer ${cachedToken}`,
  };

  return fetch(`${MFSN_BASE_URL}${path}`, { ...init, headers });
}
