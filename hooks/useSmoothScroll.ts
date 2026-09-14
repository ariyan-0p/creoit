"use client";

/**
 * useSmoothScroll — hooks/useSmoothScroll.ts
 *
 * Access the Lenis instance from anywhere in the app.
 * Also provides convenience scroll-to helpers.
 *
 * Usage:
 *   const { lenis, scrollTo } = useSmoothScroll();
 *   scrollTo("#section", { offset: -80 });
 */

import { useLenis } from "@/providers/SmoothScrollProvider";

interface ScrollToOptions {
  offset?: number;
  duration?: number;
  easing?: (t: number) => number;
  immediate?: boolean;
  lock?: boolean;
  onComplete?: () => void;
}

export function useSmoothScroll() {
  const lenis = useLenis();

  const scrollTo = (
    target: string | number | HTMLElement,
    options?: ScrollToOptions
  ) => {
    if (!lenis) return;
    lenis.scrollTo(target, options);
  };

  const scrollToTop = (options?: ScrollToOptions) => {
    if (!lenis) return;
    lenis.scrollTo(0, options);
  };

  const stop = () => {
    if (!lenis) return;
    lenis.stop();
  };

  const start = () => {
    if (!lenis) return;
    lenis.start();
  };

  return { lenis, scrollTo, scrollToTop, stop, start };
}

export default useSmoothScroll;
