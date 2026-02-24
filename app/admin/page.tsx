export const dynamic = "force-dynamic";

import SeedButton from "./SeedButton";
import { createClient } from "@supabase/supabase-js";

type Stats = {
  totalOrders: number;
  totalRevenue: number;
  topProducts: Array<{ productId: string; name: string; quantity: number; revenue: number }>;
  lastOrders: Array<{ id: string; createdAt: string; total: number; items: Array<{ name: string; quantity: number }> }>;
};

function money(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v || 0);
}

export default async function AdminPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  let stats: Stats = { totalOrders: 0, totalRevenue: 0, topProducts: [], lastOrders: [] };

  try {
    const { count: totalOrders } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true });

    const { data: allItems } = await supabase
      .from("order_items")
      .select(`
        order_id,
        product_id,
        price,
        quantity
      `);

    const { data: allProducts } = await supabase
      .from("products")
      .select("id, name");

    const productNames = new Map<string, string>();
    if (allProducts) {
      for (const p of allProducts) {
        productNames.set(String(p.id), p.name);
      }
    }

    let totalRevenue = 0;
    const productStats: Record<string, { name: string; quantity: number; revenue: number }> = {};

    if (allItems) {
      for (const item of allItems) {
        const lineTotal = item.price * item.quantity;
        totalRevenue += lineTotal;

        const pId = String(item.product_id);
        const pName = productNames.get(pId) || "Produto Desconhecido";

        if (!productStats[pId]) {
          productStats[pId] = { name: pName, quantity: 0, revenue: 0 };
        }
        productStats[pId].quantity += item.quantity;
        productStats[pId].revenue += lineTotal;
      }
    }

    const topProducts = Object.entries(productStats)
      .map(([productId, pstats]) => ({
        productId,
        ...pstats
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const { data: lastOrdersData } = await supabase
      .from("orders")
      .select(`
        id,
        created_at
      `)
      .order("created_at", { ascending: false })
      .limit(5);

    const lastOrders = (lastOrdersData || []).map(order => {
      let total = 0;

      // Encontrar apenas os itens deste pedido em memória
      const itemsOfThisOrder = (allItems || []).filter(it => String(it.order_id) === String(order.id));

      const items = itemsOfThisOrder.map((it) => {
        total += it.price * it.quantity;
        const name = productNames.get(String(it.product_id)) || "Produto Desconhecido";
        return {
          name,
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

    stats = {
      totalOrders: totalOrders ?? 0,
      totalRevenue,
      topProducts,
      lastOrders,
    };
  } catch (error) {
    console.error("Failed to load DB stats directly in admin page", error);
  }

  return (
    <main className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-zinc-300">
          Dica: gere pedidos de exemplo para testar agora.
        </div>
        <SeedButton />
      </div>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <div className="text-sm text-zinc-400">Pedidos</div>
          <div className="mt-2 text-3xl font-semibold">{stats.totalOrders}</div>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <div className="text-sm text-zinc-400">Faturamento</div>
          <div className="mt-2 text-3xl font-semibold">{money(stats.totalRevenue)}</div>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <div className="text-sm text-zinc-400">Produtos campeões</div>
          <div className="mt-2 text-3xl font-semibold">{stats.topProducts?.length ?? 0}</div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <h2 className="mb-4 text-base font-semibold">Top produtos (por faturamento)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-zinc-400">
                <tr>
                  <th className="py-2">Produto</th>
                  <th className="py-2">Qtd</th>
                  <th className="py-2">Faturou</th>
                </tr>
              </thead>
              <tbody>
                {stats.topProducts?.map((p) => (
                  <tr key={p.productId} className="border-t border-zinc-800">
                    <td className="py-2 pr-4">{p.name}</td>
                    <td className="py-2">{p.quantity}</td>
                    <td className="py-2">{money(p.revenue)}</td>
                  </tr>
                ))}
                {(!stats.topProducts || stats.topProducts.length === 0) && (
                  <tr>
                    <td className="py-3 text-zinc-400" colSpan={3}>
                      Sem dados ainda. Clique em “Gerar pedidos de exemplo”.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <h2 className="mb-4 text-base font-semibold">Últimos pedidos</h2>
          <div className="space-y-3">
            {stats.lastOrders?.map((o) => (
              <div key={o.id} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm text-zinc-300">
                    {new Date(o.createdAt).toLocaleString("pt-BR")}
                  </div>
                  <div className="text-sm font-semibold">{money(o.total)}</div>
                </div>
                <div className="mt-2 text-sm text-zinc-400">
                  {(o.items || []).map((it, idx) => (
                    <span key={idx}>
                      {it.quantity}x {it.name}
                      {idx < (o.items.length - 1) ? ", " : ""}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            {(!stats.lastOrders || stats.lastOrders.length === 0) && (
              <div className="text-sm text-zinc-400">Sem pedidos ainda.</div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
