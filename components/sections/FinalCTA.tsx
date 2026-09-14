"use client";

/**
 * FinalCTA — components/sections/FinalCTA.tsx
 *
 * "GOT SOMETHING WORTH BUILDING?" — closing call to action.
 * Full-width bold section with magnetic CTA button.
 */

import Link from "next/link";
import { motion } from "framer-motion";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { cn } from "@/lib/cn";

export function FinalCTA() {
  return (
    <section
      className={cn(
        "section bg-[var(--creoit-black)]",
        "relative overflow-hidden"
      )}
      aria-labelledby="final-cta-heading"
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(232,98,42,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="container relative z-10 text-center">
        <p className="section-label text-center mx-auto">Ready to build?</p>

        <div className="max-w-4xl mx-auto">
          <AnimatedText
            text="GOT SOMETHING WORTH BUILDING?"
            as="h2"
            id="final-cta-heading"
            splitBy="word"
            delay={0}
            stagger={0.06}
            duration={0.9}
            className="font-display font-bold text-[var(--creoit-off-white)] mb-6"
          />
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="font-body text-lg text-[var(--creoit-grey-light)] mb-12 max-w-md mx-auto"
        >
          Let&apos;s make people notice it.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <MagneticButton strength={0.3}>
            <Link
              href="/contact"
              className={cn(
                "font-display font-bold text-sm uppercase tracking-[0.2em]",
                "px-12 py-5 inline-flex items-center gap-3",
                "bg-[var(--creoit-accent)] text-white",
                "border border-[var(--creoit-accent)]",
                "hover:bg-transparent hover:text-[var(--creoit-accent)]",
                "transition-all duration-400"
              )}
            >
              Let&apos;s Create
              <span>→</span>
            </Link>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}

export default FinalCTA;
