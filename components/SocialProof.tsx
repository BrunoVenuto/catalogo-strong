"use client";

import { motion } from "framer-motion";

const testimonials = [
  { name: "Carlos M.", text: "Produto excelente, qualidade muito acima da expectativa." },
  { name: "Mariana S.", text: "Chegou rápido e o acabamento é impecável. Recomendo!" },
  { name: "Ricardo P.", text: "Material de altíssima qualidade. Comprarei novamente." },
  { name: "Fernanda L.", text: "Muito superior a outras marcas que já testei." },
  { name: "André T.", text: "Atendimento ótimo e produto top de linha." },
  { name: "Juliana R.", text: "Vale cada centavo. Produto realmente premium." },
];

function getInitials(name: string) {
  const parts = name.split(" ");
  if (parts.length === 1) return parts[0][0];
  return parts[0][0] + parts[1][0];
}

export default function SocialProof() {
  return (
    <section className="py-24 bg-black text-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-center mb-16"
        >
          O que nossos clientes dizem
        </motion.h2>

        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -6 }}
              className="bg-neutral-900 border border-white/10 rounded-xl p-6 hover:border-yellow-400/40 transition"
            >
              {/* Topo */}
              <div className="flex items-center gap-4 mb-4">
                {/* Avatar com iniciais */}
                <div className="w-12 h-12 rounded-full bg-yellow-400 text-black font-bold flex items-center justify-center">
                  {getInitials(t.name)}
                </div>

                <div>
                  <p className="font-semibold">{t.name}</p>

                  {/* Estrelas */}
                  <div className="flex gap-1 text-yellow-400">
                    {"★★★★★".split("").map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Texto */}
              <p className="text-neutral-300 leading-relaxed">
                “{t.text}”
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
