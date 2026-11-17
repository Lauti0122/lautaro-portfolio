"use client";

import Image from "next/image";
import { useState } from "react";
import { siGmail } from "simple-icons";
import { contact } from "../content";
import { type Glyph, glyphs, Icon } from "./icons";

const wrap = "mx-auto w-full max-w-[1400px] px-5 md:px-10";

const handle = (url: string) =>
  "@" + url.replace(/\/+$/, "").split("/").pop();

const CONTACTS: { name: string; detail: string; glyph: Glyph; href: string }[] =
  [
    {
      name: "WhatsApp",
      detail: contact.phone,
      glyph: glyphs.whatsapp,
      href: contact.whatsapp,
    },
    {
      name: "Mail",
      detail: contact.email,
      glyph: siGmail,
      href: `mailto:${contact.email}`,
    },
    {
      name: "LinkedIn",
      detail: "Lautaro Bua",
      glyph: glyphs.linkedin,
      href: contact.linkedin,
    },
    {
      name: "GitHub",
      detail: handle(contact.github),
      glyph: glyphs.github,
      href: contact.github,
    },
    {
      name: "Instagram",
      detail: handle(contact.instagram),
      glyph: glyphs.instagram,
      href: contact.instagram,
    },
  ];

function DownloadIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
      <path
        d="M10 3v10m0 0-4-4m4 4 4-4M4 16h12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Footer() {
  const [hovered, setHovered] = useState<string | null>(null);
  const hoveredContact = CONTACTS.find((item) => item.name === hovered);

  return (
    <footer
      id="contacto"
      className="relative overflow-hidden border-t border-bone/10"
    >
      {/* Cierre: un resplandor que sube desde el borde inferior */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%]"
        style={{
          background:
            "radial-gradient(60% 80% at 50% 100%, rgba(217,119,87,0.28), rgba(217,119,87,0.08) 45%, transparent 75%), radial-gradient(90% 60% at 50% 100%, rgba(236,235,230,0.10), transparent 70%)",
        }}
      />
      <div className={`relative ${wrap} pt-24 md:pt-32`}>
        <div className="grid items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="display text-[clamp(4rem,9.5vw,9rem)] leading-[0.85]">
              Hablemos
            </h2>
            <p className="mt-8 max-w-[38ch] text-2xl leading-snug md:text-3xl">
              Contame cómo trabaja tu negocio y dónde se pierde tiempo. Te
              propongo una solución a medida. Respondo en el día.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href={contact.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full bg-bone px-7 py-4 text-lg font-medium text-void hover:bg-white"
              >
                <Icon glyph={glyphs.whatsapp} />
                Escribime por WhatsApp
              </a>
              <a
                href={contact.cv}
                download
                className="inline-flex items-center gap-2.5 rounded-full border border-bone/30 px-7 py-4 text-lg hover:border-bone"
              >
                <DownloadIcon />
                Descargar CV
              </a>
            </div>
          </div>

          {/* Currículum */}
          <a
            href={contact.cv}
            download
            className="group block rounded-[2rem] border border-bone/15 bg-[#0b0b0b] p-4 transition-colors hover:border-bone/40 lg:col-span-5"
          >
            <div className="relative h-72 overflow-hidden rounded-[1.4rem] bg-[#1a1a1a] md:h-80">
              <Image
                src="/me/cv-preview.jpg"
                alt="Vista previa del currículum de Lautaro Bua"
                width={900}
                height={1417}
                sizes="(min-width: 1024px) 480px, 100vw"
                className="absolute top-8 left-1/2 w-[78%] -translate-x-1/2 -rotate-2 rounded-md shadow-2xl shadow-black/60 transition-transform duration-500 group-hover:-translate-y-3 group-hover:rotate-0"
              />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#1a1a1a] to-transparent" />
            </div>
            <div className="flex items-center justify-between gap-4 px-2 pt-5 pb-1">
              <div>
                <p className="display text-2xl">Currículum</p>
                <p className="mt-1 text-sm text-smoke">PDF de una página</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-bone px-5 py-3 font-medium text-void transition-colors group-hover:bg-white">
                <DownloadIcon className="size-4" />
                Descargar
              </span>
            </div>
          </a>
        </div>

        {/* Contactos: los mismos botones redondos del header, más grandes */}
        <div className="mt-16">
          <ul className="flex flex-wrap justify-center gap-3 sm:gap-6">
            {CONTACTS.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  aria-label={`${item.name}: ${item.detail}`}
                  title={item.name}
                  onMouseEnter={() => setHovered(item.name)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(item.name)}
                  onBlur={() => setHovered(null)}
                  // Al pasar el mouse se levanta y se llena con el color de la marca
                  style={
                    {
                      "--brand": item.name === "GitHub" ? "#ecebe6" : `#${item.glyph.hex}`,
                      "--on-brand": item.name === "GitHub" ? "#000" : "#fff",
                    } as React.CSSProperties
                  }
                  className="group grid size-14 place-items-center rounded-full border border-bone/25 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-(--brand) hover:bg-(--brand) hover:text-(--on-brand) hover:shadow-[0_12px_36px_-8px_var(--brand)] focus-visible:-translate-y-1.5 focus-visible:border-(--brand) focus-visible:bg-(--brand) focus-visible:text-(--on-brand) touch:border-[color-mix(in_srgb,var(--brand)_45%,transparent)] touch:text-(--brand) touch:active:bg-(--brand) touch:active:text-(--on-brand) sm:size-20"
                >
                  <Icon
                    glyph={item.glyph}
                    className="size-6 transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-rotate-6 sm:size-7"
                  />
                </a>
              </li>
            ))}
          </ul>
          <p aria-hidden className="mt-6 h-7 text-center text-lg text-smoke">
            {hoveredContact &&
              `${hoveredContact.name}: ${hoveredContact.detail}`}
          </p>
        </div>
      </div>
      {/* Nombre gigante que se pierde en el borde */}
      <p
        aria-hidden
        className="display relative mt-4 -mb-[0.2em] bg-gradient-to-b from-bone/30 to-transparent bg-clip-text text-center text-[25vw] leading-[0.82] text-transparent select-none sm:text-[19vw] sm:leading-none sm:whitespace-nowrap"
      >
        {/* En celular va en dos líneas para que se lea grande */}
        Lautaro <br className="sm:hidden" />
        Bua
      </p>
    </footer>
  );
}
