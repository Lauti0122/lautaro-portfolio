"use client";

import {
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { useRef, useState } from "react";
import { steps } from "../content";

// Pasos numerados unidos por una línea que se completa al bajar: en
// escritorio va en horizontal y en celular en vertical, a la izquierda
export function Steps() {
  const list = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const [reached, setReached] = useState(0);
  const { scrollYProgress } = useScroll({
    target: list,
    offset: ["start 85%", "end 55%"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setReached(Math.min(steps.length, Math.floor(value * steps.length + 0.6)));
  });

  const done = reduce ? steps.length : reached;

  return (
    <ol ref={list} className="mt-12 grid lg:grid-cols-4">
      {steps.map((step, index) => {
        const active = index < done;
        const linked = index + 1 < done;
        return (
          <li
            key={step.title}
            className="relative grid grid-cols-[3rem_1fr] gap-x-5 pb-12 last:pb-0 lg:block lg:pr-10 lg:pb-0"
          >
            {/* Tramo de línea hasta el próximo paso */}
            {index < steps.length - 1 && (
              <span
                aria-hidden
                className="absolute top-14 bottom-2 left-6 w-px bg-bone/15 lg:top-6 lg:right-2 lg:bottom-auto lg:left-16 lg:h-px lg:w-auto"
              >
                <span
                  className={`absolute inset-0 origin-top bg-bone transition-transform duration-700 ease-out lg:origin-left ${
                    linked
                      ? "scale-100"
                      : "max-lg:scale-y-0 lg:scale-x-0"
                  }`}
                />
              </span>
            )}

            <span
              className={`relative grid size-12 place-items-center rounded-full border text-lg tabular-nums transition-colors duration-500 ${
                active
                  ? "border-bone bg-bone text-void"
                  : "border-bone/25 text-smoke"
              }`}
            >
              {index + 1}
            </span>

            <div className="lg:mt-8">
              <p
                className={`text-sm transition-colors duration-500 ${
                  active ? "text-bone" : "text-smoke"
                }`}
              >
                {step.when}
              </p>
              <h4 className="mt-2 display text-3xl leading-tight">
                {step.title}
              </h4>
              <p className="mt-3 max-w-[34ch] leading-relaxed text-smoke">
                {step.body}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
