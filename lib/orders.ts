import { createSupabaseServerClient } from "@/lib/supabase/server";

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  createdAt: string;
  items: OrderItem[];
  total: number;
  source?: string;
  customer?: Record<string, any>;
};

export async function readOrders(): Promise<Order[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, created_at, total, source, customer, order_items(product_id, name, price, quantity)"
    )
    .order("created_at", { ascending: false });

  if (error) return [];

  return (data ?? []).map((o: any) => ({
    id: String(o.id),
    createdAt: String(o.created_at),
    total: Number(o.total ?? 0),
    source: o.source ?? undefined,
    customer: o.customer ?? undefined,
    items: Array.isArray(o.order_items)
      ? o.order_items.map((it: any) => ({
          productId: String(it.product_id),
          name: String(it.name ?? ""),
          price: Number(it.price ?? 0),
          quantity: Number(it.quantity ?? 0),
        }))
      : [],
  }));
}

export function calcOrderTotal(items: OrderItem[]) {
  return items.reduce((sum, it) => sum + it.price * it.quantity, 0);
}

export async function addOrder(orderInput: {
  items: OrderItem[];
  total?: number;
  source?: string;
  customer?: Record<string, any>;
}): Promise<Order> {
  const supabase = createSupabaseServerClient();

  const total = orderInput.total ?? calcOrderTotal(orderInput.items);

  const { data: orderRow, error: orderErr } = await supabase
    .from("orders")
    .insert({
      total,
      source: orderInput.source ?? null,
      customer: orderInput.customer ?? null,
    })
    .select("id, created_at, total, source, customer")
    .single();

  if (orderErr || !orderRow) {
    throw new Error(orderErr?.message || "failed to create order");
  }

  const itemsToInsert = orderInput.items.map((it) => ({
    order_id: orderRow.id,
    product_id: Number(it.productId),
    name: it.name,
    price: it.price,
    quantity: it.quantity,
  }));

  const { error: itemsErr } = await supabase.from("order_items").insert(itemsToInsert);
  if (itemsErr) {
    // best-effort: order exists but items failed
    throw new Error(itemsErr.message);
  }

  return {
    id: String(orderRow.id),
    createdAt: String(orderRow.created_at),
    total: Number(orderRow.total ?? 0),
    source: orderRow.source ?? undefined,
    customer: orderRow.customer ?? undefined,
    items: orderInput.items,
  };
}

export type AdminStats = {
  totalOrders: number;
  totalRevenue: number;
  topProducts: Array<{
    productId: string;
    name: string;
    quantity: number;
    revenue: number;
  }>;
  lastOrders: Order[];
};

export async function getAdminStats(limitTop = 10, limitLastOrders = 10): Promise<AdminStats> {
  const orders = await readOrders();
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total ?? 0), 0);

  const agg = new Map<string, { productId: string; name: string; quantity: number; revenue: number }>();
  for (const order of orders) {
    for (const item of order.items ?? []) {
      const key = item.productId;
      const current = agg.get(key) ?? { productId: key, name: item.name, quantity: 0, revenue: 0 };
      current.quantity += item.quantity;
      current.revenue += item.price * item.quantity;
      current.name = item.name || current.name;
      agg.set(key, current);
    }
  }

  const topProducts = Array.from(agg.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limitTop);

  const lastOrders = orders.slice(0, limitLastOrders);
  return { totalOrders, totalRevenue, topProducts, lastOrders };
}


export async function seedOrders(
  products: Array<{ id: string; name: string; price: number }>,
  count = 20
) {
  let inserted = 0;
  for (let i = 0; i < count; i++) {
    const itemsCount = 1 + Math.floor(Math.random() * 4);
    const items: OrderItem[] = [];
    for (let j = 0; j < itemsCount; j++) {
      const p = products[Math.floor(Math.random() * products.length)];
      const quantity = 1 + Math.floor(Math.random() * 3);
      items.push({ productId: p.id, name: p.name, price: p.price, quantity });
    }
    await addOrder({ items, source: "seed" });
    inserted++;
  }
  return inserted;
}
