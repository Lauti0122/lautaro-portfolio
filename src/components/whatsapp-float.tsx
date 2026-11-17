import { contact } from "../content";
import { glyphs, Icon } from "./icons";

// Botón de WhatsApp fijo abajo a la derecha en toda la página
export function WhatsAppFloat() {
  return (
    <a
      href={contact.whatsapp}
      target="_blank"
      rel="noreferrer"
      aria-label="Escribime por WhatsApp"
      title="Escribime por WhatsApp"
      className="fixed right-5 bottom-5 z-30 grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_6px_24px_rgba(0,0,0,0.5)] transition-transform hover:scale-105 hover:bg-[#1ebe5b] md:right-8 md:bottom-8 md:size-16"
    >
      <Icon glyph={glyphs.whatsapp} className="size-6 md:size-7" />
    </a>
  );
}
