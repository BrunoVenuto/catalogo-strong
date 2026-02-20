"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

export type PedidoLeadData = {
  name: string;
  cep: string;
  phone: string; // com DDD (somente dígitos)
  cpf: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  reference: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: PedidoLeadData) => void;
};

export default function LeadModalPedido({ open, onClose, onConfirm }: Props) {
  const [name, setName] = useState("");
  const [cep, setCep] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [reference, setReference] = useState("");

  const cepDigits = useMemo(() => cep.replace(/\D/g, ""), [cep]);
  const phoneDigits = useMemo(() => phone.replace(/\D/g, ""), [phone]);
  const cpfDigits = useMemo(() => cpf.replace(/\D/g, ""), [cpf]);

  function onlyLettersSpaces(value: string) {
    return value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");
  }

  function onlyLettersSpacesHyphen(value: string) {
    return value.replace(/[^a-zA-ZÀ-ÿ\s-]/g, "");
  }

  function handleConfirm() {
    const data: PedidoLeadData = {
      name: name.trim(),
      cep: cepDigits.trim(),
      phone: phoneDigits.trim(),
      cpf: cpfDigits.trim(),
      street: street.trim(),
      number: number.trim(),
      neighborhood: neighborhood.trim(),
      city: city.trim(),
      reference: reference.trim(),
    };

    if (!data.name) return alert("Preencha o NOME.");
    if (data.cep.length !== 8) return alert("CEP inválido (8 dígitos).");
    if (data.phone.length < 10) return alert("Telefone inválido (com DDD).");
    if (data.cpf.length !== 11) return alert("CPF inválido (11 dígitos).");
    if (!data.street) return alert("Preencha a RUA.");
    if (!data.number) return alert("Preencha o NÚMERO.");
    if (!data.neighborhood) return alert("Preencha o BAIRRO.");
    if (!data.city) return alert("Preencha a CIDADE.");

    onConfirm(data);

    setName("");
    setCep("");
    setPhone("");
    setCpf("");
    setStreet("");
    setNumber("");
    setNeighborhood("");
    setCity("");
    setReference("");
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-black/70 flex items-end sm:items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            // ✅ Mobile-first: vira "bottom sheet" no mobile e modal no desktop
            className="
              w-full sm:max-w-md
              bg-neutral-950 text-white
              rounded-t-2xl sm:rounded-2xl
              border border-white/10
              flex flex-col
              max-h-[92vh]
            "
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-5 pt-5 pb-3 border-b border-white/10">
              <h2 className="text-lg font-bold">Finalizar pedido</h2>
              <p className="text-sm text-neutral-300 mt-2">
                ♦️ Suas informações devem estar corretas certifique-se disso!
              </p>
            </div>

            {/* Conteúdo com scroll (pra não cortar botão no iPhone) */}
            <div className="px-5 py-4 overflow-y-auto min-h-0">
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-neutral-200 block mb-1">Nome:</label>
                  <input
                    value={name}
                    onChange={(e) => setName(onlyLettersSpaces(e.target.value))}
                    placeholder="Seu nome completo"
                    className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-neutral-200 block mb-1">⚠️ CEP:</label>
                  <input
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    inputMode="numeric"
                    placeholder="Somente números (ex: 30140071)"
                    className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-neutral-200 block mb-1">☎️ TELEFONE:</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    inputMode="tel"
                    placeholder="DDD + número (ex: 21999999999)"
                    className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-neutral-200 block mb-1">CPF:</label>
                  <input
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    inputMode="numeric"
                    placeholder="Somente números (ex: 12345678901)"
                    className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-neutral-200 block mb-1">RUA:</label>
                  <input
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Ex: Rua das Flores"
                    className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-neutral-200 block mb-1">NÚMERO:</label>
                  <input
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="Ex: 123 / Apto 401"
                    className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-neutral-200 block mb-1">BAIRRO:</label>
                  <input
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    placeholder="Ex: Centro"
                    className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-neutral-200 block mb-1">CIDADE:</label>
                  <input
                    value={city}
                    onChange={(e) => setCity(onlyLettersSpacesHyphen(e.target.value))}
                    placeholder="Ex: Rio de Janeiro"
                    className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-neutral-200 block mb-1">
                    Ponto de referência:
                  </label>
                  <input
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="Ex: Próximo ao mercado X"
                    className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Footer fixo (sempre aparece no mobile) */}
            <div
              className="
                px-5 pt-3
                border-t border-white/10
                bg-neutral-950
                sticky bottom-0
              "
              style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}
            >
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-lg border border-white/30 hover:border-white/50"
                >
                  Cancelar
                </button>

                <button
                  onClick={handleConfirm}
                  className="flex-1 py-3 rounded-lg bg-green-600 text-black font-bold hover:brightness-110"
                >
                  Enviar pedido
                </button>
              </div>

              <p className="text-xs text-neutral-500 mt-3">
                *Se algum dado estiver errado, pode atrasar a entrega.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
