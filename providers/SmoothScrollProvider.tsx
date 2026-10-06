"use client";

/**
 * SmoothScrollProvider — one clock for everything.
 *
 * Lenis is driven by GSAP's ticker (no second rAF loop) and feeds
 * ScrollTrigger on every tick, so scrubbed animations never drift from
 * the scroll position. Disabled for prefers-reduced-motion.
 */

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { LENIS_OPTIONS } from "@/lib/lenis";
import { lenisStore } from "@/lib/lenis-store";
import { initPerf } from "@/lib/perf";

export function useLenis() {
  return useSyncExternalStore(lenisStore.subscribe, lenisStore.get, lenisStore.getServer);
}

export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    initPerf((fn) => {
      gsap.ticker.add(fn);
      return () => gsap.ticker.remove(fn);
    });
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    try {
      history.scrollRestoration = "manual";
    } catch {}

    const instance = new Lenis({ ...LENIS_OPTIONS, autoRaf: false });
    instance.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    lenisStore.set(instance);
    (window as unknown as { __lenis?: Lenis }).__lenis = instance;

    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      lenisStore.set(null);
    };
  }, []);

  return <>{children}</>;
}
