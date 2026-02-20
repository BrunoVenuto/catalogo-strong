import SeedButton from "./SeedButton";
import { headers } from "next/headers";

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
  const h = await headers();
  const host = h.get("host");
  const proto = process.env.NODE_ENV === "development" ? "http" : "https";
  const base = host ? `${proto}://${host}` : "";

  const res = await fetch(`${base}/api/admin/stats`, { cache: "no-store" });
  const stats = (await res.json()) as Stats;

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
