import type { SupabaseClient } from "@supabase/supabase-js";

export async function isAdmin(supabase: SupabaseClient) {
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr || !user) return false;

  const { data, error } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) return false;
  return !!data;
}
