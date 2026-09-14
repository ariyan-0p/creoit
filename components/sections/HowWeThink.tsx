"use client";

/**
 * HowWeThink — components/sections/HowWeThink.tsx
 *
 * The "Everything Starts With A Question" section.
 * Displays the 5 brand questions with scroll-triggered stagger.
 */

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { cn } from "@/lib/cn";

const questions = [
  "Why should anyone care about this brand?",
  "What makes this brand different?",
  "Who are we talking to?",
  "What will make people stop scrolling?",
  "How do we turn attention into business?",
];

export function HowWeThink() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".think-question", {
        opacity: 0,
        x: -30,
        stagger: 0.12,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".think-questions",
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
      aria-labelledby="how-we-think-heading"
    >
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: Headline */}
          <div>
            <p className="section-label">Our Thinking</p>
            <AnimatedText
              text="EVERYTHING STARTS WITH A QUESTION."
              as="h2"
              id="how-we-think-heading"
              splitBy="word"
              delay={0}
              stagger={0.05}
              className="font-display font-bold text-[var(--creoit-off-white)] mb-8"
            />
            <p className="font-body text-[var(--creoit-grey-light)] leading-relaxed max-w-md">
              Before creating content, campaigns or advertisements, we find
              the answers. Strategy drives everything we make.
            </p>
          </div>

          {/* Right: Questions */}
          <div className="think-questions flex flex-col gap-0">
            {questions.map((question, i) => (
              <div
                key={i}
                className={cn(
                  "think-question",
                  "py-6 border-b border-[var(--border)]",
                  "flex items-start gap-5 group"
                )}
              >
                <span className="font-display text-xs text-[var(--creoit-grey-mid)] mt-1 w-5 flex-shrink-0">
                  0{i + 1}
                </span>
                <p className={cn(
                  "font-display font-medium text-base md:text-lg",
                  "text-[var(--creoit-grey-light)]",
                  "group-hover:text-[var(--creoit-off-white)]",
                  "transition-colors duration-300"
                )}>
                  {question}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowWeThink;
