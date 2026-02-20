"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/config/products";

type Props = {
  open: boolean;
  onClose: () => void;
  product: Product;
  onAddToCart: () => void;
};

export default function ProductModal({
  open,
  onClose,
  product,
  onAddToCart,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="bg-neutral-950 rounded-xl p-6 w-full max-w-sm text-white"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
          >
            {/* FECHAR */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white text-xl"
            >
              ✕
            </button>

            {/* IMAGEM */}
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-56 object-contain mb-4"
            />

            {/* NOME DO PRODUTO */}
            <h2 className="text-xl font-bold mb-2 text-center">
              {product.name}
            </h2>

            {/* PREÇO */}
            <p className="text-green-400 font-semibold mb-6 text-center">
              R$ {product.price.toFixed(2)}
            </p>

            {/* BOTÃO */}
            <button
              onClick={() => {
                onAddToCart();
                onClose();
              }}
              className="w-full bg-green-600 text-black py-3 rounded-lg font-bold hover:brightness-110 transition"
            >
              Adicionar ao orçamento
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
