"use client";

/**
 * ServicesGrid — all six services at a glance. A clean, scannable overview that
 * sits above the pinned aperture: number, name, one line, and what's inside.
 * Each card links to /what-we-do and fills purple on hover.
 */

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { services } from "@/content/services";
import { Pill } from "@/components/ui/Pill";

export function ServicesGrid() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".sv-in", {
          y: 40,
          opacity: 0,
          duration: 1,
          stagger: 0.08,
          ease: "expo.out",
          scrollTrigger: { trigger: root.current, start: "top 78%" },
        });
        gsap.from(".sv-card", {
          y: 50,
          opacity: 0,
          duration: 1,
          stagger: 0.07,
          ease: "expo.out",
          scrollTrigger: { trigger: ".sv-grid", start: "top 85%" },
        });
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      data-nav="light"
      aria-labelledby="services-title"
      className="relative z-10 bg-paper px-[var(--pad)] pb-[clamp(4rem,8vw,7rem)] pt-[clamp(3rem,6vw,5rem)] text-ink"
    >
      <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mono sv-in mb-5 text-ink/55">Services</p>
          <h2 id="services-title" className="sv-in display max-w-[16ch] text-[clamp(2.2rem,5.6vw,5.6rem)] leading-[0.97]">
            Six ways we make brands <span className="serif-i text-[1.08em] text-signal">unforgettable.</span>
          </h2>
        </div>
        <div className="sv-in">
          <Pill href="/what-we-do" tone="dark" cursor="Explore">
            All services
          </Pill>
        </div>
      </div>

      <ul className="sv-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <li key={s.id} className="sv-card">
            <Link
              href="/what-we-do"
              data-cursor="Explore"
              className="group relative flex h-full min-h-[16rem] flex-col justify-between gap-8 overflow-hidden rounded-[1.5rem] border border-ink/15 p-6 transition-[background-color,color,border-color] duration-500 hover:border-signal hover:bg-signal hover:text-paper md:min-h-[19rem] md:p-8"
            >
              <div className="mono flex items-center justify-between text-ink/55 transition-colors duration-500 group-hover:text-paper/80">
                <span>{s.number}</span>
                <span aria-hidden className="text-base transition-transform duration-500 group-hover:rotate-45">↗</span>
              </div>

              <div>
                <h3 className="display text-[clamp(2rem,3vw,3.2rem)] leading-[0.98]">{s.title}</h3>
                <p className="serif-i mt-2 text-[1.25rem] leading-[1.15] text-signal transition-colors duration-500 group-hover:text-paper">
                  {s.headline}
                </p>
                <p className="mono mt-5 text-ink/55 transition-colors duration-500 group-hover:text-paper/80">{s.offerings.join(" · ")}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
