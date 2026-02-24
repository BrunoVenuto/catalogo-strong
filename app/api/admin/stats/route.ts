import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  if (!(await isAdmin(supabase))) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  // 1. Total orders
  const { count: totalOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true });

  // 2. Fetch all order items for revenue and top products
  const { data: allItems } = await supabase
    .from("order_items")
    .select(`
      product_id,
      price,
      quantity,
      products ( name )
    `);

  let totalRevenue = 0;
  const productStats: Record<string, { name: string; quantity: number; revenue: number }> = {};

  if (allItems) {
    for (const item of allItems) {
      const lineTotal = item.price * item.quantity;
      totalRevenue += lineTotal;
      
      const pId = item.product_id;
      const pName = (item.products as any)?.name || "Produto Desconhecido";
      
      if (!productStats[pId]) {
        productStats[pId] = { name: pName, quantity: 0, revenue: 0 };
      }
      productStats[pId].quantity += item.quantity;
      productStats[pId].revenue += lineTotal;
    }
  }

  const topProducts = Object.entries(productStats)
    .map(([productId, stats]) => ({
      productId,
      ...stats
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // 3. Last 5 orders
  const { data: lastOrdersData } = await supabase
    .from("orders")
    .select(`
      id,
      created_at,
      order_items (
        quantity,
        price,
        products ( name )
      )
    `)
    .order("created_at", { ascending: false })
    .limit(5);

  const lastOrders = (lastOrdersData || []).map(order => {
    let total = 0;
    const items = (order.order_items || []).map((it: any) => {
      total += it.price * it.quantity;
      return {
        name: it.products?.name || "Produto Desconhecido",
        quantity: it.quantity
      };
    });

    return {
      id: order.id,
      createdAt: order.created_at,
      total,
      items
    };
  });

  return NextResponse.json({
    totalOrders: totalOrders ?? 0,
    totalRevenue,
    topProducts,
    lastOrders,
  });
}