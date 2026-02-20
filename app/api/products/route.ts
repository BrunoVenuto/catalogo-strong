import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";

export async function GET() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ products: data ?? [] });
}

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();
  if (!(await isAdmin(supabase))) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const body = await req.json().catch(() => null);
  if (!body?.name || body?.price == null) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const insert = {
    name: String(body.name),
    price: Number(body.price),
    category: String(body.category ?? ""),
    description: String(body.description ?? ""),
    image: String(body.image ?? ""),
    active: body.active ?? true,
  };

  const { data, error } = await supabase.from("products").insert(insert).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data }, { status: 201 });
}

export async function PUT(req: Request) {
  const supabase = await createSupabaseServerClient();
  if (!(await isAdmin(supabase))) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const id = body?.id;
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const patch: Record<string, any> = {};
  if (body.name != null) patch.name = String(body.name);
  if (body.price != null) patch.price = Number(body.price);
  if (body.category != null) patch.category = String(body.category);
  if (body.description != null) patch.description = String(body.description);
  if (body.image != null) patch.image = String(body.image);
  if (body.active != null) patch.active = !!body.active;

  const { data, error } = await supabase.from("products").update(patch).eq("id", id).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data });
}

export async function DELETE(req: Request) {
  const supabase = await createSupabaseServerClient();
  if (!(await isAdmin(supabase))) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}