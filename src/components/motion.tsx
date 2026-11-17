"use client";

import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";

const ease = [0.2, 0.8, 0.2, 1] as const;

// Entrada al aparecer en pantalla
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

// Fila de lista: la línea de arriba se dibuja de izquierda a derecha y el
// contenido sube detrás
export function RevealRow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.li
      className="relative"
      initial={reduce ? false : "hidden"}
      whileInView="shown"
      viewport={{ once: true, margin: "-100px" }}
    >
      <motion.span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px origin-left bg-bone/15"
        variants={{ hidden: { scaleX: 0 }, shown: { scaleX: 1 } }}
        transition={{ duration: 1, ease }}
      />
      <motion.div
        className={className}
        variants={{
          hidden: { opacity: 0, y: 40 },
          shown: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.8, ease, delay: 0.15 }}
      >
        {children}
      </motion.div>
    </motion.li>
  );
}

// Desplazamiento atado al scroll, para que los celulares floten sobre la captura
export function Parallax({
  children,
  className,
  distance = 50,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  return (
    <motion.div ref={ref} className={className} style={reduce ? undefined : { y }}>
      {children}
    </motion.div>
  );
}

// Número que cuenta hasta su valor la primera vez que se ve
export function CountUp({
  to,
  prefix = "",
  suffix = "",
}: {
  to: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, to, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (value) => {
        if (ref.current)
          ref.current.textContent = `${prefix}${Math.round(value)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, reduce, to, prefix, suffix]);

  return (
    <span ref={ref}>
      {prefix}
      {to}
      {suffix}
    </span>
  );
}

// Se inclina en 3D siguiendo al mouse
export function Tilt({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const x = useSpring(0, { stiffness: 150, damping: 18 });
  const y = useSpring(0, { stiffness: 150, damping: 18 });
  const rotateX = useTransform(y, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-10, 10]);

  return (
    <div className={className} style={{ perspective: 1000 }}>
      <motion.div
        style={reduce ? undefined : { rotateX, rotateY }}
        onPointerMove={(event) => {
          const box = event.currentTarget.getBoundingClientRect();
          x.set((event.clientX - box.left) / box.width - 0.5);
          y.set((event.clientY - box.top) / box.height - 0.5);
        }}
        onPointerLeave={() => {
          x.set(0);
          y.set(0);
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
