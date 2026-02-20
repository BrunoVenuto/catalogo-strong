"use client";

import { useParams, useRouter } from "next/navigation";
import { Product } from "@/config/products";
import { addToCart } from "@/lib/cart";
import { ensureProductsSeeded, getStoredProducts } from "@/lib/products-store";
import { useEffect, useMemo, useState } from "react";

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    ensureProductsSeeded();
    const load = () => setProducts(getStoredProducts());
    load();
    window.addEventListener("products:update", load);
    return () => window.removeEventListener("products:update", load);
  }, []);

  const product = useMemo(
    () => products.find((p) => p.id === Number(id)),
    [products, id]
  );

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Produto não encontrado
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-black py-24 pb-40">
      <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12">
        
        {/* IMAGEM */}
        <img
          src={product.image}
          alt={product.name}
          className="rounded-xl object-cover w-full bg-white p-6"
        />

        {/* CONTEÚDO */}
        <div>
          {/* VOLTAR */}
          <button
            onClick={() => router.back()}
            className="text-neutral-400 hover:text-white mb-6 transition"
          >
            ← Voltar
          </button>

          {/* NOME DO PRODUTO (COR FIXA) */}
          <h1
            className="
              text-3xl md:text-4xl
              font-bold
              text-white
              mb-4
            "
          >
            {product.name}
          </h1>

          {/* PREÇO */}
          <p
            className="
              text-emerald-400
              text-2xl md:text-3xl
              font-bold
              mb-6
            "
          >
            R$ {Number(product.price).toFixed(2)}
          </p>

          {/* DESCRIÇÃO */}
          <p
            className="
              text-neutral-300
              leading-relaxed
              mb-10
            "
          >
            {product.description}
          </p>

          {/* BOTÃO */}
          <button
            onClick={() => addToCart(product)}
            className="
              w-full md:w-auto
              bg-green-600 text-black
              px-10 py-4
              rounded-xl
              font-bold
              hover:brightness-110
              transition
            "
          >
            Adicionar ao orçamento
          </button>
        </div>
      </div>
    </section>
  );
}
