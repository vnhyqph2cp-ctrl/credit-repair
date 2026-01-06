import { supabaseServer } from "@/lib/supabase/server";

export async function getSnapshotState() {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { hasSnapshot: false };
  }

  const { data, error } = await supabase
    .from("credit_snapshots")
    .select("id, status")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return { hasSnapshot: false };
  }

  return {
    hasSnapshot: true,
    status: data.status, // e.g. 'complete'
  };
}
