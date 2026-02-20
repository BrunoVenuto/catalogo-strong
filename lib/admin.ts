import type { SupabaseClient } from "@supabase/supabase-js";

export async function isAdmin(supabase: SupabaseClient) {
  const { data: auth, error: authErr } = await supabase.auth.getUser();
  if (authErr || !auth?.user) return false;

  const { data, error } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", auth.user.id)
    .maybeSingle();

  if (error) return false;
  return !!data;
}