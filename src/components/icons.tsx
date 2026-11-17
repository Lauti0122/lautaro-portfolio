import {
  siClaude,
  siElementor,
  siGit,
  siGithub,
  siInstagram,
  siJest,
  siLangchain,
  siLanggraph,
  siMercadopago,
  siMongodb,
  siNestjs,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siPrisma,
  siReact,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siWhatsapp,
  siWordpress,
} from "simple-icons";

export type Glyph = { title: string; path: string; hex: string };

// simple-icons ya no incluye LinkedIn
const siLinkedin: Glyph = {
  title: "LinkedIn",
  hex: "0A66C2",
  path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
};

// El n8n de simple-icons es la palabra, ilegible en chico: este es el
// isotipo de nodos conectados
const n8nMark: Glyph = {
  title: "n8n",
  hex: "EA4B71",
  path: "M0.5 12a2.7 2.7 0 1 0 5.4 0a2.7 2.7 0 1 0 -5.4 0ZM1.85 12a1.35 1.35 0 1 1 2.7 0a1.35 1.35 0 1 1 -2.7 0ZM8.5 12a2.7 2.7 0 1 0 5.4 0a2.7 2.7 0 1 0 -5.4 0ZM9.85 12a1.35 1.35 0 1 1 2.7 0a1.35 1.35 0 1 1 -2.7 0ZM18.1 6.8a2.7 2.7 0 1 0 5.4 0a2.7 2.7 0 1 0 -5.4 0ZM19.45 6.8a1.35 1.35 0 1 1 2.7 0a1.35 1.35 0 1 1 -2.7 0ZM18.1 17.2a2.7 2.7 0 1 0 5.4 0a2.7 2.7 0 1 0 -5.4 0ZM19.45 17.2a1.35 1.35 0 1 1 2.7 0a1.35 1.35 0 1 1 -2.7 0ZM5.36 12.7L9.04 12.7L9.04 11.3L5.36 11.3ZM13.43 11.59L19.23 8.44L18.57 7.21L12.77 10.36ZM12.77 13.64L18.57 16.79L19.23 15.56L13.43 12.41Z",
};

export const glyphs = {
  claude: siClaude,
  whatsapp: siWhatsapp,
  instagram: siInstagram,
  linkedin: siLinkedin,
  github: siGithub,
  langchain: siLangchain,
  n8n: n8nMark,
} satisfies Record<string, Glyph>;

// Nombre visible de cada tecnología y su logo. Los proyectos de content.ts
// referencian estas claves en `stack`.
export const techByName: Record<string, Glyph> = {
  "Claude Code": siClaude,
  "Next.js": siNextdotjs,
  React: siReact,
  "React Native": siReact,
  TypeScript: siTypescript,
  NestJS: siNestjs,
  "Node.js": siNodedotjs,
  PostgreSQL: siPostgresql,
  Prisma: siPrisma,
  Supabase: siSupabase,
  MongoDB: siMongodb,
  "Tailwind CSS": siTailwindcss,
  LangChain: siLangchain,
  LangGraph: siLanggraph,
  n8n: n8nMark,
  "Mercado Pago": siMercadopago,
  WordPress: siWordpress,
  Elementor: siElementor,
  Jest: siJest,
  Git: siGit,
  GitHub: siGithub,
};

// Logos cuyo color de marca es negro y desaparecen sobre el fondo
export const darkBrands = new Set(["Next.js", "Prisma", "GitHub"]);

export function brandColor(name: string) {
  return darkBrands.has(name) ? "#ecebe6" : `#${techByName[name].hex}`;
}

export function Icon({
  glyph,
  className = "size-5",
  color,
}: {
  glyph: Glyph;
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={color ?? "currentColor"}
      aria-hidden="true"
    >
      <path d={glyph.path} />
    </svg>
  );
}
