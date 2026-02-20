"use client";

import { motion } from "framer-motion";
import { Product } from "@/config/products";

type Props = {
  product: Product;
  onAddToCart: () => void;
  onOpen: () => void;
};

export default function ProductCard({ product, onAddToCart, onOpen }: Props) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-neutral-900 rounded-xl p-4 flex flex-col"
    >
      {/* IMAGEM */}
      <button onClick={onOpen}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-contain mb-4"
        />
      </button>

      {/* NOME DO PRODUTO */}
      <h3 className="text-white font-bold text-sm md:text-base mb-2 text-center">
        {product.name}
      </h3>

      {/* PREÇO */}
      <p className="text-green-400 font-semibold mb-4 text-center">
        R$ {product.price.toFixed(2)}
      </p>

      {/* BOTÃO */}
      <button
        onClick={onAddToCart}
        className="mt-auto bg-green-600 text-black py-3 rounded-lg font-bold hover:brightness-110 transition"
      >
        Adicionar ao orçamento
      </button>
    </motion.div>
  );
}
