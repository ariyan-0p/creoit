"use client";

/**
 * TeamCulture — components/sections/TeamCulture.tsx
 *
 * "NO BIG CHAIRS. JUST BIG RESPONSIBILITIES."
 * Team culture statement with roles marquee and CTA.
 */

import Link from "next/link";
import { motion } from "framer-motion";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { cn } from "@/lib/cn";

const roles = [
  "Strategists",
  "Designers",
  "Marketers",
  "Filmmakers",
  "Creators",
  "Thinkers",
  "Problem-Solvers",
  "Builders",
];

export function TeamCulture() {
  return (
    <section
      className={cn("section bg-[var(--creoit-black)]")}
      aria-labelledby="team-culture-heading"
    >
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Text */}
          <div>
            <p className="section-label">Our Culture</p>
            <AnimatedText
              text="NO BIG CHAIRS."
              as="h2"
              id="team-culture-heading"
              splitBy="word"
              delay={0}
              stagger={0.07}
              className="font-display font-bold text-[var(--creoit-off-white)]"
            />
            <AnimatedText
              text="JUST BIG RESPONSIBILITIES."
              as="h2"
              splitBy="word"
              delay={0.25}
              stagger={0.07}
              className="font-display font-bold text-[var(--creoit-off-white)] mb-8"
            />

            <p className="font-body text-[var(--creoit-grey-light)] leading-relaxed mb-4 max-w-md">
              CREOIT is built by people who bring different skills to the same
              table.
            </p>
            <p className="font-body text-[var(--creoit-grey-light)] leading-relaxed mb-4 max-w-md">
              Different roles. One team.
            </p>

            <Link
              href="/about"
              className={cn(
                "mt-6 inline-flex items-center gap-2 group",
                "font-display font-semibold text-xs uppercase tracking-widest",
                "text-[var(--creoit-off-white)] hover:text-[var(--creoit-accent)]",
                "transition-colors duration-300"
              )}
            >
              Meet The Team
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Link>
          </div>

          {/* Right: Roles marquee / grid */}
          <div className="grid grid-cols-2 gap-3">
            {roles.map((role, i) => (
              <motion.div
                key={role}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "py-4 px-5 border border-[var(--border)]",
                  "font-display font-medium text-sm text-[var(--creoit-grey-light)]",
                  "hover:border-[var(--creoit-accent)] hover:text-[var(--creoit-off-white)]",
                  "transition-all duration-300 cursor-default"
                )}
              >
                {role}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TeamCulture;
