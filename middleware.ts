// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "./lib/supabase/middlewareClient";

export async function middleware(req: NextRequest) {
  // Wire Supabase cookies for matched routes, then continue
  createClient(req);
  return NextResponse.next();
}

// Only run on dashboard routes; landing page ("/") stays public
export const config = {
  matcher: ["/dashboard/:path*"],
};
