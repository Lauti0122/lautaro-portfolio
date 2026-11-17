"use client";

import { useSyncExternalStore } from "react";

// true en pantallas táctiles sin mouse: ahí los efectos de hover no existen y
// hay que reemplazarlos por toques, arrastre o scroll
const query = "(hover: none) and (pointer: coarse)";

const subscribe = (notify: () => void) => {
  const media = window.matchMedia(query);
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
};

export function useTouch() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
