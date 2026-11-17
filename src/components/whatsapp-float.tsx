"use client";

import { AnimatePresence, motion } from "motion/react";
import { useSyncExternalStore } from "react";
import { contact } from "../content";
import { glyphs, Icon } from "./icons";

const subscribe = (notify: () => void) => {
  window.addEventListener("scroll", notify, { passive: true });
  window.addEventListener("resize", notify);
  return () => {
    window.removeEventListener("scroll", notify);
    window.removeEventListener("resize", notify);
  };
};

// En celular el carrusel ya tiene WhatsApp en el header y el botón tapaba
// los controles: aparece recién al bajar del carrusel
const isVisible = () => {
  if (window.innerWidth >= 768) return true;
  const after = document.getElementById("sobre-mi");
  return !!after && window.scrollY > after.offsetTop - window.innerHeight;
};

// Botón de WhatsApp fijo abajo a la derecha en toda la página
export function WhatsAppFloat() {
  const visible = useSyncExternalStore(subscribe, isVisible, () => true);
  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href={contact.whatsapp}
          target="_blank"
          rel="noreferrer"
          aria-label="Escribime por WhatsApp"
          title="Escribime por WhatsApp"
          className="fixed right-5 bottom-5 z-30 grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_6px_24px_rgba(0,0,0,0.5)] transition-transform hover:scale-105 hover:bg-[#1ebe5b] md:right-8 md:bottom-8 md:size-16"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.25 }}
        >
          <Icon glyph={glyphs.whatsapp} className="size-6 md:size-7" />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
