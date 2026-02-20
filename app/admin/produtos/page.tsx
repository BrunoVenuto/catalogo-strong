"use client";

import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/config/products";

type Draft = {
  id?: number;
  name: string;
  price: string; // input
  category: string;
  description: string;
  image: string; // url or dataURL
  active?: boolean;
};

function emptyDraft(): Draft {
  return {
    name: "",
    price: "",
    category: "Linha Gold",
    description: "",
    image: "",
    active: true,
  };
}

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Falha ao ler arquivo"));
    reader.readAsDataURL(file);
  });
}

export default function AdminProdutosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [draft, setDraft] = useState<Draft>(emptyDraft());
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    const res = await fetch("/api/products", { cache: "no-store" });
    const data = await res.json().catch(() => ({}));
    setProducts(Array.isArray(data.products) ? data.products : []);
  }

  useEffect(() => {
    refresh();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [products, search]);

  function startCreate() {
    setEditingId(null);
    setDraft(emptyDraft());
    setError(null);
  }

  function startEdit(p: Product) {
    setEditingId(p.id);
    setDraft({
      id: p.id,
      name: p.name,
      price: String(p.price ?? ""),
      category: p.category,
      description: p.description,
      image: p.image,
      active: (p as any).active ?? true,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
    setError(null);
  }

  async function removeProduct(id: number) {
    if (!confirm("Excluir este produto?") ) return;
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data?.error || "Falha ao excluir");
    } else {
      await refresh();
    }
    setBusy(false);
  }

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const dataUrl = await fileToDataUrl(file);
      setDraft((d) => ({ ...d, image: dataUrl }));
    } catch (err: any) {
      setError(err?.message || "Falha ao carregar imagem");
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    setBusy(true);
    setError(null);

    const payload: any = {
      name: draft.name.trim(),
      price: Number(draft.price),
      category: draft.category.trim(),
      description: draft.description.trim(),
      image: draft.image,
      active: draft.active ?? true,
    };

    if (!payload.name || Number.isNaN(payload.price)) {
      setError("Nome e preço são obrigatórios.");
      setBusy(false);
      return;
    }

    const isEdit = editingId != null;
    if (isEdit) payload.id = editingId;

    const res = await fetch("/api/products", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data?.error || "Falha ao salvar");
      setBusy(false);
      return;
    }

    await refresh();
    startCreate();
    setBusy(false);
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">
              {editingId ? "Editar produto" : "Novo produto"}
            </h2>
            <p className="text-sm text-zinc-300">
              Produtos são salvos no Supabase (tabela <code>products</code>).
            </p>
          </div>
          <button
            onClick={refresh}
            className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          >
            Atualizar
          </button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <label className="text-sm">
            <span className="text-zinc-200">Nome</span>
            <input
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none"
            />
          </label>

          <label className="text-sm">
            <span className="text-zinc-200">Preço</span>
            <input
              value={draft.price}
              onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))}
              inputMode="decimal"
              className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none"
            />
          </label>

          <label className="text-sm">
            <span className="text-zinc-200">Categoria</span>
            <input
              value={draft.category}
              onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none"
            />
          </label>

          <label className="text-sm">
            <span className="text-zinc-200">Ativo</span>
            <select
              value={String(draft.active ?? true)}
              onChange={(e) => setDraft((d) => ({ ...d, active: e.target.value === "true" }))}
              className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none"
            >
              <option value="true">Sim</option>
              <option value="false">Não</option>
            </select>
          </label>

          <label className="text-sm md:col-span-2">
            <span className="text-zinc-200">Descrição</span>
            <textarea
              value={draft.description}
              onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
              rows={4}
              className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none"
            />
          </label>

          <div className="md:col-span-2">
            <div className="flex flex-wrap items-center gap-3">
              <label className="text-sm">
                <span className="text-zinc-200">Imagem</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onPickFile}
                  className="mt-1 block w-full text-sm"
                />
              </label>

              <label className="text-sm flex-1">
                <span className="text-zinc-200">Ou URL/Base64</span>
                <input
                  value={draft.image}
                  onChange={(e) => setDraft((d) => ({ ...d, image: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none"
                  placeholder="https://... ou data:image/...base64"
                />
              </label>
            </div>

            {draft.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={draft.image}
                alt="Preview"
                className="mt-3 h-40 w-40 rounded-xl object-cover border border-zinc-800"
              />
            ) : null}
          </div>

          {error ? (
            <div className="md:col-span-2 rounded-xl border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          <div className="md:col-span-2 flex flex-wrap gap-2">
            <button
              onClick={save}
              disabled={busy}
              className="rounded-xl bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-900 disabled:opacity-60"
            >
              {busy ? "Salvando..." : editingId ? "Salvar alterações" : "Criar"}
            </button>
            <button
              onClick={startCreate}
              className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm"
            >
              Limpar
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Produtos</h2>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar..."
            className="w-64 max-w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none"
          />
        </div>

        <div className="mt-4 grid gap-3">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-center gap-3">
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image} alt={p.name} className="h-14 w-14 rounded-xl object-cover" />
                ) : (
                  <div className="h-14 w-14 rounded-xl border border-zinc-800" />
                )}
                <div>
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-sm text-zinc-300">
                    {p.category} · R$ {Number(p.price).toFixed(2)} · {(p as any).active === false ? "Inativo" : "Ativo"}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => startEdit(p)}
                  className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => removeProduct(p.id)}
                  disabled={busy}
                  className="rounded-xl border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-200 disabled:opacity-60"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
