// lib/state.ts
import crypto from "crypto";

const SECRET = process.env.STATE_SIGNING_SECRET!;
if (!SECRET) throw new Error("Missing STATE_SIGNING_SECRET");

export function signState(payload: Record<string, any>) {
  const json = JSON.stringify({ ...payload, iat: Date.now() });
  const b64 = Buffer.from(json).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(b64).digest("base64url");
  return `${b64}.${sig}`;
}

export function verifyState(token: string) {
  const [b64, sig] = token.split(".");
  if (!b64 || !sig) return null;

  const expected = crypto.createHmac("sha256", SECRET).update(b64).digest("base64url");
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;

  const json = Buffer.from(b64, "base64url").toString("utf8");
  return JSON.parse(json) as { customer_id: string; iat: number; [k: string]: any };
}
