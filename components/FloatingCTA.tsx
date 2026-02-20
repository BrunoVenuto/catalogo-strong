"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LeadModalConsultoria from "./LeadModalConsultoria";
import { siteConfig } from "@/config/site";

type ConsultoriaData = {
  name: string;
  phone: string;
  goal: string;
};

export default function FloatingCTA() {
  const [open, setOpen] = useState(false);

  // 💬 NÚMERO CORRETO DA CONSULTORIA (somente dígitos)
  const whatsappConsultoria = useMemo(
    () => String(siteConfig.whatsappConsultoria || "").replace(/\D/g, ""),
    []
  );

  useEffect(() => {
    function handleOpen() {
      setOpen(true);
    }

    document.addEventListener("open-consultoria", handleOpen as EventListener);

    return () => {
      document.removeEventListener("open-consultoria", handleOpen as EventListener);
    };
  }, []);

  function openWhatsApp(message: string) {
    if (!whatsappConsultoria || whatsappConsultoria.length < 10) {
      alert("Número de consultoria inválido no config/site.ts");
      return;
    }

    window.open(
      `https://wa.me/${whatsappConsultoria}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  }

  function handleSubmit(data: ConsultoriaData) {
    const message =
      `Olá, meu nome é ${data.name}.\n` +
      `Telefone: ${data.phone}\n` +
      `Objetivo: ${data.goal}\n\n` +
      `Gostaria de uma consultoria antes de fazer meu pedido.`;

    // ✅ AGORA VAI PARA O NÚMERO CERTO
    openWhatsApp(message);
    setOpen(false);
  }

  return (
    <>
      {/* BOTÃO FLUTUANTE */}
      <motion.button
        onClick={() => setOpen(true)}
        className="
          hidden md:flex
          fixed bottom-24 right-6 z-50
          bg-yellow-400 text-black
          px-5 py-3 rounded-full
          font-extrabold
          shadow-[0_0_25px_rgba(250,204,21,0.6)]
          items-center gap-2
        "
        animate={{
          scale: [1, 1.12, 1],
          boxShadow: [
            "0 0 15px rgba(250,204,21,0.4)",
            "0 0 30px rgba(250,204,21,0.9)",
            "0 0 15px rgba(250,204,21,0.4)",
          ],
        }}
        transition={{ duration: 1.4, repeat: Infinity }}
      >
        💬 Consultoria
      </motion.button>

      {/* MODAL */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <LeadModalConsultoria
                open={open}
                onClose={() => setOpen(false)}
                onSubmit={handleSubmit}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
