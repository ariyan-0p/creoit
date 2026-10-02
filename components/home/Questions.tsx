"use client";

/**
 * Questions — "Everything starts with a question."
 * Pinned. Scroll slides a column of questions past a fixed focal line;
 * the nearest one is sharp, the rest drop into soft focus. Then the
 * five-step process draws itself.
 */

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

const QUESTIONS = [
  "Why should anyone care about this brand?",
  "What makes this brand different?",
  "Who are we talking to?",
  "What will make people stop scrolling?",
  "How do we turn attention into business?",
];

const STEPS = [
  { n: "01", t: "Understand", d: "We understand the business, market and audience." },
  { n: "02", t: "Define", d: "We build the strategy and direction." },
  { n: "03", t: "Create", d: "We turn strategy into creative ideas." },
  { n: "04", t: "Execute", d: "We bring ideas to life." },
  { n: "05", t: "Optimize", d: "We analyze, learn and improve." },
];

export function Questions() {
  const root = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const items = gsap.utils.toArray<HTMLElement>(".q-item");
        const list = root.current!.querySelector<HTMLElement>(".q-list")!;
        const n = items.length;

        const apply = (p: number) => {
          const idx = p * (n - 1);
          const step = items[1].offsetTop - items[0].offsetTop;
          list.style.transform = `translate3d(0, ${-(idx * step)}px, 0)`;
          items.forEach((el, i) => {
            const d = Math.abs(i - idx);
            el.style.opacity = String(Math.max(0.1, 1 - d * 0.75));
            el.style.filter = d < 0.05 ? "none" : `blur(${Math.min(d * 5, 11).toFixed(1)}px)`;
          });
          if (counter.current) counter.current.textContent = `0${Math.round(idx) + 1}`;
        };
        apply(0);

        gsap.timeline({
          scrollTrigger: {
            trigger: pinRef.current,
            start: "top top",
            end: () => `+=${window.innerHeight * 2.4}`,
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => apply(self.progress),
            onRefresh: (self) => apply(self.progress),
          },
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
      <div ref={pinRef} className="relative flex h-[100svh] min-h-[620px] flex-col overflow-hidden px-[var(--pad)] pb-[var(--pad)] pt-24">
        <div className="mono flex items-center justify-between text-paper/55">
          <span>[ 06 ] Our thinking</span>
          <span>
            Q <span ref={counter} className="text-lilac">01</span> / 05
          </span>
        </div>

        <h2 id="q-title" className="display mt-8 max-w-[11ch] text-[clamp(2.2rem,5.6vw,6rem)] leading-[0.96]">
          Everything starts with a <span className="serif-i text-lilac text-[1.08em]">question.</span>
        </h2>

        <div className="pointer-events-none absolute inset-x-[var(--pad)] bottom-[var(--pad)] top-[42%] md:left-[34%] md:top-24">
          <div className="relative h-full overflow-visible">
            <div className="absolute inset-x-0 top-[44%] h-px bg-paper/20" aria-hidden />
            <ul className="q-list absolute inset-x-0 top-[44%] will-change-transform" style={{ transform: "translate3d(0,0,0)" }}>
              {QUESTIONS.map((q) => (
                <li key={q} className="q-item py-[0.35em]" style={{ willChange: "opacity, filter" }}>
                  <p className="serif-i -translate-y-[0.55em] text-[clamp(1.9rem,4.7vw,5.4rem)] leading-[1.02]">{q}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Process */}
      <div className="px-[var(--pad)] pb-[clamp(5rem,10vw,9rem)] pt-[clamp(4rem,8vw,8rem)]">
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
