"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function CartToast() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    function handleAdd() {
      setShow(true);
      setTimeout(() => setShow(false), 2000);
    }

    window.addEventListener("cart:add", handleAdd);
    return () => window.removeEventListener("cart:add", handleAdd);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="
            fixed z-[9999]
            bottom-24 right-4
            bg-green-600 text-black
            px-4 py-3
            rounded-lg
            font-bold shadow-xl
          "
        >
          Produto adicionado ao orçamento
        </motion.div>
      )}
    </AnimatePresence>
  );
}
