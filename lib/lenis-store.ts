import type Lenis from "lenis";

/** External store for the Lenis instance (created client-side, read by any component). */
let instance: Lenis | null = null;
const listeners = new Set<() => void>();

export const lenisStore = {
  get: () => instance,
  getServer: () => null,
  set(next: Lenis | null) {
    instance = next;
    listeners.forEach((l) => l());
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
};
