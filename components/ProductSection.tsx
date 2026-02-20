"use client";

import { useEffect, useMemo, useState } from "react";
import { Product } from "@/config/products";
import { addToCart } from "@/lib/cart";

import ProductCard from "./ProductCard";
import CategoryCarousel from "./CategoryCarousel";

export default function ProductSection() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/products", { cache: "no-store" });
    const data = await res.json().catch(() => ({}));
    setAllProducts(Array.isArray(data.products) ? data.products : []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const categories: string[] = useMemo(
    () => ["Todos", ...Array.from(new Set(allProducts.map((p) => p.category)))],
    [allProducts]
  );

  const [activeCategory, setActiveCategory] = useState<string>("Todos");
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filtered = allProducts
    .filter((p) =>
      activeCategory === "Todos" ? true : p.category === activeCategory
    )
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <section id="products" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-white">
            Produtos
          </h2>
          <button
            onClick={load}
            className="mb-10 rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white"
          >
            Atualizar
          </button>
        </div>

        {loading ? (
          <p className="text-neutral-400">Carregando produtos...</p>
        ) : null}

        {/* BUSCA */}
        <input
          type="text"
          placeholder="Buscar produto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            mb-8 w-full md:w-96 px-4 py-3 rounded-lg
            bg-neutral-900 text-white
            border border-neutral-700
            focus:outline-none focus:border-yellow-400
          "
        />

        {/* CATEGORIAS */}
        <CategoryCarousel
          categories={categories}
          active={activeCategory}
          onChange={setActiveCategory}
        />

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpen={() => setSelectedProduct(product)}
              onAdd={() => addToCart(product)}
            />
          ))}
        </div>

        {/* MODAL */}
        {selectedProduct ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onClick={() => setSelectedProduct(null)}
          >
            <div className="w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
              {/* Reuse existing ProductModal via dynamic import to avoid rework */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6 text-white">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl font-semibold">{selectedProduct.name}</h3>
                  <button
                    className="rounded-lg border border-neutral-700 px-2 py-1 text-sm"
                    onClick={() => setSelectedProduct(null)}
                  >
                    Fechar
                  </button>
                </div>
                {selectedProduct.image ? (
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="mt-4 h-64 w-full rounded-xl object-cover"
                  />
                ) : null}
                <p className="mt-4 text-neutral-300">{selectedProduct.description}</p>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-lg font-semibold">
                    R$ {Number(selectedProduct.price).toFixed(2)}
                  </span>
                  <button
                    className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black"
                    onClick={() => addToCart(selectedProduct)}
                  >
                    Adicionar ao carrinho
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
