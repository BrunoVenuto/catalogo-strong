"use client";

import { collections } from "@/config/collections";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Collections() {
  const router = useRouter();
  const items = [...collections, ...collections];

  function handleClick(category: string) {
    const url = `/?category=${encodeURIComponent(category)}#products`;
    router.push(url);

    setTimeout(() => {
      const el = document.getElementById("products");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 50);
  }

  return (
    <section
      id="collections"
      className="py-20 md:py-24 bg-neutral-950 text-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <h2 className="text-3xl md:text-4xl font-bold">
          Explore nossas linhas
        </h2>
      </div>

      <div className="relative w-full overflow-hidden">
        <motion.div
          className="flex gap-4 md:gap-6"
          animate={{ x: ["-50%", "0%"] }}
          transition={{
            ease: "linear",
            duration: 12,
            repeat: Infinity,
          }}
        >
          {items.map((c, index) => (
            <div
              key={index}
              onClick={() => handleClick(c.name)}
              className="
                min-w-[200px] sm:min-w-[240px] md:min-w-[320px]
                h-52 sm:h-60 md:h-72
                relative
                group
                overflow-hidden
                cursor-pointer
                rounded-xl
                border border-white/10
                hover:border-yellow-400/50
                transition
              "
            >
              <img
                src={c.image}
                alt={c.name}
                className="
                  w-full h-full object-cover
                  transition duration-500
                  group-hover:scale-110
                  pointer-events-none
                "
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-4 md:p-6 pointer-events-none">
                <h3 className="text-white text-base sm:text-lg md:text-xl font-semibold drop-shadow">
                  {c.name}
                </h3>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
