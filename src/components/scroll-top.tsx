"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useSyncExternalStore } from "react";

const subscribe = (notify: () => void) => {
  window.addEventListener("scroll", notify, { passive: true });
  window.addEventListener("resize", notify);
  return () => {
    window.removeEventListener("scroll", notify);
    window.removeEventListener("resize", notify);
  };
};

// Aparece recién pasado el carrusel, cuando volver arriba ya cuesta
const isPastHero = () => {
  const after = document.getElementById("sobre-mi");
  return !!after && window.scrollY > after.offsetTop - window.innerHeight / 2;
};

export function ScrollTop() {
  const reduce = useReducedMotion();
  const visible = useSyncExternalStore(subscribe, isPastHero, () => false);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          aria-label="Volver arriba"
          title="Volver arriba"
          onClick={() =>
            window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })
          }
          className="fixed bottom-5 left-5 z-30 grid size-12 place-items-center rounded-full border border-bone/25 bg-void/70 backdrop-blur transition-colors hover:border-bone hover:bg-bone hover:text-void md:bottom-8 md:left-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.25 }}
        >
          <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true">
            <path
              d="M8 13V3m0 0L3.5 7.5M8 3l4.5 4.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
