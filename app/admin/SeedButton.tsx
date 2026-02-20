"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SeedButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSeed() {
    setLoading(true);
    try {
      await fetch("/api/orders/seed", { method: "POST" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleSeed}
      disabled={loading}
      className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-yellow-300 disabled:opacity-60"
    >
      {loading ? "Gerando..." : "Gerar pedidos de exemplo"}
    </button>
  );
}
