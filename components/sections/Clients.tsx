"use client";

/**
 * Clients — components/sections/Clients.tsx
 *
 * "BRANDS THAT TRUSTED THE PROCESS."
 * Animated client logo marquee using CSS animation.
 * Add real client logos when available.
 */

import { AnimatedText } from "@/components/ui/AnimatedText";
import { cn } from "@/lib/cn";

// Placeholder client names — replace with real logos when provided
const clients = [
  "KALRAV",
  "Client Name",
  "Client Name",
  "Client Name",
  "Client Name",
  "Client Name",
];

export function Clients() {
  // Duplicate for seamless marquee loop
  const marqueeItems = [...clients, ...clients];

  return (
    <section
      className={cn("section bg-[var(--creoit-dark)]")}
      aria-labelledby="clients-heading"
    >
      <div className="container mb-12">
        <p className="section-label">Clients</p>
        <AnimatedText
          text="BRANDS THAT TRUSTED THE PROCESS."
          as="h2"
          id="clients-heading"
          splitBy="word"
          delay={0}
          stagger={0.04}
          className="font-display font-bold text-[var(--creoit-off-white)] max-w-2xl"
        />
      </div>

      {/* Marquee */}
      <div className="overflow-hidden border-y border-[var(--border)] py-8" aria-hidden="true">
        <div
          className={cn(
            "flex gap-16 items-center",
            "animate-[marquee_20s_linear_infinite]"
          )}
          style={{
            width: "max-content",
            animation: "marquee 20s linear infinite",
          }}
        >
          {marqueeItems.map((client, i) => (
            <span
              key={`${client}-${i}`}
              className={cn(
                "font-display font-bold text-2xl md:text-3xl uppercase tracking-widest",
                "text-[var(--creoit-grey)] hover:text-[var(--creoit-off-white)]",
                "transition-colors duration-300 whitespace-nowrap",
                "cursor-default"
              )}
            >
              {client}
            </span>
          ))}
        </div>
      </div>

      {/* Marquee keyframe via global style */}
      <style
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: `@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`,
        }}
      />
    </section>
  );
}

export default Clients;
