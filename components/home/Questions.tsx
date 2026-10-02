"use client";

/**
 * Questions — "Everything starts with a question."
 * A real Q&A: five questions we ask before we make anything, each with its
 * answer. One is open at a time (click or Enter/Space). Answers are drawn from
 * our own service and process copy. Below it, the five-step process draws itself.
 */

import { useRef, useState } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

const QA = [
  {
    q: "Why should anyone care about this brand?",
    a: "Attention is easy to buy. Trust is difficult to earn. Relevance is even harder. So we start by finding the reason people should care — then we build everything else around it.",
    cta: "Explore branding",
  },
  {
    q: "What makes this brand different?",
    a: "Your brand is more than a logo. It's what people feel when they hear your name. We define the positioning and the identity that only you can own, so you're never mistaken for anyone else.",
    cta: "See our branding work",
  },
  {
    q: "Who are we talking to?",
    a: "Before any idea, we understand the business, the market and the audience: who they are, what they scroll past, and what actually moves them.",
    cta: "See how we work",
  },
  {
    q: "What will make people stop scrolling?",
    a: "Attention is won in the first three seconds. We create photography, films, reels and campaigns that earn that attention, and keep it.",
    cta: "Explore content",
  },
  {
    q: "How do we turn attention into business?",
    a: "Creativity without results is just art. We pair creative thinking with data-driven performance marketing and a website built to convert visitors into customers, then measure, learn and improve.",
    cta: "Explore performance",
  },
] as const;

const STEPS = [
  { n: "01", t: "Understand", d: "We understand the business, market and audience." },
  { n: "02", t: "Define", d: "We build the strategy and direction." },
  { n: "03", t: "Create", d: "We turn strategy into creative ideas." },
  { n: "04", t: "Execute", d: "We bring ideas to life." },
  { n: "05", t: "Optimize", d: "We analyze, learn and improve." },
];

export function Questions() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".qa-item", {
          y: 44,
          opacity: 0,
          duration: 1,
          stagger: 0.09,
          ease: "expo.out",
          scrollTrigger: { trigger: ".qa-list", start: "top 82%" },
        });
        gsap.from(".pr-line", {
          scaleX: 0,
          transformOrigin: "left center",
          ease: "none",
          scrollTrigger: { trigger: ".pr-steps", start: "top 80%", end: "bottom 60%", scrub: true },
        });
        gsap.from(".pr-step", {
          y: 40,
          opacity: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "expo.out",
          scrollTrigger: { trigger: ".pr-steps", start: "top 82%" },
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} data-nav="dark" aria-labelledby="q-title" className="relative z-10 bg-ink text-paper">
      <div className="px-[var(--pad)] pb-[clamp(4rem,8vw,7rem)] pt-[clamp(5rem,9vw,8rem)]">
        <div className="mono flex items-center justify-between text-paper/55">
          <span>[ 06 ] Our thinking</span>
          <span>
            Q <span className="text-lilac">0{open + 1}</span> / 0{QA.length}
          </span>
        </div>

        <div className="mt-10 grid gap-12 md:grid-cols-12 md:gap-8">
          {/* heading stays in view while you read */}
          <div className="md:col-span-5 md:self-start md:sticky md:top-28">
            <h2 id="q-title" className="display max-w-[11ch] text-[clamp(2.4rem,6vw,6.4rem)] leading-[0.96]">
              Everything starts with a <span className="serif-i text-[1.08em] text-lilac">question.</span>
            </h2>
            <p className="mt-6 max-w-xs text-[0.95rem] leading-relaxed text-paper/60">
              Five questions we ask before we make anything. Here&apos;s how we answer them.
            </p>
          </div>

          {/* Q&A */}
          <ul className="qa-list md:col-span-7">
            {QA.map((item, i) => {
              const isOpen = open === i;
              return (
                <li key={item.q} className="qa-item border-t border-paper/15 last:border-b">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`qa-a-${i}`}
                    id={`qa-q-${i}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    data-cursor={isOpen ? undefined : "Open"}
                    className="group grid w-full grid-cols-[2.4rem_1fr_auto] items-start gap-x-3 py-6 text-left md:grid-cols-[3.2rem_1fr_auto] md:py-7"
                  >
                    <span className={`mono pt-[0.7em] transition-colors duration-500 ${isOpen ? "text-lilac" : "text-paper/40 group-hover:text-paper/70"}`}>
                      Q{String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`serif-i text-[clamp(1.5rem,2.7vw,2.7rem)] leading-[1.08] transition-colors duration-500 ${
                        isOpen ? "text-paper" : "text-paper/55 group-hover:text-paper/85"
                      }`}
                    >
                      {item.q}
                    </span>
                    <span
                      aria-hidden
                      className={`relative mt-[0.6em] block h-5 w-5 shrink-0 transition-transform duration-500 ease-[var(--ease)] ${isOpen ? "rotate-45" : ""}`}
                    >
                      <span className={`absolute left-0 top-1/2 h-px w-full -translate-y-1/2 transition-colors duration-500 ${isOpen ? "bg-lilac" : "bg-paper/60"}`} />
                      <span className={`absolute left-1/2 top-0 h-full w-px -translate-x-1/2 transition-colors duration-500 ${isOpen ? "bg-lilac" : "bg-paper/60"}`} />
                    </span>
                  </button>

                  <div
                    id={`qa-a-${i}`}
                    role="region"
                    aria-labelledby={`qa-q-${i}`}
                    className={`grid transition-[grid-template-rows,opacity] duration-[800ms] ease-[var(--ease)] ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="grid grid-cols-[2.4rem_1fr] gap-x-3 pb-8 md:grid-cols-[3.2rem_1fr]">
                        <span className="mono pt-1 text-lilac">A</span>
                        <div>
                          <p className="max-w-[46ch] text-[1.02rem] leading-relaxed text-paper/75 md:text-[1.1rem]">{item.a}</p>
                          <Link href="/what-we-do" data-cursor="Go" className="mono u-link mt-5 inline-block text-paper">
                            {item.cta} →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Process */}
      <div className="px-[var(--pad)] pb-[clamp(5rem,10vw,9rem)] pt-[clamp(3rem,6vw,6rem)]">
        <div className="mono mb-8 flex items-center justify-between text-paper/55">
          <span>[ 07 ] Process</span>
          <span className="hidden sm:block">Five moves</span>
        </div>
        <h3 className="display max-w-[14ch] text-[clamp(2.2rem,5.6vw,6rem)] leading-[0.96]">
          From idea to <span className="serif-i text-[1.08em] text-lilac">impact.</span>
        </h3>

        <div className="pr-steps relative mt-16">
          <div className="pr-line absolute left-0 right-0 top-[0.4rem] hidden h-px bg-lilac lg:block" aria-hidden />
          <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
            {STEPS.map((s) => (
              <li key={s.n} className="pr-step relative lg:pt-10">
                <span className="absolute left-0 top-0 hidden h-3 w-3 rounded-full bg-lilac lg:block" aria-hidden />
                <p className="mono mb-3 text-lilac">{s.n}</p>
                <p className="display text-[clamp(1.7rem,2.4vw,2.6rem)]">{s.t}</p>
                <p className="mt-3 max-w-[24ch] text-[0.92rem] leading-relaxed text-paper/65">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
