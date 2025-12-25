// lib/supabase-server.ts
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/lib/database.types"; // adjust path or remove if not using types

export function createServerSupabaseClient() {
  const cookieStore = cookies();

  return createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });
}
