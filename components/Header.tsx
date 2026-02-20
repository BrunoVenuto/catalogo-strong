"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/config/site";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* HEADER */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-white/10"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 sm:h-18 md:h-20 flex items-center justify-between">
          {/* LOGO + NOME */}
          <Link href="/" className="flex items-center gap-3 min-w-0">
            <div
              className="
                relative
                h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12
                shrink-0
                rounded-xl
                overflow-hidden
                ring-1 ring-white/10
                bg-white/5
              "
            >
              <Image
                src="/images/logo.jpeg"
                alt={`${siteConfig.name} logo`}
                fill
                className="object-cover"
                priority
              />
            </div>

            <span
              className="
                truncate
                text-base sm:text-lg md:text-xl
                font-extrabold tracking-wide
                bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500
                bg-clip-text text-transparent
                drop-shadow-[0_0_8px_rgba(250,204,21,0.55)]
              "
            >
              {siteConfig.name}
            </span>
          </Link>

          {/* MENU (aparece no tablet e desktop) */}
          <nav className="hidden sm:flex items-center gap-5 md:gap-8 text-sm text-neutral-300">
            <Link href="/" className="hover:text-white transition">
              Home
            </Link>
            <Link href="/#collections" className="hover:text-white transition">
              Coleções
            </Link>
            <Link href="/#products" className="hover:text-white transition">
              Produtos
            </Link>
            <Link href="/#contact" className="hover:text-white transition">
              Contato
            </Link>

            {/* CTA (desktop/tablet) */}
            <button
              onClick={() =>
                document.dispatchEvent(new Event("open-consultoria"))
              }
              className="
                ml-2
                bg-yellow-400 text-black
                px-4 py-2 rounded-lg
                font-bold
                hover:brightness-110 transition
                text-sm
              "
            >
              💬 Consultoria
            </button>
          </nav>

          {/* HAMBURGUER (somente mobile) */}
          <button
            onClick={() => setOpen(true)}
            className="sm:hidden text-white text-3xl leading-none"
            aria-label="Abrir menu"
          >
            ☰
          </button>
        </div>
      </motion.header>

      {/* MENU MOBILE */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="absolute top-0 right-0 w-[85vw] max-w-xs h-full bg-neutral-950 p-6"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.28 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* TOPO */}
              <div className="flex items-center justify-between mb-8">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 min-w-0"
                >
                  <div className="relative h-10 w-10 shrink-0 rounded-xl overflow-hidden ring-1 ring-white/10 bg-white/5">
                    <Image
                      src="/logo.jpeg"
                      alt={`${siteConfig.name} logo`}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>

                  <span
                    className="
                      truncate
                      text-lg font-extrabold
                      bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500
                      bg-clip-text text-transparent
                    "
                  >
                    {siteConfig.name}
                  </span>
                </Link>

                <button
                  onClick={() => setOpen(false)}
                  className="text-white text-2xl"
                  aria-label="Fechar menu"
                >
                  ✕
                </button>
              </div>

              {/* NAV MOBILE */}
              <nav className="flex flex-col gap-5 text-lg text-neutral-200">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="hover:text-white transition"
                >
                  Home
                </Link>
                <Link
                  href="/#collections"
                  onClick={() => setOpen(false)}
                  className="hover:text-white transition"
                >
                  Coleções
                </Link>
                <Link
                  href="/#products"
                  onClick={() => setOpen(false)}
                  className="hover:text-white transition"
                >
                  Produtos
                </Link>
                <Link
                  href="/#contact"
                  onClick={() => setOpen(false)}
                  className="hover:text-white transition"
                >
                  Contato
                </Link>

                {/* CTA MOBILE */}
                <button
                  onClick={() => {
                    setOpen(false);
                    document.dispatchEvent(new Event("open-consultoria"));
                  }}
                  className="
                    mt-4
                    bg-yellow-400 text-black
                    py-3 rounded-lg
                    font-bold
                    hover:brightness-110 transition
                  "
                >
                  💬 Solicitar consultoria
                </button>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
