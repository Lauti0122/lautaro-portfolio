"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { projects } from "../content";
import { brandColor, Icon, techByName } from "./icons";
import { CountUp } from "./motion";

const pad = (value: number) => String(value).padStart(2, "0");

function ExternalIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden="true">
      <path
        d="M5 3h8v8M13 3 3 13"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export function TechList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((name) => (
        <li
          key={name}
          className="flex items-center gap-2 rounded-full border border-bone/15 py-1.5 pr-3.5 pl-2.5 text-sm"
        >
          {techByName[name] && (
            <Icon
              glyph={techByName[name]}
              color={brandColor(name)}
              className="size-4"
            />
          )}
          {name}
        </li>
      ))}
    </ul>
  );
}

export function ProjectDetail({
  index,
  onClose,
  onNavigate,
}: {
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const reduce = useReducedMotion();
  const closeButton = useRef<HTMLButtonElement>(null);
  const isOpen = index !== null;

  useEffect(() => {
    if (!isOpen) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    closeButton.current?.focus();
    return () => {
      root.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight")
        onNavigate((index + 1) % projects.length);
      if (event.key === "ArrowLeft")
        onNavigate((index - 1 + projects.length) % projects.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, onClose, onNavigate]);

  const project = index === null ? null : projects[index];

  return (
    <AnimatePresence>
      {project && index !== null && (
        <motion.div
          key="detail"
          role="dialog"
          aria-modal="true"
          aria-labelledby="detail-title"
          className="fixed inset-0 z-50 overflow-y-auto bg-void/95 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.35 }}
        >
          <div className="sticky top-0 z-10 flex items-center justify-between gap-4 bg-void/80 px-5 py-4 backdrop-blur md:px-10">
            <p className="whitespace-nowrap text-smoke tabular-nums">
              {pad(index + 1)} / {pad(projects.length)}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  onNavigate((index - 1 + projects.length) % projects.length)
                }
                className="rounded-full border border-bone/20 px-3 py-2 text-sm hover:border-bone sm:px-4 sm:text-base"
              >
                Anterior
              </button>
              <button
                type="button"
                onClick={() => onNavigate((index + 1) % projects.length)}
                className="rounded-full border border-bone/20 px-3 py-2 text-sm hover:border-bone sm:px-4 sm:text-base"
              >
                Siguiente
              </button>
              <button
                ref={closeButton}
                type="button"
                onClick={onClose}
                className="rounded-full bg-bone px-3 py-2 text-sm font-medium text-void hover:bg-white sm:px-4 sm:text-base"
              >
                Cerrar
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.article
              key={project.slug}
              className="mx-auto grid max-w-[1400px] gap-12 px-5 pt-8 pb-24 md:px-10 lg:grid-cols-12 lg:gap-16"
              initial={reduce ? false : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <div className="lg:col-span-5">
                <p className="text-smoke">{project.kind}</p>
                <h2
                  id="detail-title"
                  className="mt-3 display text-7xl leading-[0.9] md:text-8xl"
                >
                  {project.title}
                </h2>
                <p className="mt-4 text-smoke">{project.client}</p>
                <p className="mt-8 max-w-[52ch] text-lg leading-relaxed">
                  {project.summary}
                </p>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-bone px-6 py-3 font-medium text-void hover:bg-white"
                >
                  Visitar el sitio
                  <ExternalIcon />
                </a>

                {project.facts && (
                  <dl className="mt-12 grid grid-cols-3 gap-4 border-t border-bone/15 pt-6">
                    {project.facts.map((fact) => (
                      <div key={fact.label}>
                        <dt className="display text-5xl md:text-6xl">
                          <CountUp
                            to={fact.value}
                            prefix={fact.prefix}
                            suffix={fact.suffix}
                          />
                        </dt>
                        <dd className="mt-2 text-sm leading-snug text-smoke">
                          {fact.label}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}

                <h3 className="mt-12 text-smoke">Qué hace</h3>
                <ul className="mt-3">
                  {project.points.map((point) => (
                    <li key={point} className="border-t border-bone/15 py-3">
                      {point}
                    </li>
                  ))}
                </ul>

                <h3 className="mt-10 text-smoke">Con qué está hecho</h3>
                <div className="mt-4">
                  <TechList items={project.stack} />
                </div>

                {project.press && (
                  <>
                    <h3 className="mt-12 text-smoke">En las noticias</h3>
                    <ul className="mt-3">
                      {project.press.map((note) => (
                        <li
                          key={note.url}
                          className="border-t border-bone/15 py-3"
                        >
                          <a
                            href={note.url}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:underline"
                          >
                            {note.title}
                          </a>
                          <span className="mt-1 block text-sm text-smoke">
                            {note.outlet}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              <div className="lg:col-span-7">
                <div className="lg:sticky lg:top-24">
                  <div className="overflow-hidden rounded-2xl border border-bone/15 bg-[#1a1a1a]">
                    <div className="flex items-center gap-3 px-4 py-3">
                      <span className="flex gap-1.5" aria-hidden="true">
                        <i className="size-2.5 rounded-full bg-bone/25" />
                        <i className="size-2.5 rounded-full bg-bone/25" />
                        <i className="size-2.5 rounded-full bg-bone/25" />
                      </span>
                      <span className="truncate rounded-md bg-bone/10 px-3 py-0.5 text-xs text-smoke">
                        {project.urlLabel}
                      </span>
                    </div>
                    <Image
                      src={project.shot}
                      alt={`Captura de ${project.title}`}
                      width={1920}
                      height={1200}
                      sizes="(min-width: 1024px) 800px, 100vw"
                      className="block w-full"
                    />
                  </div>
                  {project.side && (
                    <div className="mt-6 flex justify-end lg:-mt-40 lg:mr-8">
                      <Image
                        src={project.side.src}
                        alt={`Otra pantalla de ${project.title}`}
                        width={project.side.width}
                        height={project.side.height}
                        sizes="260px"
                        className={
                          project.side.phone
                            ? "w-44 rounded-[1.8rem] border-[6px] border-[#1a1a1a] shadow-2xl shadow-black md:w-56"
                            : "w-56 rounded-2xl border border-bone/15 shadow-2xl shadow-black md:w-72"
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.article>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
