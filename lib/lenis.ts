/**
 * Lenis config — lib/lenis.ts
 */

import type Lenis from "lenis";

export type LenisOptions = NonNullable<ConstructorParameters<typeof Lenis>[0]>;

export const LENIS_OPTIONS: LenisOptions = {
  duration: 1.15,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: "vertical",
  gestureOrientation: "vertical",
  smoothWheel: true,
  wheelMultiplier: 0.95,
  touchMultiplier: 1.6,
  infinite: false,
};
