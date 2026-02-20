"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void;
};

export default function LeadModal({ open, onClose, onConfirm }: Props) {
  const [name, setName] = useState("");

  function handleNameChange(value: string) {
    // aceita apenas letras, espaços e acentos
    const sanitized = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");
    setName(sanitized);
  }

  function handleConfirm() {
    const finalName = name.trim();
    if (!finalName) return;

    onConfirm(finalName);
    setName("");
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="
              w-full max-w-sm
              bg-neutral-950 text-white
              rounded-xl p-6
            "
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">
              Antes de enviar o pedido
            </h2>

            <p className="text-neutral-300 mb-4 text-sm">
              Informe seu nome para identificação.  
              O pagamento será feito via <strong>PIX</strong>.
            </p>

            <input
              type="text"
              inputMode="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="
                w-full mb-4
                bg-black border border-white/20
                rounded-lg px-4 py-3
                text-white placeholder-neutral-400
                focus:outline-none focus:border-green-500
              "
            />

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="
                  flex-1 py-3 rounded-lg
                  border border-white/30
                  text-white
                "
              >
                Cancelar
              </button>

              <button
                onClick={handleConfirm}
                className="
                  flex-1 py-3 rounded-lg
                  bg-green-600 text-black
                  font-bold
                  hover:brightness-110
                "
              >
                Enviar pedido
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
