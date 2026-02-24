import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";

/**
 * GET /api/orders
 * - Protegido: só admin consegue listar pedidos.
 */
export async function GET() {
  const supabase = await createSupabaseServerClient();

  if (!(await isAdmin(supabase))) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  // Busca pedidos + itens
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      customer_name,
      customer_phone,
      created_at,
      order_items (
        id,
        product_id,
        price,
        quantity,
        created_at
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ orders: data ?? [] });
}

/**
 * POST /api/orders
 * - Público: cria um pedido e seus itens.
 * Body esperado:
 * {
 *   "customer_name": "João",
 *   "customer_phone": "11999999999",
 *   "items": [
 *     { "product_id": "<uuid>", "price": 10, "quantity": 2 }
 *   ]
 * }
 */
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  // bypass RLS using the service role key
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const body = await req.json().catch(() => null);

  const items = Array.isArray(body?.items) ? body.items : [];
  if (items.length === 0) {
    return NextResponse.json({ error: "items are required" }, { status: 400 });
  }

  const customer_name =
    body?.customer?.name ?? body?.customer_name ?? null;
  const customer_phone =
    body?.customer?.phone ?? body?.customer_phone ?? null;

  // 1) cria pedido
  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .insert({ customer_name, customer_phone })
    .select("id, created_at")
    .single();

  if (orderErr || !order) {
    return NextResponse.json(
      { error: orderErr?.message || "failed to create order" },
      { status: 500 }
    );
  }

  // 2) cria itens
  const rows = items.map((it: any) => ({
    order_id: order.id,
    product_id: String(it.product_id ?? it.productId),
    price: Number(it.price),
    quantity: Number(it.quantity ?? 1),
  }));

  const { error: itemsErr } = await supabase.from("order_items").insert(rows);

  if (itemsErr) {
    return NextResponse.json({ error: itemsErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, order_id: order.id }, { status: 201 });
}