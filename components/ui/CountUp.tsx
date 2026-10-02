"use client";

/** CountUp — tweens a number when it scrolls into view (writes textContent directly, no React renders). */

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

export function CountUp({ to, suffix = "", className }: { to: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const o = { v: reduce ? to : 0 };
      el.textContent = `${Math.round(o.v)}${suffix}`;
      if (reduce) return;
      gsap.to(o, {
        v: to,
        duration: 2.2,
        ease: "expo.out",
        onUpdate: () => {
          el.textContent = `${Math.round(o.v)}${suffix}`;
        },
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
    },
    { scope: ref, dependencies: [to, suffix] }
  );

  return (
    <span ref={ref} className={className} aria-label={`${to}${suffix}`}>
      {to}
      {suffix}
    </span>
  );
}
