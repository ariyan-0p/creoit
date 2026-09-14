"use client";

/**
 * WhatWeDo — components/sections/WhatWeDo.tsx
 *
 * Lists the 6 CREOIT service offerings.
 * Services reveal on hover with a numbered accordion-style layout.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { services } from "@/content/services";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { cn } from "@/lib/cn";

export function WhatWeDo() {
  const [activeService, setActiveService] = useState<string | null>(null);

  return (
    <section
      className={cn("section bg-[var(--creoit-dark)]")}
      aria-labelledby="what-we-do-heading"
    >
      <div className="container">
        <p className="section-label">Services</p>
        <AnimatedText
          text="ONE TEAM. MULTIPLE POWERS."
          as="h2"
          id="what-we-do-heading"
          splitBy="word"
          delay={0}
          stagger={0.05}
          className="font-display font-bold text-[var(--creoit-off-white)] mb-16 max-w-3xl"
        />

        {/* Services List */}
        <div className="flex flex-col divide-y divide-[var(--border)]">
          {services.map((service) => (
            <motion.div
              key={service.id}
              className={cn(
                "group py-7 cursor-pointer",
                "transition-all duration-300"
              )}
              onHoverStart={() => setActiveService(service.id)}
              onHoverEnd={() => setActiveService(null)}
            >
              <div className="flex items-start justify-between gap-8">
                <div className="flex items-start gap-8 flex-1">
                  {/* Number */}
                  <span className="font-display font-semibold text-xs text-[var(--creoit-grey-mid)] mt-1 w-6 flex-shrink-0">
                    {service.number}
                  </span>

                  {/* Title */}
                  <div className="flex-1">
                    <h3
                      className={cn(
                        "font-display font-bold text-2xl md:text-3xl",
                        "text-[var(--creoit-off-white)]",
                        "group-hover:text-[var(--creoit-accent)]",
                        "transition-colors duration-300"
                      )}
                    >
                      {service.title}
                    </h3>

                    <AnimatePresence>
                      {activeService === service.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="font-body text-sm text-[var(--creoit-grey-light)] mt-3 max-w-lg leading-relaxed">
                            {service.description}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Offerings tags */}
                <div className="hidden md:flex flex-wrap gap-2 max-w-sm justify-end">
                  {service.offerings.map((offering) => (
                    <span
                      key={offering}
                      className={cn(
                        "font-display text-[10px] uppercase tracking-widest",
                        "px-3 py-1 border border-[var(--border)]",
                        "text-[var(--creoit-grey-mid)]",
                        "group-hover:border-[var(--creoit-accent-dim)]",
                        "transition-colors duration-300"
                      )}
                    >
                      {offering}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12">
          <Link
            href="/what-we-do"
            className={cn(
              "font-display font-semibold text-xs uppercase tracking-widest",
              "inline-flex items-center gap-3",
              "text-[var(--creoit-grey-light)] hover:text-[var(--creoit-accent)]",
              "transition-colors duration-300",
              "group"
            )}
          >
            See All Services
            <motion.span
              className="inline-block"
              initial={{ x: 0 }}
              whileHover={{ x: 6 }}
            >
              →
            </motion.span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default WhatWeDo;
