"use client";

/** WorkGrid — category filter over projects. Real projects link to their case study; the rest are honest "unexposed frames". */

import { useState } from "react";
import Link from "next/link";
import { projects } from "@/content/work";
import { MandalaFrame } from "@/components/ui/MandalaFrame";
import type { ServiceCategory } from "@/types";

const FILTERS: ("All" | ServiceCategory)[] = ["All", "Branding", "Content", "Performance", "Digital", "Events", "Growth"];
const isLive = (desc: string) => desc !== "Coming soon.";

export function WorkGrid() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const shown = projects.filter((p) => filter === "All" || p.categories.includes(filter));

  return (
    <div>
      <div role="group" aria-label="Filter by discipline" className="mono mb-10 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-4 py-2.5 transition-colors duration-500 ${
              filter === f ? "border-signal bg-signal text-paper" : "border-ink/25 text-ink/70 hover:border-ink hover:text-ink"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <ul key={filter} className="grid gap-4 md:grid-cols-2">
        {shown.map((p, i) => {
          const live = isLive(p.description);
          return (
            <li key={p.id} className={`rise ${live && i === 0 ? "md:col-span-2" : ""}`} style={{ animationDelay: `${i * 70}ms` }}>
              {live ? (
                <Link
                  href={`/work/${p.slug}`}
                  data-cursor="View"
                  className="relative block aspect-[4/5] overflow-hidden rounded-[14px] bg-[#0d0420] text-paper sm:aspect-[16/10] md:aspect-[21/9]"
                >
                  <MandalaFrame title={p.client} rec={p.projectName} left={p.categories.join(" · ")} right={`Bhopal · ${p.year}`} />
                </Link>
              ) : (
                <Link
                  href="/contact"
                  data-cursor="Develop"
                  className="group relative flex aspect-[4/3] flex-col justify-between overflow-hidden rounded-[14px] border border-ink/20 bg-ink p-6 text-paper transition-colors duration-700 hover:border-signal"
                >
                  <span aria-hidden className="absolute inset-0 translate-y-full bg-signal transition-transform duration-[900ms] ease-[var(--ease)] group-hover:translate-y-0" />
                  <span aria-hidden className="absolute inset-x-0 top-0 h-3 opacity-40 [background:repeating-linear-gradient(90deg,transparent_0_10px,rgba(255,255,255,.7)_10px_18px)]" />
                  <span aria-hidden className="absolute inset-x-0 bottom-0 h-3 opacity-40 [background:repeating-linear-gradient(90deg,transparent_0_10px,rgba(255,255,255,.7)_10px_18px)]" />
                  <span className="mono relative z-10 mt-4 flex justify-between">
                    <span>Frame 0{i + 1}</span>
                    <span>Unexposed</span>
                  </span>
                  <span className="relative z-10 mb-2">
                    <span className="display block text-[clamp(1.8rem,3vw,3rem)]">{p.categories.join(" + ")} frame</span>
                    <span className="serif-i mt-2 block text-xl text-paper/75">{p.tagline}</span>
                    <span className="mono mt-5 block">Develop this frame →</span>
                  </span>
                </Link>
              )}
              {live && (
                <div className="mono mt-3 flex items-center justify-between gap-4 text-ink/60">
                  <span>{p.client}</span>
                  <span className="text-right">{p.tagline}</span>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {shown.length === 0 && (
        <p className="serif-i py-16 text-3xl text-ink/70">
          No frames here yet.{" "}
          <Link href="/contact" className="u-link text-signal">
            Be the first →
          </Link>
        </p>
      )}
    </div>
  );
}
