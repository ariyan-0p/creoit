import type { Metadata } from "next";
import { PageTransition } from "@/components/layout/PageTransition";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { services } from "@/content/services";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "What We Do — Services",
  description:
    "CREOIT offers branding, content production, performance marketing, digital experiences, event marketing, and growth strategy. One team, multiple powers.",
};

export default function WhatWeDoPage() {
  return (
    <PageTransition>
      <section
        className={cn("section min-h-screen pt-32 bg-[var(--creoit-black)]")}
        aria-labelledby="services-page-heading"
      >
        <div className="container">
          <p className="section-label">Services</p>
          <AnimatedText
            text="HOW CAN WE HELP?"
            as="h1"
            id="services-page-heading"
            splitBy="word"
            delay={0.1}
            stagger={0.08}
            className="font-display font-bold text-[var(--creoit-off-white)] mb-16 max-w-3xl"
          />

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--border)]">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-[var(--creoit-black)] p-8 md:p-10 hover:bg-[var(--creoit-dark)] transition-colors duration-300"
              >
                <span className="font-display text-xs text-[var(--creoit-accent)] tracking-widest mb-4 block">
                  {service.number}
                </span>
                <h2 className="font-display font-bold text-2xl md:text-3xl text-[var(--creoit-off-white)] mb-3">
                  {service.title}
                </h2>
                <p className="font-body text-sm text-[var(--creoit-grey-light)] leading-relaxed mb-6">
                  {service.description}
                </p>
                <ul className="flex flex-col gap-2">
                  {service.offerings.map((offering) => (
                    <li
                      key={offering}
                      className="font-body text-xs text-[var(--creoit-grey-mid)] flex items-center gap-2"
                    >
                      <span className="w-1 h-1 rounded-full bg-[var(--creoit-accent)] flex-shrink-0" />
                      {offering}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
