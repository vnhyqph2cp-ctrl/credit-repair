// lib/auth.ts
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

function getSupabaseClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );
}

export async function getServerSession() {
  const supabase = getSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return {
    user: {
      id: user.id,
      email: user.email,
    },
  };
}

export async function getSessionCustomer() {
  const cookieStore = cookies();
  const customerId = cookieStore.get("customer_id")?.value;

  if (!customerId) return null;

  const supabase = getSupabaseClient();
  const { data: customer, error } = await supabase
    .from("customer")
    .select("*")
    .eq("id", customerId)
    .single();

  if (error || !customer) return null;
  return customer;
}

export async function requireAuth() {
  const customer = await getSessionCustomer();
  if (!customer) {
    throw new Error("Unauthorized");
  }
  return customer;
}

export async function requireAdmin() {
  const customer = await requireAuth();
  // TODO: enforce role once profiles/roles are finalized
  return customer;
}

export async function isAdmin(_customer: unknown): Promise<boolean> {
  return false;
}

export async function requireReseller() {
  const customer = await requireAuth();
  // TODO: reseller role enforcement later
  return customer;
}
