"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = useMemo(() => searchParams.get("next") || "/admin", [searchParams]);
  const initialError = useMemo(() => searchParams.get("error"), [searchParams]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    initialError === "not_admin" ? "Seu usuário não tem permissão de admin." : null
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createSupabaseBrowserClient();

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message || "Falha ao autenticar");
      setLoading(false);
      return;
    }

    // middleware vai validar se é admin
    router.replace(next);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow">
          <h1 className="text-xl font-semibold">Entrar no Admin</h1>
          <p className="mt-1 text-sm text-zinc-300">
            Faça login com seu usuário do Supabase.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-3">
            <label className="block text-sm">
              <span className="text-zinc-200">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                placeholder="admin@empresa.com"
              />
            </label>

            <label className="block text-sm">
              <span className="text-zinc-200">Senha</span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-zinc-500"
              />
            </label>

            {error && (
              <div className="rounded-xl border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-200">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              className="w-full rounded-xl bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-900 disabled:opacity-60"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="mt-4 text-xs text-zinc-400">
            Dica: você precisa estar na tabela <code>admin_users</code> para acessar o painel.
          </p>
        </div>
      </div>
    </div>
  );
}
