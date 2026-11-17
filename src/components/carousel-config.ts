import { projects } from "../content";

// Geometría del arco de tarjetas, compartida entre la escena 3D y el DOM.
// El proyecto i queda al frente cuando el arco gira i * SLOT radianes.
export const CARD_COUNT = projects.length;
export const SLOT = 0.54;
export const LAST = CARD_COUNT - 1;

// Alto de scroll que ocupa cada proyecto, en svh
export const STEP_VH = 55;

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

// Estado mutable que el DOM escribe y la escena lee en cada cuadro.
// `progress` va de 0 (primer proyecto) a LAST (último), con decimales.
export type CarouselControl = {
  progress: number;
  moved: number;
};

export type HoverKind = "front" | "side" | null;
