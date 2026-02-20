"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getCart, clearCart, removeFromCart } from "@/lib/cart";
import LeadModalPedido, { PedidoLeadData } from "./LeadModalPedido";
import LeadModalConsultoria from "./LeadModalConsultoria";
import { Product } from "@/config/products";
import { siteConfig } from "@/config/site";
import { useRouter } from "next/navigation";

type ConsultoriaData = {
  name: string;
  phone: string;
  goal: string;
};

export default function CartDrawer() {
  const [open, setOpen] = useState(false);
  const [pedidoOpen, setPedidoOpen] = useState(false);
  const [consultoriaOpen, setConsultoriaOpen] = useState(false);
  const [items, setItems] = useState<Product[]>([]);
  const router = useRouter();

  const whatsappPedido = useMemo(
    () => String(siteConfig.whatsappPedido || siteConfig.whatsapp || "").replace(/\D/g, ""),
    []
  );

  const whatsappConsultoria = useMemo(
    () => String(siteConfig.whatsappConsultoria || "").replace(/\D/g, ""),
    []
  );

  useEffect(() => {
    function update() {
      setItems(getCart());
    }

    update();
    window.addEventListener("cart:update", update);
    window.addEventListener("cart:add", update);

    return () => {
      window.removeEventListener("cart:update", update);
      window.removeEventListener("cart:add", update);
    };
  }, []);

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + Number(item.price), 0);
  }, [items]);

  function openWhatsApp(to: string, message: string) {
    if (!to || to.length < 10) {
      alert("Número do WhatsApp inválido no config/site.ts (use somente dígitos).");
      return;
    }

    window.open(
      `https://wa.me/${to}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  }

  function handleRemove(index: number) {
    removeFromCart(index);
    setItems(getCart());
  }

  function handleClear() {
    clearCart();
    setItems([]);
  }

  // ✅ Pedido: recebe todos os campos do modal
  async function handleConfirmPedido(data: PedidoLeadData) {
    const productsText = items
      .map((item) => `- ${item.name} — R$ ${Number(item.price).toFixed(2)}`)
      .join("\n");

    // ✅ Registra o pedido para o painel /admin (pedido "real" = checkout/enviar pedido)
    // O carrinho armazena itens repetidos; aqui agregamos por produto para obter quantidade correta.
    try {
      const agg = new Map<number, { productId: string; name: string; price: number; quantity: number }>();

      for (const it of items) {
        const key = Number(it.id);
        const current = agg.get(key) ?? {
          productId: String(it.id),
          name: it.name,
          price: Number(it.price),
          quantity: 0,
        };
        current.quantity += 1;
        agg.set(key, current);
      }

      const orderItems = Array.from(agg.values());

      // Envia para a API (server) persistir e gerar métricas
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: orderItems,
          total,
          source: "checkout",
          customer: {
            name: data.name,
            phone: data.phone,
            cep: data.cep,
            cpf: data.cpf,
            city: data.city,
          },
        }),
      });
    } catch (err) {
      console.error("Falha ao registrar pedido no painel:", err);
      // Não bloqueia o pedido no WhatsApp, mas avisa.
      alert("Não foi possível registrar o pedido no painel. Seu pedido no WhatsApp será enviado mesmo assim.");
    }


    // ✅ Sem a frase "COPIE ESSA MENSAGEM E EDITE"
    const message =
      `NOVO PEDIDO\n\n` +
      `DADOS DO CLIENTE\n` +
      `Nome: ${data.name}\n` +
      `CEP: ${data.cep}\n` +
      `Telefone (DDD): ${data.phone}\n` +
      `CPF: ${data.cpf}\n` +
      `Rua: ${data.street}\n` +
      `Número: ${data.number}\n` +
      `Bairro: ${data.neighborhood}\n` +
      `Cidade: ${data.city}\n` +
      `Ponto de referência: ${data.reference || "—"}\n\n` +
      `PRODUTOS\n${productsText}\n\n` +
      `TOTAL: R$ ${total.toFixed(2)}\n\n` +
      `Por favor, me envie a CHAVE PIX para pagamento.`;

    openWhatsApp(whatsappPedido, message);

    handleClear();
    setPedidoOpen(false);
    setOpen(false);

    setTimeout(() => {
      router.push("/#products");
    }, 300);
  }

  function handleConsultoriaSubmit(data: ConsultoriaData) {
    const message =
      `Olá, meu nome é ${data.name}.\n` +
      `Telefone: ${data.phone}\n` +
      `Objetivo: ${data.goal}\n\n` +
      `Gostaria de uma consultoria antes de fazer meu pedido.`;

    openWhatsApp(whatsappConsultoria, message);
    setConsultoriaOpen(false);
  }

  if (items.length === 0) return null;

  return (
    <>
      {/* BOTÃO DO CARRINHO */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-green-600 w-14 h-14 rounded-full flex items-center justify-center"
      >
        🛒
        <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
          {items.length}
        </span>
      </button>

      {/* DRAWER */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/60"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute right-0 top-0 h-full w-full max-w-md bg-neutral-950 p-6 text-white flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Seu orçamento</h2>
                <button onClick={() => setOpen(false)}>✕</button>
              </div>

              <div className="flex-1 space-y-4 overflow-auto">
                {items.map((item, index) => (
                  <div
                    key={`${item.name}-${index}`}
                    className="flex justify-between border-b border-white/10 pb-2"
                  >
                    <div>
                      <p>{item.name}</p>
                      <p className="text-green-400 text-sm">
                        R$ {Number(item.price).toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemove(index)}
                      className="text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-white/10 pt-4 space-y-4">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-green-400">R$ {total.toFixed(2)}</span>
                </div>

                <button
                  onClick={() => setPedidoOpen(true)}
                  className="w-full bg-green-600 py-3 rounded-lg font-bold text-black"
                >
                  Enviar pedido
                </button>

                <button
                  onClick={() => setConsultoriaOpen(true)}
                  className="w-full bg-yellow-400 py-3 rounded-lg font-bold text-black"
                >
                  💬 Solicitar consultoria
                </button>

                <button
                  onClick={handleClear}
                  className="w-full border border-white/20 py-3 rounded-lg font-bold"
                >
                  Limpar carrinho
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAIS */}
      <LeadModalPedido
        open={pedidoOpen}
        onClose={() => setPedidoOpen(false)}
        onConfirm={handleConfirmPedido}
      />

      <LeadModalConsultoria
        open={consultoriaOpen}
        onClose={() => setConsultoriaOpen(false)}
        onSubmit={handleConsultoriaSubmit}
      />
    </>
  );
}
