"use client";

/**
 * OurProcess — components/sections/OurProcess.tsx
 *
 * "FROM IDEA TO IMPACT" — 5-step process section.
 * Horizontal scroll-driven timeline on desktop.
 */

import { AnimatedText } from "@/components/ui/AnimatedText";
import { cn } from "@/lib/cn";
import type { ProcessStep } from "@/types";

const steps: ProcessStep[] = [
  {
    number: "01",
    title: "Understand",
    description: "We understand the business, market and audience.",
  },
  {
    number: "02",
    title: "Define",
    description: "We build the strategy and direction.",
  },
  {
    number: "03",
    title: "Create",
    description: "We turn strategy into creative ideas.",
  },
  {
    number: "04",
    title: "Execute",
    description: "We bring ideas to life.",
  },
  {
    number: "05",
    title: "Optimize",
    description: "We analyze, learn and improve.",
  },
];

export function OurProcess() {
  return (
    <section
      className={cn("section bg-[var(--creoit-dark)]")}
      aria-labelledby="process-heading"
    >
      <div className="container">
        <p className="section-label">How We Work</p>
        <AnimatedText
          text="FROM IDEA TO IMPACT."
          as="h2"
          id="process-heading"
          splitBy="word"
          delay={0}
          stagger={0.06}
          className="font-display font-bold text-[var(--creoit-off-white)] mb-16"
        />

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="flex flex-col"
            >
              {/* Connector line (desktop) */}
              <div className="flex items-center gap-0 mb-6 lg:mb-8">
                <div className="w-8 h-px bg-[var(--creoit-accent)]" />
                {i < steps.length - 1 && (
                  <div className="hidden lg:block flex-1 h-px bg-[var(--border)]" />
                )}
              </div>

              <span className="font-display font-semibold text-xs text-[var(--creoit-accent)] tracking-widest mb-3">
                {step.number}
              </span>
              <h3 className="font-display font-bold text-xl text-[var(--creoit-off-white)] mb-3">
                {step.title}
              </h3>
              <p className="font-body text-sm text-[var(--creoit-grey-light)] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default OurProcess;
