import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  if (!(await isAdmin(supabase))) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const [{ count: productsCount, error: e1 }, { count: ordersCount, error: e2 }] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
  ]);

  if (e1) return NextResponse.json({ error: e1.message }, { status: 500 });
  if (e2) return NextResponse.json({ error: e2.message }, { status: 500 });

  return NextResponse.json({
    productsCount: productsCount ?? 0,
    ordersCount: ordersCount ?? 0,
  });
}