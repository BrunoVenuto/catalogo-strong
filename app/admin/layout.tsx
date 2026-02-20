export const metadata = {
  title: "Admin | Strong Suplementos",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <header className="mb-8 flex flex-col gap-2">
          <h1 className="text-2xl font-semibold">Painel Administrativo</h1>
          <p className="text-sm text-zinc-300">
            Métricas de pedidos, faturamento e produtos campeões.
          </p>
          <nav className="mt-2 flex flex-wrap gap-2 text-sm">
            <a
              href="/admin"
              className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 hover:bg-zinc-800"
            >
              Dashboard
            </a>
            <a
              href="/admin/produtos"
              className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 hover:bg-zinc-800"
            >
              Produtos
            </a>
            <a
              href="/api/admin/logout"
              className="ml-auto rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-zinc-200 hover:bg-zinc-800"
            >
              Sair
            </a>
          </nav>
        </header>
        {children}
      </div>
    </div>
  );
}
