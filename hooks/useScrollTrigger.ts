"use client";

/**
 * useScrollTrigger — hooks/useScrollTrigger.ts
 *
 * Reusable hook for creating GSAP ScrollTrigger animations.
 * Automatically cleans up on unmount.
 *
 * Usage:
 *   const containerRef = useScrollTrigger((el) => {
 *     gsap.from(el.querySelectorAll(".item"), {
 *       opacity: 0, y: 40, stagger: 0.1,
 *     });
 *   });
 *
 *   return <section ref={containerRef}>...</section>;
 */

import { useEffect, useRef, type RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type ScrollTriggerCallback<T extends HTMLElement> = (
  element: T,
  gsapInstance: typeof gsap
) => gsap.core.Tween | gsap.core.Timeline | void;

interface UseScrollTriggerOptions {
  /** Defaults to "top 85%" */
  start?: string;
  /** Defaults to "bottom 15%" */
  end?: string;
  /** Whether to scrub the animation with scroll position */
  scrub?: boolean | number;
  /** Whether to pin the element during the animation */
  pin?: boolean;
  /** Replay animation each time element enters viewport */
  toggleActions?: string;
  /** Only run once (default: true) */
  once?: boolean;
}

export function useScrollTrigger<T extends HTMLElement = HTMLDivElement>(
  callback: ScrollTriggerCallback<T>,
  options: UseScrollTriggerOptions = {}
): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  const {
    start = "top 85%",
    end = "bottom 15%",
    scrub = false,
    pin = false,
    toggleActions = "play none none none",
    once = true,
  } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const ctx = gsap.context(() => {
      const tween = callback(element, gsap);

      if (tween) {
        ScrollTrigger.create({
          trigger: element,
          start,
          end,
          scrub,
          pin,
          toggleActions: once ? "play none none none" : toggleActions,
          animation: tween,
        });
      }
    }, element);

    return () => {
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}

export default useScrollTrigger;
