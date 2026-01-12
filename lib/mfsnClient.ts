// lib/mfsnClient.ts
/**
 * MFSN Server Client
 *
 * - Handles authentication with MFSN
 * - Caches bearer token in-memory
 * - Server-side ONLY
 *
 * This client does NOT:
 * - Parse reports
 * - Normalize data
 * - Perform retries or enforcement logic
 */

const MFSN_BASE_URL = process.env.MFSN_BASE_URL;
const MFSN_LOGIN_EMAIL = process.env.MFSN_LOGIN_EMAIL;
const MFSN_LOGIN_PASSWORD = process.env.MFSN_LOGIN_PASSWORD;

if (!MFSN_BASE_URL || !MFSN_LOGIN_EMAIL || !MFSN_LOGIN_PASSWORD) {
  throw new Error("Missing required MFSN environment variables");
}

let cachedToken: string | null = null;
let tokenExpiresAt = 0; // epoch ms

function assertServerOnly() {
  if (typeof window !== "undefined") {
    throw new Error("mfsnClient must only be used server-side");
  }
}

async function login(): Promise<string> {
  assertServerOnly();

  const res = await fetch(`${MFSN_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: MFSN_LOGIN_EMAIL,
      password: MFSN_LOGIN_PASSWORD,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`MFSN login failed (${res.status}): ${body}`);
  }

  const json = await res.json();
  const token = json?.data?.token as string | undefined;

  if (!token) {
    throw new Error("MFSN login succeeded but no token was returned");
  }

  /**
   * Token TTL handling:
   * - MFSN does not reliably publish expiry
   * - We use a conservative short cache window
   * - Token will auto-refresh on expiry or failure
   */
  const SAFE_TTL_MS = 8 * 60 * 1000; // 8 minutes
  cachedToken = token;
  tokenExpiresAt = Date.now() + SAFE_TTL_MS;

  return token;
}

export async function mfsnFetch(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  assertServerOnly();

  const now = Date.now();
  if (!cachedToken || now >= tokenExpiresAt) {
    await login();
  }

  const headers = {
    ...(init.headers || {}),
    "Content-Type": "application/json",
    Authorization: `Bearer ${cachedToken}`,
  };

  const res = await fetch(`${MFSN_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  /**
   * Defensive re-auth:
   * If token expired early or was invalidated, retry once
   */
  if (res.status === 401) {
    cachedToken = null;
    tokenExpiresAt = 0;
    await login();

    return fetch(`${MFSN_BASE_URL}${path}`, {
      ...init,
      headers: {
        ...headers,
        Authorization: `Bearer ${cachedToken}`,
      },
    });
  }

  return res;
}
