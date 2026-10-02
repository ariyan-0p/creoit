"use client";

/**
 * LensRing — the page-hero motif: a lens barrel with engraved text that
 * turns slowly, and turns faster with scroll velocity.
 */

import { useEffect, useId, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useLenis } from "@/providers/SmoothScrollProvider";

export function LensRing({ text, className }: { text: string; className?: string }) {
  const id = useId().replace(/:/g, "");
  const spin = useRef<SVGGElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    const g = spin.current;
    if (!g || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let angle = 0;
    let boost = 0;
    const tick = () => {
      const v = lenis ? Math.abs(lenis.velocity) : 0;
      boost += (Math.min(v, 30) * 0.12 - boost) * 0.08;
      angle += 0.06 + boost;
      g.setAttribute("transform", `rotate(${angle.toFixed(2)})`);
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [lenis]);

  const label = `${text} ✺ `.repeat(3);

  return (
    <svg viewBox="-200 -200 400 400" className={className} role="img" aria-label={text}>
      <defs>
        <path id={`ring-${id}`} d="M0 -158 a158 158 0 1 1 0 316 a158 158 0 1 1 0 -316" />
        <radialGradient id={`glow-${id}`}>
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.3" stopColor="#a48bff" />
          <stop offset="1" stopColor="#6a3dff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle r="92" fill={`url(#glow-${id})`} opacity="0.9" />
      <g ref={spin}>
        <text className="mono" fill="white" fontSize="13" letterSpacing="4.2">
          <textPath href={`#ring-${id}`} textLength="990" lengthAdjust="spacing">
            {label}
          </textPath>
        </text>
      </g>
      <circle r="190" fill="none" stroke="white" strokeOpacity="0.5" strokeWidth="1" />
      <circle r="132" fill="none" stroke="white" strokeOpacity="0.35" strokeWidth="1" />
      <circle r="92" fill="none" stroke="white" strokeOpacity="0.6" strokeWidth="1.2" />
      <circle r="4" fill="white" />
    </svg>
  );
}
