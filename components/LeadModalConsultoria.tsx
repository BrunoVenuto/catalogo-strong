"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export default function LeadModalConsultoria({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    phone: string;
    goal: string;
  }) => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [goal, setGoal] = useState("");

  function handleSubmit() {
    if (!name || !phone || !goal) return;
    onSubmit({ name, phone, goal });
    setName("");
    setPhone("");
    setGoal("");
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center px-4"
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-sm bg-neutral-950 text-white rounded-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">
              Solicitar consultoria
            </h2>

            <input
              placeholder="Seu nome"
              value={name}
              onChange={(e) =>
                setName(e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, ""))
              }
              className="w-full mb-3 bg-black border border-white/20 rounded-lg px-4 py-3"
            />

            <input
              placeholder="Telefone / WhatsApp"
              value={phone}
              inputMode="numeric"
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, ""))
              }
              className="w-full mb-3 bg-black border border-white/20 rounded-lg px-4 py-3"
            />

            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full mb-4 bg-black border border-white/20 rounded-lg px-4 py-3"
            >
              <option value="">Objetivo</option>
              <option value="Hipertrofia">Hipertrofia</option>
              <option value="Definição">Definição</option>
              <option value="Performance">Performance</option>
              <option value="Outro">Outro</option>
            </select>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-lg border border-white/30"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-3 rounded-lg bg-yellow-400 text-black font-bold"
              >
                Enviar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
