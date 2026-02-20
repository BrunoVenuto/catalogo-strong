"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const next = useMemo(() => {
    const value = searchParams.get("next");
    if (!value) return "/admin";
    if (!value.startsWith("/")) return "/admin";
    return value;
  }, [searchParams]);

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error || "Senha inválida");
        setLoading(false);
        return;
      }

      router.replace(next);
    } catch {
      setError("Erro ao tentar entrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow">
          <h1 className="text-xl font-semibold">Entrar no Admin</h1>
          <p className="mt-1 text-sm text-zinc-300">
            Digite a senha para acessar o painel.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-3">
            <label className="block text-sm">
              <span className="text-zinc-200">Senha</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-zinc-600"
                placeholder="••••••••"
                required
              />
            </label>

            {error ? (
              <p className="text-sm text-red-300">{error}</p>
            ) : (
              <p className="text-xs text-zinc-400">
                Dica: você pode definir a senha via{" "}
                <code className="text-zinc-200">ADMIN_PASSWORD</code>.
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-emerald-400 disabled:opacity-60"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-zinc-500">
          Acesso protegido por senha (cookie HttpOnly).
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Carregando...</div>}>
      <LoginContent />
    </Suspense>
  );
}