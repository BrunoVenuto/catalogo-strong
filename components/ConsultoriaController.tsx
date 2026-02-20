"use client";

import { useEffect, useMemo, useState } from "react";
import LeadModalConsultoria from "./LeadModalConsultoria";
import { siteConfig } from "@/config/site";

type ConsultoriaData = {
  name: string;
  phone: string;
  goal: string;
};

export default function ConsultoriaController() {
  const [open, setOpen] = useState(false);

  // 💬 NÚMERO CORRETO DA CONSULTORIA (somente dígitos)
  const whatsappConsultoria = useMemo(
    () => String(siteConfig.whatsappConsultoria || "").replace(/\D/g, ""),
    []
  );

  useEffect(() => {
    function openModal() {
      setOpen(true);
    }

    document.addEventListener("open-consultoria", openModal as EventListener);
    window.addEventListener("open-consultoria", openModal as EventListener);

    return () => {
      document.removeEventListener("open-consultoria", openModal as EventListener);
      window.removeEventListener("open-consultoria", openModal as EventListener);
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
    <LeadModalConsultoria
      open={open}
      onClose={() => setOpen(false)}
      onSubmit={handleSubmit}
    />
  );
}
