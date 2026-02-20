import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";

export async function POST() {
  const supabase = await createSupabaseServerClient();
  if (!(await isAdmin(supabase))) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const seedProducts = [
    { name: "Produto 1", price: 10, category: "Geral", description: "Exemplo", image: "", active: true },
    { name: "Produto 2", price: 20, category: "Geral", description: "Exemplo", image: "", active: true },
  ];

  const { error } = await supabase.from("products").insert(seedProducts);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}