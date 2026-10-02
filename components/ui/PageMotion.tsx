"use client";

/**
 * PageMotion — wraps a page and wires up scroll reveals for marked elements:
 *   [data-lines]   headline → masked line-by-line rise (SplitText)
 *   [data-reveal]  block → fade/rise, batched so siblings stagger
 * Anything already in view waits for the preloader curtain (onReady).
 * Content is fully visible without JS / with reduced motion.
 */

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { onReady } from "@/lib/ready";

export function PageMotion({ children, className }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cleanups: Array<() => void> = [];
    const gate = (fn: () => void) => {
      cleanups.push(onReady(fn));
    };

    const ctx = gsap.context(() => {
      el.querySelectorAll<HTMLElement>("[data-lines]").forEach((node) => {
        const split = SplitText.create(node, { type: "lines", mask: "lines", linesClass: "pm-line" });
        const tween = gsap.from(split.lines, {
          yPercent: 110,
          duration: 1.25,
          stagger: 0.09,
          ease: "expo.out",
          paused: true,
        });
        ScrollTrigger.create({ trigger: node, start: "top 92%", once: true, onEnter: () => gate(() => tween.play()) });
      });

      const items = gsap.utils.toArray<HTMLElement>("[data-reveal]", el);
      gsap.set(items, { opacity: 0, y: 36 });
      ScrollTrigger.batch(items, {
        start: "top 92%",
        once: true,
        onEnter: (batch) =>
          gate(() => {
            gsap.to(batch, { opacity: 1, y: 0, duration: 1, stagger: 0.08, ease: "expo.out" });
          }),
      });
    }, el);

    return () => {
      cleanups.forEach((c) => c());
      ctx.revert();
    };
  }, []);

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
