import { NextResponse } from "next/server";
import { getAdminStats } from "@/lib/orders";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";

export async function GET() {
  const supabase = createSupabaseServerClient();
  if (!(await isAdmin(supabase))) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const stats = await getAdminStats(10, 10);
  return NextResponse.json(stats, { headers: { "Cache-Control": "no-store" } });
}
