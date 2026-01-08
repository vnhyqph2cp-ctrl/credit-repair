import { NextRequest } from "next/server";

export async function POST(_req: NextRequest) {
  return new Response(
    JSON.stringify({ status: "error", message: "Invalid JSON body" }),
    { status: 400, headers: { "Content-Type": "application/json" } }
  );
}
