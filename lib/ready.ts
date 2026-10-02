/**
 * Tiny "site is revealed" signal. The preloader flips it once the curtain is
 * up; hero / intro animations wait on it so nothing plays behind the curtain.
 */
let isReady = false;
const listeners = new Set<() => void>();

export function markReady() {
  if (isReady) return;
  isReady = true;
  listeners.forEach((fn) => fn());
  listeners.clear();
}

export function onReady(fn: () => void) {
  if (isReady) {
    fn();
    return () => {};
  }
  listeners.add(fn);
  return () => listeners.delete(fn);
}
