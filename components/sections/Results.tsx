"use client";

/**
 * Results — components/sections/Results.tsx
 *
 * Stats section: "CREATIVITY IS GOOD. RESULTS ARE BETTER."
 * Animated number counters using GSAP.
 */

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { cn } from "@/lib/cn";
import type { StatItem } from "@/types";

const stats: StatItem[] = [
  { value: "130K+", label: "Music Video Views" },
  { value: "31K+", label: "Campaign Views" },
  { value: "10+", label: "Brands Worked With" },
  { value: "5+", label: "Industries Served" },
];

export function Results() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".stat-item", {
        opacity: 0,
        y: 40,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".stats-grid",
          start: "top 75%",
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className={cn("section bg-[var(--creoit-black)]")}
      aria-labelledby="results-heading"
    >
      <div className="container">
        <div className="mb-16 max-w-3xl">
          <p className="section-label">Impact</p>
          <AnimatedText
            text="CREATIVITY IS GOOD."
            as="h2"
            id="results-heading"
            splitBy="word"
            delay={0}
            stagger={0.06}
            className="font-display font-bold text-[var(--creoit-off-white)]"
          />
          <AnimatedText
            text="RESULTS ARE BETTER."
            as="h2"
            splitBy="word"
            delay={0.3}
            stagger={0.06}
            className="font-display font-bold gradient-text"
          />
        </div>

        {/* Stats Grid */}
        <div className="stats-grid grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={cn(
                "stat-item",
                "py-8 px-4 md:px-6",
                "border-l border-[var(--border)] first:border-l-0 md:first:border-l md:border-l",
                "flex flex-col"
              )}
            >
              <span
                className={cn(
                  "font-display font-bold",
                  "text-4xl md:text-5xl lg:text-6xl",
                  "text-[var(--creoit-off-white)] mb-3"
                )}
              >
                {stat.value}
              </span>
              <span className="font-body text-sm text-[var(--creoit-grey-light)]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-10 font-display text-xs uppercase tracking-widest text-[var(--creoit-grey-mid)]">
          * Only genuine and verifiable numbers are displayed.
        </p>
      </div>
    </section>
  );
}

export default Results;
