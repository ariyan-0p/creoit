/**
 * Performance tier — decided once on load, then watched.
 *
 * "full"  → everything on.
 * "lite"  → same design, cheaper paint: no live blur, no hero bokeh canvas,
 *           a smaller globe texture. Chosen for weak hardware (few cores, little
 *           memory, Save-Data) and, as a safety net, for any device whose frame
 *           rate stays low after the page is up.
 *
 * The tier is mirrored on <html data-perf="…"> so CSS can react without JS.
 */

type Tier = "full" | "lite";

let tier: Tier = "full";
let detected = false;

/** Static guess from the hardware. Runs lazily so any component can ask first. */
function detect() {
  if (detected || typeof window === "undefined") return;
  detected = true;
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  const weak =
    (nav.hardwareConcurrency && nav.hardwareConcurrency <= 4) ||
    (nav.deviceMemory && nav.deviceMemory <= 4) ||
    nav.connection?.saveData === true;
  tier = weak ? "lite" : "full";
  document.documentElement.dataset.perf = tier;
}
const listeners = new Set<(t: Tier) => void>();

function set(next: Tier) {
  if (next === tier) return;
  tier = next;
  document.documentElement.dataset.perf = next;
  listeners.forEach((l) => l(next));
}

export const perf = {
  get tier() {
    detect();
    return tier;
  },
  get lite() {
    detect();
    return tier === "lite";
  },
  subscribe(fn: (t: Tier) => void) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};

let started = false;

/** Call once on the client. Cheap static guess first, then a frame-rate watch. */
export function initPerf(tick: (fn: (time: number) => void) => () => void) {
  if (started || typeof window === "undefined") return;
  started = true;

  detect();
  if (tier === "lite") return;

  // Safety net: if frames average slower than ~28ms for ~2s while scrolling/animating, drop to lite.
  let last = 0;
  let slow = 0;
  let n = 0;
  const stop = tick((t) => {
    if (document.hidden) {
      last = 0;
      return;
    }
    if (last) {
      const dt = t - last;
      if (dt < 0.5) {
        n++;
        slow += dt > 0.028 ? 1 : 0;
        if (n === 90) {
          if (slow / n > 0.5) {
            set("lite");
            stop();
          } else {
            slow = n = 0;
          }
        }
      }
    }
    last = t;
  });
}
