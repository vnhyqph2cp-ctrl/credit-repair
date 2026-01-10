// lib/supabase-server.ts
import { createServerClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function createServerSupabase() {
  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      // For API routes that don't use cookies, we can no-op
      getAll() {
        return [];
      },
      setAll() {},
    },
  });
}
