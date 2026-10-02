"use client";

/** Culture — big marquee of the three values. Scroll velocity nudges the speed. */

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useLenis } from "@/providers/SmoothScrollProvider";

const WORDS = ["Be consistent.", "Be creative.", "Be loud."] as const;

export function Culture() {
  const track = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useGSAP(
    () => {
      if (!track.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const x = gsap.quickSetter(track.current, "x", "px");
      let pos = 0;
      let boost = 0;
      const tick = () => {
        const v = lenis ? Math.abs(lenis.velocity) : 0;
        boost += (Math.min(v, 40) * 0.35 - boost) * 0.08;
        pos -= 0.9 + boost;
        const w = track.current!.scrollWidth / 2;
        if (-pos >= w) pos += w;
        x(pos);
      };
      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    },
    { dependencies: [lenis] }
  );

  const row = (key: string) =>
    WORDS.map((w, i) => (
      <span key={`${key}${w}`} className="flex shrink-0 items-center gap-[0.35em] pr-[0.35em]">
        <span className={i % 2 ? "serif-i text-signal" : ""}>{w}</span>
        <span aria-hidden className="text-signal">
          ✺
        </span>
      </span>
    ));

  return (
    <section data-nav="light" aria-label="Our values" className="relative z-10 overflow-hidden bg-paper py-[clamp(3rem,7vw,6rem)] text-ink">
      <div ref={track} className="display flex w-max text-[clamp(3.6rem,13vw,14rem)] leading-[1] will-change-transform">
        {row("a")}
        {row("b")}
      </div>
      <p className="mono mt-8 px-[var(--pad)] text-ink/55">No big chairs. Just big responsibilities.</p>
    </section>
  );
}
