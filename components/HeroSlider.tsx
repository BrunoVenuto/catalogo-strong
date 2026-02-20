"use client";

import { siteConfig } from "@/config/site";
import { motion } from "framer-motion";

export default function HeroSlider() {
  function scrollToProducts() {
    const el = document.getElementById("products");
    if (!el) return;

    const headerOffset = 80; // altura do header
    const elementPosition = el.getBoundingClientRect().top;
    const offsetPosition =
      elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }

  return (
    <section className="relative h-screen md:h-[90vh] overflow-hidden bg-black">
      {/* IMAGEM DESKTOP */}
      <img
        src={siteConfig.hero.imageDesktop}
        alt="Hero desktop"
        className="absolute inset-0 w-full h-full object-cover hidden md:block"
      />

      {/* IMAGEM MOBILE */}
      <img
        src={siteConfig.hero.imageMobile}
        alt="Hero mobile"
        className="absolute inset-0 w-full h-full object-cover object-right md:hidden"
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/60" />

      {/* CONTEÚDO */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold text-white leading-tight max-w-3xl"
          >
            {siteConfig.hero.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-neutral-200 max-w-xl mt-6"
          >
            {siteConfig.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-10"
          >
            <button
              onClick={scrollToProducts}
              className="
                bg-green-600 text-black
                px-10 py-4
                rounded-xl
                font-bold
                hover:brightness-110
                transition
              "
            >
              {siteConfig.hero.cta}
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
