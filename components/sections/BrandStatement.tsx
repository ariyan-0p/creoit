"use client";

/**
 * BrandStatement — components/sections/BrandStatement.tsx
 *
 * Typography-focused statement section. Minimal, bold, cinematic.
 * Text reveals on scroll using Framer Motion.
 */

import { AnimatedText } from "@/components/ui/AnimatedText";
import { cn } from "@/lib/cn";

export function BrandStatement() {
  return (
    <section
      className={cn("section bg-[var(--creoit-black)]")}
      aria-labelledby="brand-statement-heading"
    >
      <div className="container max-w-5xl">
        <AnimatedText
          text="WE DON'T JUST MARKET BRANDS."
          as="h2"
          id="brand-statement-heading"
          splitBy="word"
          delay={0}
          stagger={0.05}
          duration={0.8}
          className={cn(
            "font-display font-bold leading-tight",
            "text-[var(--creoit-off-white)] mb-2"
          )}
        />
        <AnimatedText
          text="WE BUILD THEIR PRESENCE."
          as="h2"
          splitBy="word"
          delay={0.3}
          stagger={0.05}
          duration={0.8}
          className={cn(
            "font-display font-bold leading-tight",
            "gradient-text mb-12 md:mb-16"
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mt-12">
          {[
            {
              label: "Attention",
              text: "Attention is easy to buy.",
            },
            {
              label: "Trust",
              text: "Trust is difficult to earn.",
            },
            {
              label: "Relevance",
              text: "Relevance is even harder.",
            },
          ].map((item, i) => (
            <div key={item.label} className="stagger-children">
              <div
                className="w-8 h-px bg-[var(--creoit-accent)] mb-4"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
              <p className="font-display font-medium text-xs uppercase tracking-widest text-[var(--creoit-accent)] mb-2">
                {item.label}
              </p>
              <p className="font-body text-base text-[var(--creoit-grey-light)]">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        <p className={cn(
          "mt-12 font-display font-medium text-lg md:text-xl",
          "text-[var(--creoit-off-white)]"
        )}>
          We help brands build all three.
        </p>
      </div>
    </section>
  );
}

export default BrandStatement;
