"use client";

/** Numbers — the one full-colour moment. Counts up as it enters. */

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";
import { CountUp } from "@/components/ui/CountUp";

const STATS = [
  { to: 130, suffix: "K+", label: "Music video views" },
  { to: 31, suffix: "K+", label: "Campaign views" },
  { to: 10, suffix: "+", label: "Brands worked with" },
  { to: 5, suffix: "+", label: "Industries served" },
] as const;

export function Numbers() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(".nm-title", { type: "lines", mask: "lines", linesClass: "nm-line" });
        gsap.from(split.lines, {
          yPercent: 110,
          duration: 1.2,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: { trigger: ".nm-title", start: "top 85%" },
        });
        gsap.from(".nm-stat", {
          y: 50,
          opacity: 0,
          duration: 1,
          stagger: 0.09,
          ease: "expo.out",
          scrollTrigger: { trigger: ".nm-grid", start: "top 85%" },
        });
        return () => split.revert();
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      data-nav="dark"
      aria-labelledby="numbers-title"
      className="relative z-10 overflow-hidden bg-signal px-[var(--pad)] py-[clamp(5rem,10vw,9rem)] text-paper"
    >
      <div className="mono mb-10 flex items-center justify-between">
        <span>[ 05 ] Impact</span>
        <span className="hidden sm:block">Measured, not guessed</span>
      </div>

      <h2 id="numbers-title" className="nm-title display max-w-[15ch] text-[clamp(2.4rem,7.6vw,8.6rem)] leading-[0.96]">
        Creativity is good. Results are <span className="serif-i text-[1.08em] text-ink">better.</span>
      </h2>

      <ul className="nm-grid mt-[clamp(3rem,7vw,7rem)] grid grid-cols-2 border-t border-paper/30 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <li
            key={s.label}
            className={`nm-stat border-b border-paper/30 py-8 pr-4 lg:border-b-0 lg:py-10 ${i > 0 ? "lg:border-l lg:pl-8" : ""} ${i % 2 === 1 ? "border-l pl-6 lg:pl-8" : ""}`}
          >
            <CountUp to={s.to} suffix={s.suffix} className="display block text-[clamp(3.2rem,8.6vw,9rem)] leading-none" />
            <p className="mono mt-3">{s.label}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
