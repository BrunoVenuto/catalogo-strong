import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();
  const body = await req.json().catch(() => null);

  const items = Array.isArray(body?.items) ? body.items : [];
  if (items.length === 0) {
    return NextResponse.json({ error: "items are required" }, { status: 400 });
  }

  const customer_name = body?.customer_name ? String(body.customer_name) : null;
  const customer_phone = body?.customer_phone ? String(body.customer_phone) : null;

  // 1) cria pedido
  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .insert({ customer_name, customer_phone })
    .select("*")
    .single();

  if (orderErr || !order) {
    return NextResponse.json({ error: orderErr?.message || "failed to create order" }, { status: 500 });
  }

  // 2) cria itens
  const rows = items.map((it: any) => ({
    order_id: order.id,
    product_id: String(it.product_id),
    price: Number(it.price),
    quantity: Number(it.quantity ?? 1),
  }));

  const { error: itemsErr } = await supabase.from("order_items").insert(rows);
  if (itemsErr) {
    return NextResponse.json({ error: itemsErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, order_id: order.id }, { status: 201 });
}