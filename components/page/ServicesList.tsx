"use client";

/**
 * ServicesList — six services as a typographic index. Hover (or tap) a row
 * and it opens like an aperture: headline, copy and offerings unfold, and
 * the row fills purple. Pure CSS grid-rows transition, no layout thrash.
 */

import { useState } from "react";
import Link from "next/link";
import { services } from "@/content/services";

const STOPS = ["f/1.4", "f/2", "f/2.8", "f/4", "f/5.6", "f/8"];

export function ServicesList() {
  const [open, setOpen] = useState<string>(services[0].id);

  return (
    <ul className="border-t border-ink/15">
      {services.map((s, i) => {
        const isOpen = open === s.id;
        return (
          <li key={s.id} data-reveal className="border-b border-ink/15">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`svc-${s.id}`}
              onClick={() => setOpen(isOpen ? "" : s.id)}
              onMouseEnter={() => window.matchMedia("(hover: hover)").matches && setOpen(s.id)}
              className={`group relative grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-x-4 px-0 py-6 text-left transition-colors duration-700 md:grid-cols-[6rem_1fr_auto] md:py-8 ${
                isOpen ? "text-ink" : "text-ink/45 hover:text-ink"
              }`}
              data-cursor={isOpen ? undefined : "Open"}
            >
              <span className="mono text-signal">{s.number}</span>
              <span className="display text-[clamp(2.4rem,8vw,8.5rem)] leading-[0.95]">{s.title}</span>
              <span className="mono hidden text-ink/50 sm:block">{STOPS[i]}</span>
            </button>

            <div
              id={`svc-${s.id}`}
              className={`grid transition-[grid-template-rows,opacity] duration-[900ms] ease-[var(--ease)] ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="grid gap-8 pb-10 md:grid-cols-[6rem_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4">
                  <span />
                  <div>
                    <p className="serif-i max-w-[16ch] text-[clamp(1.8rem,3.4vw,3.4rem)] leading-[1.02] text-signal">{s.headline}</p>
                    <p className="mt-5 max-w-md text-[0.97rem] leading-relaxed text-ink/70">{s.description}</p>
                  </div>
                  <ul className="mono flex min-w-0 flex-wrap content-start gap-2 md:justify-end">
                    {s.offerings.map((o) => (
                      <li key={o} className="rounded-full border border-ink/25 px-3 py-1.5">
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </li>
        );
      })}
      <li className="mono pt-6 text-ink/55">
        Not sure which lens you need?{" "}
        <Link href="/contact" className="u-link text-ink">
          Tell us what you&apos;re building →
        </Link>
      </li>
    </ul>
  );
}
