/**
 * Lenis Smooth Scroll Config — lib/lenis.ts
 *
 * Exports Lenis constructor options used across the project.
 * Import LenisOptions where you need to instantiate Lenis.
 *
 * Usage:
 *   import { LENIS_OPTIONS } from "@/lib/lenis";
 *   const lenis = new Lenis(LENIS_OPTIONS);
 */

import type Lenis from "lenis";

export type LenisOptions = ConstructorParameters<typeof Lenis>[0];

export const LENIS_OPTIONS: LenisOptions = {
  duration: 1.2,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Expo ease out
  orientation: "vertical",
  gestureOrientation: "vertical",
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
  infinite: false,
};
