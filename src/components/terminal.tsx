"use client";

import { motion, useReducedMotion } from "motion/react";
import { siClaude } from "simple-icons";

// Sesión ilustrativa: muestra la forma de trabajo, no un registro real
const lines: { kind: "prompt" | "step" | "done"; text: string }[] = [
  {
    kind: "prompt",
    text: "Bot de WhatsApp que tome pedidos y los cargue en el panel",
  },
  { kind: "step", text: "Leo la carta, las zonas de reparto y la API de pedidos" },
  {
    kind: "step",
    text: "Plan: webhook de WhatsApp + agente con tres herramientas: ver carta, armar pedido y consultar zona",
  },
  {
    kind: "step",
    text: "Si piden algo fuera de la carta o se enojan, pasa la charla a una persona",
  },
  { kind: "done", text: "40 conversaciones simuladas: 37 pedidos cargados, 3 derivadas" },
  { kind: "prompt", text: "Antes de activarlo, mostrame las 3 derivadas" },
];

export function Terminal() {
  const reduce = useReducedMotion();
  return (
    <div className="overflow-hidden rounded-2xl border border-bone/15 bg-[#0d0d0d] font-mono text-sm md:text-[0.95rem]">
      <div className="flex items-center gap-3 border-b border-bone/10 px-4 py-3">
        <span className="flex gap-1.5" aria-hidden="true">
          <i className="size-3 rounded-full bg-bone/20" />
          <i className="size-3 rounded-full bg-bone/20" />
          <i className="size-3 rounded-full bg-bone/20" />
        </span>
        <svg viewBox="0 0 24 24" className="size-4" fill="#D97757" aria-hidden="true">
          <path d={siClaude.path} />
        </svg>
        <span className="text-smoke">Claude Code</span>
        <span className="ml-auto hidden text-smoke/70 sm:inline">
          ~/proyectos/bot-pedidos
        </span>
      </div>
      <motion.ol
        className="space-y-3 p-5 leading-relaxed md:p-6"
        initial={reduce ? false : "hidden"}
        whileInView="shown"
        viewport={{ once: true, margin: "-60px" }}
        transition={{ staggerChildren: 0.5, delayChildren: 0.1 }}
      >
        {lines.map((line) => (
          <motion.li
            key={line.text}
            className="flex gap-3"
            variants={{
              hidden: { opacity: 0, x: -10 },
              shown: { opacity: 1, x: 0 },
            }}
          >
            {line.kind === "prompt" ? (
              <>
                <span className="text-smoke">&gt;</span>
                <span className="text-bone">{line.text}</span>
              </>
            ) : (
              <>
                <span
                  className={line.kind === "done" ? "text-bone" : "text-claude"}
                >
                  ●
                </span>
                <span className="text-smoke">{line.text}</span>
              </>
            )}
          </motion.li>
        ))}
        <li className="flex gap-3" aria-hidden="true">
          <span className="text-smoke">&gt;</span>
          <span className="caret" />
        </li>
      </motion.ol>
    </div>
  );
}
