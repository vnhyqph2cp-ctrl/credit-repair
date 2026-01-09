import 'server-only';
import { cookies } from 'next/headers';
import {
  createServerClient as createSupabaseServerClient,
  type CookieOptions,
} from '@supabase/ssr';

export async function createServerClient() {
  const cookieStore = await cookies();

  return createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(_name: string, _value: string, _options: CookieOptions) {
          // no-op in server components
        },
        remove(_name: string, _options: CookieOptions) {
          // no-op in server components
        },
      },
    }
  );
}
