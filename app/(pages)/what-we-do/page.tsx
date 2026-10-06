import type { Metadata } from "next";
import { PageMotion } from "@/components/ui/PageMotion";
import { PageHero } from "@/components/page/PageHero";
import { ServicesList } from "@/components/page/ServicesList";

export const metadata: Metadata = {
  title: "What We Do — Services",
  description:
    "CREOIT offers branding, content production, performance marketing, digital experiences, event marketing, and growth strategy. One team, multiple powers.",
};

const STEPS = [
  { n: "01", t: "Understand", d: "We understand the business, market and audience." },
  { n: "02", t: "Define", d: "We build the strategy and direction." },
  { n: "03", t: "Create", d: "We turn strategy into creative ideas." },
  { n: "04", t: "Execute", d: "We bring ideas to life." },
  { n: "05", t: "Optimize", d: "We analyze, learn and improve." },
];

export default function WhatWeDoPage() {
  return (
    <PageMotion>
      <PageHero
        index="02"
        label="What we do"
        title={
          <>
            How can we <span className="serif-i text-lilac">help?</span>
          </>
        }
        lead="One team, multiple powers. Six disciplines that work as a single lens — pick one, or bring them all."
      />

      <section data-nav="light" className="relative bg-paper px-[var(--pad)] py-[clamp(4rem,9vw,8rem)] text-ink">
        <p className="mono mb-8 flex items-center justify-between text-ink/55" data-reveal>
          <span>Six services</span>
          <span className="hidden sm:block">Hover to open</span>
        </p>
        <ServicesList />
      </section>

      <section data-nav="dark" className="relative bg-deep px-[var(--pad)] py-[clamp(4rem,9vw,8rem)] text-paper">
        <p className="mono mb-8 text-paper/55" data-reveal>
          How we work
        </p>
        <h2 data-lines className="display max-w-[14ch] text-[clamp(2.4rem,6.6vw,7rem)] leading-[0.96]">
          From idea to <span className="serif-i text-lilac">impact.</span>
        </h2>
        <ol className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-paper/15 bg-paper/15 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((s) => (
            <li key={s.n} data-reveal className="bg-deep p-6 transition-colors duration-500 hover:bg-signal md:p-8">
              <p className="mono mb-10 text-lilac">{s.n}</p>
              <p className="display text-[clamp(1.7rem,2.4vw,2.6rem)]">{s.t}</p>
              <p className="mt-3 text-[0.92rem] leading-relaxed text-paper/70">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>
    </PageMotion>
  );
}
