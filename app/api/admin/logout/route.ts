import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();

  return NextResponse.redirect(new URL("/admin/login", url));
}
