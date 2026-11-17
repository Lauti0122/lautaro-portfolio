"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { skills } from "../content";
import { brandColor, darkBrands, Icon, techByName } from "./icons";
import { RevealRow } from "./motion";
import type { LogoItem } from "./logo-scene";

const LogoScene = dynamic(() => import("./logo-scene"), { ssr: false });

// Logo, posición y tamaño de cada pieza flotante. Claude va al centro.
const LAYOUT: { name: string; at: [number, number, number]; size: number }[] = [
  { name: "Claude Code", at: [0, 0.1, 0.6], size: 1.55 },
  { name: "Next.js", at: [-2.6, 1.3, -0.4], size: 1 },
  { name: "React", at: [2.7, 1.4, -0.2], size: 1.05 },
  { name: "TypeScript", at: [-4.6, -0.4, -1], size: 0.85 },
  { name: "NestJS", at: [4.5, -0.5, -0.8], size: 0.95 },
  { name: "Node.js", at: [-2.2, -1.6, 0.2], size: 0.9 },
  { name: "PostgreSQL", at: [2.2, -1.7, 0.3], size: 0.95 },
  { name: "Supabase", at: [-5.6, 1.7, -2], size: 0.75 },
  { name: "Prisma", at: [5.8, 1.8, -2.2], size: 0.75 },
  { name: "Tailwind CSS", at: [0.2, 2.3, -1.6], size: 0.8 },
  { name: "LangChain", at: [-0.4, -2.5, -1.2], size: 0.8 },
  { name: "n8n", at: [6.3, -1.9, -2.4], size: 0.75 },
  { name: "MongoDB", at: [-6.3, -1.8, -2.6], size: 0.75 },
  { name: "GitHub", at: [-3.9, 2.6, -2.8], size: 0.7 },
];

const ITEMS: LogoItem[] = LAYOUT.map(({ name, at, size }) => ({
  name,
  path: techByName[name].path,
  color: `#${techByName[name].hex}`,
  metal: darkBrands.has(name),
  at,
  size,
}));

const scaleFor = (width: number) =>
  width < 640 ? 0.55 : width < 1024 ? 0.7 : 1;

export function Stack() {
  const section = useRef<HTMLElement>(null);
  const [running, setRunning] = useState(false);
  // La escena existe solo cerca de la pantalla: dos contextos WebGL vivos a
  // la vez llegaron a reiniciar la GPU y dejar el carrusel en blanco
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState<LogoItem | null>(null);

  useEffect(() => {
    const node = section.current;
    if (!node) return;
    const near = new IntersectionObserver(
      ([entry]) => setMounted(entry.isIntersecting),
      { rootMargin: "400px" },
    );
    const visible = new IntersectionObserver(([entry]) =>
      setRunning(entry.isIntersecting),
    );
    near.observe(node);
    visible.observe(node);
    return () => {
      near.disconnect();
      visible.disconnect();
    };
  }, []);

  return (
    <section
      ref={section}
      id="stack"
      aria-labelledby="stack-title"
      className="relative overflow-hidden border-t border-bone/10"
    >
      <div className="mx-auto flex max-w-[1400px] items-end justify-between gap-6 px-5 pt-24 md:px-10 md:pt-36">
        <h2
          id="stack-title"
          className="display text-6xl leading-none md:text-8xl"
        >
          Con qué construyo
        </h2>
        <p aria-live="polite" className="hidden min-w-48 text-right text-smoke md:block">
          {hovered?.name ?? "Pasá el mouse por los logos"}
        </p>
      </div>
      <div className="relative h-[360px] sm:h-[62svh] sm:min-h-[420px]">
        {mounted && (
          <LogoScene
            items={ITEMS}
            running={running}
            onHover={setHovered}
            scaleFor={scaleFor}
          />
        )}
      </div>
      {/* Una fila por área, con cada tecnología como etiqueta con su logo */}
      <ul className="mx-auto max-w-[1400px] px-5 pb-24 md:px-10">
        {skills.map((skill) => (
          <RevealRow
            key={skill.area}
            className="grid gap-5 py-7 md:grid-cols-12 md:items-center md:gap-8"
          >
            <h3 className="display text-3xl md:col-span-4">{skill.area}</h3>
            <ul className="flex flex-wrap gap-2.5 md:col-span-8">
              {skill.items.map((name) => {
                const glyph = techByName[name];
                return (
                  <li
                    key={name}
                    className="flex items-center gap-2 rounded-full border border-bone/15 px-4 py-2 text-bone/85 transition-colors hover:border-bone/50 hover:text-bone"
                  >
                    {glyph && (
                      <Icon
                        glyph={glyph}
                        color={brandColor(name)}
                        className="size-4"
                      />
                    )}
                    {name}
                  </li>
                );
              })}
            </ul>
          </RevealRow>
        ))}
      </ul>
    </section>
  );
}
