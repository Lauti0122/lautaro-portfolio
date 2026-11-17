"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { contact, projects } from "../content";
import {
  LAST,
  STEP_VH,
  clamp,
  type CarouselControl,
  type HoverKind,
} from "./carousel-config";
import { glyphs, Icon } from "./icons";
import { ProjectDetail } from "./project-detail";
import { useTouch } from "./use-touch";

const CarouselScene = dynamic(() => import("./carousel-scene"), {
  ssr: false,
});

// Píxeles de arrastre horizontal que equivalen a pasar un proyecto
const DRAG_PER_PROJECT = 420;

const pad = (value: number) => String(value).padStart(2, "0");

const noop = () => () => {};
// Se calcula una sola vez: React llama a esta función en cada render, y
// crear un contexto WebGL por render agotaba el límite del navegador, que
// mataba el del carrusel (pantalla en blanco y animación de entrada repetida)
let webglSupport: boolean | null = null;
function detectWebGL() {
  if (webglSupport === null) {
    try {
      const gl = document.createElement("canvas").getContext("webgl2");
      webglSupport = !!gl;
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}

const nav = [
  { href: "#sobre-mi", label: "Sobre mí" },
  { href: "#servicios", label: "Servicios" },
  { href: "#ia", label: "IA" },
  { href: "#experiencia", label: "Experiencia" },
  { href: "#contacto", label: "Contacto" },
];

export function Hero() {
  const reduce = useReducedMotion() ?? false;
  const webgl = useSyncExternalStore(noop, detectWebGL, () => true);
  const control = useRef<CarouselControl>({ progress: 0, moved: 0 });
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const drag = useRef({ x: 0, time: 0, velocity: 0, id: -1, on: false });
  // Encaje propio: mientras dura un scrollTo nuestro no se vuelve a encajar
  const snapping = useRef<{ until: number }>({ until: 0 });
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const [loading, setLoading] = useState(0);
  const [running, setRunning] = useState(true);
  const [hover, setHover] = useState<HoverKind>(null);
  const [dragging, setDragging] = useState(false);
  // Puntero propio: un punto blanco que sigue al mouse sobre el carrusel
  const [pointerInside, setPointerInside] = useState(false);
  const pointerX = useMotionValue(-100);
  const pointerY = useMotionValue(-100);
  const [sceneKey, setSceneKey] = useState(0);
  const [near, setNear] = useState(true);
  // Pista de "deslizá" en pantallas táctiles, hasta el primer toque
  const touch = useTouch();
  const [hintDone, setHintDone] = useState(false);

  const loaded = loading >= 100 || !webgl;
  const showHint = touch && loaded && !hintDone && active === 0 && open === null;

  useEffect(() => {
    if (!showHint) return;
    const timer = setTimeout(() => setHintDone(true), 5000);
    return () => clearTimeout(timer);
  }, [showHint]);

  // Distancia de scroll entre un proyecto y el siguiente
  const stepPx = useCallback(() => {
    const node = section.current;
    return node ? (node.offsetHeight - window.innerHeight) / LAST : 1;
  }, []);

  const goTo = useCallback(
    (index: number) => {
      const node = section.current;
      if (!node) return;
      const top =
        node.getBoundingClientRect().top +
        window.scrollY +
        stepPx() * clamp(index, 0, LAST);
      snapping.current.until = performance.now() + 900;
      window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
    },
    [reduce, stepPx],
  );

  const openProject = useCallback((index: number) => {
    setOpen(index);
  }, []);

  // El scroll de la página mueve el arco: un tramo por proyecto. Al soltar
  // la rueda o el trackpad, encaja en el proyecto hacia donde se iba.
  useEffect(() => {
    let lastY = window.scrollY;
    let direction = 0;
    let timer: ReturnType<typeof setTimeout>;

    const settle = () => {
      const p = control.current.progress;
      if (drag.current.on || performance.now() < snapping.current.until) return;
      if (p <= 0 || p >= LAST || Number.isInteger(p)) return;
      const fraction = p - Math.floor(p);
      const target =
        direction > 0
          ? fraction > 0.1
            ? Math.ceil(p)
            : Math.floor(p)
          : fraction < 0.9
            ? Math.floor(p)
            : Math.ceil(p);
      goTo(target);
    };

    const update = () => {
      const node = section.current;
      if (!node) return;
      const range = node.offsetHeight - window.innerHeight;
      const ratio = clamp(-node.getBoundingClientRect().top / range, 0, 1);
      const progress = ratio * LAST;
      control.current.progress = progress;
      const index = Math.round(progress);
      if (index !== activeRef.current) {
        activeRef.current = index;
        setActive(index);
      }
      if (bar.current) bar.current.style.transform = `scaleX(${ratio})`;

      const y = window.scrollY;
      if (y !== lastY) direction = Math.sign(y - lastY);
      lastY = y;
      clearTimeout(timer);
      timer = setTimeout(settle, 160);
    };

    const frame = requestAnimationFrame(update);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [goTo]);

  // Pausa el render 3D cuando el hero sale de pantalla
  useEffect(() => {
    const node = section.current;
    if (!node) return;
    const visible = new IntersectionObserver(([entry]) =>
      setRunning(entry.isIntersecting),
    );
    // Lejos del hero se libera el canvas: así nunca conviven dos escenas 3D
    const near = new IntersectionObserver(
      ([entry]) => setNear(entry.isIntersecting),
      { rootMargin: "400px" },
    );
    visible.observe(node);
    near.observe(node);
    return () => {
      visible.disconnect();
      near.disconnect();
    };
  }, []);

  // El desplazamiento horizontal del trackpad también avanza
  useEffect(() => {
    const node = stage.current;
    if (!node) return;
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      window.scrollBy({ top: event.deltaX * 1.4, behavior: "instant" });
    };
    node.addEventListener("wheel", onWheel, { passive: false });
    return () => node.removeEventListener("wheel", onWheel);
  }, [webgl]);

  useEffect(() => {
    if (!running || open !== null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") goTo(activeRef.current + 1);
      if (event.key === "ArrowLeft") goTo(activeRef.current - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [running, open, goTo]);

  const onPointerDown = (event: React.PointerEvent) => {
    setHintDone(true);
    if (event.pointerType === "mouse") {
      if (event.button !== 0) return;
      // Sin esto, arrastrar selecciona el canvas y lo pinta del color de selección
      event.preventDefault();
    }
    drag.current = {
      x: event.clientX,
      time: performance.now(),
      velocity: 0,
      id: event.pointerId,
      on: true,
    };
    control.current.moved = 0;
  };

  const onPointerMove = (event: React.PointerEvent) => {
    if (event.pointerType === "mouse") {
      pointerX.set(event.clientX);
      pointerY.set(event.clientY);
      if (!pointerInside) setPointerInside(true);
    }
    const d = drag.current;
    if (!d.on || event.pointerId !== d.id) return;
    const dx = event.clientX - d.x;
    const now = performance.now();
    d.velocity = dx / Math.max(now - d.time, 1);
    d.x = event.clientX;
    d.time = now;
    control.current.moved += Math.abs(dx);
    if (control.current.moved > 6 && !dragging) {
      setDragging(true);
      stage.current?.setPointerCapture(event.pointerId);
    }
    window.scrollBy({
      top: (-dx * stepPx()) / DRAG_PER_PROJECT,
      behavior: "instant",
    });
  };

  const onPointerUp = () => {
    const d = drag.current;
    if (!d.on) return;
    d.on = false;
    if (!dragging) return;
    setDragging(false);
    // Si la mano se detuvo antes de soltar, no hay envión
    const velocity = performance.now() - d.time > 80 ? 0 : d.velocity;
    const target = Math.round(control.current.progress - velocity * 0.6);
    goTo(target);
  };

  const project = projects[active];

  return (
    <>
      <section
        id="trabajo"
        ref={section}
        aria-label="Proyectos"
        className="relative bg-void"
        style={{ height: `${LAST * STEP_VH + 100}svh` }}
      >
        <div className="sticky top-0 h-svh min-h-[620px] overflow-hidden select-none">
          {webgl ? (
            <div
              ref={stage}
              className={`absolute inset-0 touch-pan-y ${
                pointerInside ? "cursor-none" : "cursor-grab"
              }`}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onPointerLeave={() => setPointerInside(false)}
            >
              {near && (
                <CarouselScene
                  key={sceneKey}
                  onContextLost={() => setSceneKey((key) => key + 1)}
                  control={control}
                  reduceMotion={reduce}
                  running={running && open === null}
                  onSelect={openProject}
                  onGoTo={goTo}
                  onHover={setHover}
                  onProgress={setLoading}
                />
              )}
            </div>
          ) : (
            // Sin WebGL: la portada del proyecto activo, sin 3D
            <div className="absolute inset-0 grid place-items-center px-5">
              <Image
                src={project.cover}
                alt={`Portada de ${project.title}`}
                width={2000}
                height={1250}
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="w-full max-w-4xl rounded-3xl"
              />
            </div>
          )}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_50%,#000_100%)]"
          />

          <AnimatePresence>
            {showHint && (
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-[46%] z-10 flex justify-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center gap-3 rounded-full border border-bone/20 bg-void/70 px-5 py-3 text-sm backdrop-blur">
                  <span className="relative h-3 w-10">
                    <motion.span
                      className="absolute top-0 left-0 size-3 rounded-full bg-bone"
                      animate={reduce ? undefined : { x: [0, 28, 0] }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </span>
                  Deslizá para ver más proyectos
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-6 p-5 md:p-8">
            <a
              href="#trabajo"
              className="pointer-events-auto flex items-center gap-3"
            >
              <span
                aria-hidden="true"
                className="display grid size-11 place-items-center rounded-full bg-bone text-[0.95rem] tracking-tight text-void ring-1 ring-bone/30 ring-offset-4 ring-offset-void"
              >
                LB
              </span>
              <div className="leading-tight">
                <h1 className="font-medium">Lautaro Bua</h1>
                <span className="text-sm text-smoke">
                  Software a medida para empresas
                </span>
              </div>
            </a>
            <div className="pointer-events-auto flex items-center gap-7">
              <nav aria-label="Secciones" className="hidden gap-7 md:flex">
                {nav.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="hover:text-white"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              <div className="flex gap-2">
                <a
                  href={contact.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                  title="WhatsApp"
                  className="grid size-10 place-items-center rounded-full border border-bone/25 transition-colors hover:border-bone hover:bg-bone hover:text-void"
                >
                  <Icon glyph={glyphs.whatsapp} className="size-4" />
                </a>
                <a
                  href={contact.instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  title="Instagram"
                  className="grid size-10 place-items-center rounded-full border border-bone/25 transition-colors hover:border-bone hover:bg-bone hover:text-void"
                >
                  <Icon glyph={glyphs.instagram} className="size-4" />
                </a>
              </div>
            </div>
          </header>

          <>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col gap-6 p-5 md:flex-row md:items-end md:justify-between md:p-8 md:pr-32">
              <div className="min-w-0">
                <p className="flex gap-4 text-smoke tabular-nums">
                  <span className="shrink-0">
                    {pad(active + 1)} / {pad(projects.length)}
                  </span>
                  <span className="truncate">{project.kind}</span>
                </p>
                <div className="overflow-hidden pb-2">
                  <motion.h2
                    key={project.slug}
                    className="display text-[clamp(3rem,6.5vw,6.5rem)] leading-[0.95]"
                    initial={reduce ? false : { y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                  >
                    {project.title}
                  </motion.h2>
                </div>
                <button
                  type="button"
                  onClick={() => openProject(active)}
                  className="pointer-events-auto mt-2 rounded-full bg-bone px-6 py-3 font-medium text-void hover:bg-white"
                >
                  Ver proyecto
                </button>
              </div>

              <div className="pointer-events-auto flex flex-col items-end gap-5">
                <ol
                  aria-label="Ir a un proyecto"
                  className="hidden flex-col items-end gap-0.5 text-sm lg:flex"
                >
                  {projects.map((item, index) => (
                    <li key={item.slug}>
                      <button
                        type="button"
                        onClick={() => goTo(index)}
                        aria-current={index === active ? "true" : undefined}
                        className={`flex items-center gap-3 py-0.5 transition-colors ${
                          index === active
                            ? "text-bone"
                            : "text-smoke/70 hover:text-bone"
                        }`}
                      >
                        {item.title}
                        <span
                          className={`h-px bg-current transition-all duration-500 ${
                            index === active ? "w-10" : "w-4"
                          }`}
                        />
                      </button>
                    </li>
                  ))}
                </ol>
                <div className="flex items-center gap-3">
                <p className="mr-2 hidden text-smoke xl:block">
                  Bajá o arrastrá para recorrer
                </p>
                <button
                  type="button"
                  aria-label="Proyecto anterior"
                  disabled={active === 0}
                  onClick={() => goTo(active - 1)}
                  className="grid size-12 place-items-center rounded-full border border-bone/25 enabled:hover:border-bone disabled:opacity-30"
                >
                  <svg
                    viewBox="0 0 16 16"
                    className="size-4"
                    aria-hidden="true"
                  >
                    <path
                      d="M10 3 5 8l5 5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  aria-label="Proyecto siguiente"
                  disabled={active === LAST}
                  onClick={() => goTo(active + 1)}
                  className="grid size-12 place-items-center rounded-full border border-bone/25 enabled:hover:border-bone disabled:opacity-30"
                >
                  <svg
                    viewBox="0 0 16 16"
                    className="size-4"
                    aria-hidden="true"
                  >
                    <path
                      d="m6 3 5 5-5 5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                  </svg>
                </button>
                </div>
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 z-10 h-px bg-bone/10">
              <div ref={bar} className="h-px origin-left scale-x-0 bg-bone" />
            </div>
          </>

          <AnimatePresence>
            {!loaded && (
              <motion.div
                className="absolute inset-0 z-20 grid place-items-center bg-void"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="w-48 text-center">
                  <p className="text-smoke tabular-nums">
                    Cargando proyectos {Math.round(loading)}%
                  </p>
                  <div className="mt-3 h-px bg-bone/15">
                    <div
                      className="h-px bg-bone transition-[width] duration-300"
                      style={{ width: `${loading}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>


      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-40 -mt-1.5 -ml-1.5 size-3 rounded-full bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.35),0_2px_8px_rgba(0,0,0,0.35)]"
        style={{ x: pointerX, y: pointerY }}
        initial={false}
        animate={{
          opacity: pointerInside && open === null ? 1 : 0,
          scale: dragging ? 0.7 : hover ? 1.6 : 1,
        }}
        transition={{ duration: 0.2 }}
      />

      <ProjectDetail
        index={open}
        onClose={() => setOpen(null)}
        onNavigate={(index) => {
          setOpen(index);
          goTo(index);
        }}
      />
    </>
  );
}
