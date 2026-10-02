"use client";

/**
 * Questions — "Everything starts with a question."
 *
 * A real Q&A: five questions we ask before we make anything, each with its
 * answer. On desktop the section pins and scroll walks through the questions —
 * each one comes into focus (the others go soft, like the hero lens) and its
 * answer rises in line by line. Click any question to jump to it. On phones
 * (and with reduced motion) it's a plain tap-to-open accordion.
 * Answers are drawn from our own service and process copy.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { useLenis } from "@/providers/SmoothScrollProvider";

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
  const pinRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const [open, setOpen] = useState(0);
  const lenis = useLenis();

  // Pin + scroll-driven Q&A (desktop, motion allowed) and the other scroll reveals.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const section = root.current!;
        section.dataset.pinned = "1";
        let last = 0;
        const st = ScrollTrigger.create({
          trigger: pinRef.current,
          start: "top top",
          end: () => `+=${window.innerHeight * 0.62 * QA.length}`,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress.toFixed(3)})`;
            const idx = Math.min(QA.length - 1, Math.floor(self.progress * QA.length));
            if (idx !== last) {
              last = idx;
              setOpen(idx);
            }
          },
        });
        stRef.current = st;
        return () => {
          delete section.dataset.pinned;
          stRef.current = null;
        };
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".qa-item", {
          y: 44,
          opacity: 0,
          duration: 1,
          stagger: 0.09,
          ease: "expo.out",
          scrollTrigger: { trigger: ".qa-list", start: "top 85%" },
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

  // Each time a question opens, its answer rises in line by line.
  useEffect(() => {
    if (open < 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const p = root.current?.querySelector<HTMLElement>(`#qa-a-${open} .qa-text`);
    if (!p) return;
    const split = SplitText.create(p, { type: "lines", mask: "lines", linesClass: "qa-line" });
    const tween = gsap.from(split.lines, {
      yPercent: 110,
      duration: 0.9,
      stagger: 0.08,
      delay: 0.12,
      ease: "expo.out",
      onComplete: () => split.revert(),
    });
    return () => {
      tween.kill();
      split.revert();
    };
  }, [open]);

  const choose = (i: number) => {
    const st = stRef.current;
    if (root.current?.dataset.pinned === "1" && st) {
      // pinned: scroll to that question's slice of the pin so scroll and state stay in sync
      const y = st.start + ((i + 0.5) / QA.length) * (st.end - st.start);
      if (lenis) lenis.scrollTo(y, { duration: 1.3 });
      else window.scrollTo({ top: y, behavior: "smooth" });
      setOpen(i);
    } else {
      setOpen((cur) => (cur === i ? -1 : i));
    }
  };

  return (
    <section ref={root} data-nav="dark" aria-labelledby="q-title" className="group relative z-10 bg-ink text-paper">
      <div
        ref={pinRef}
        className="relative px-[var(--pad)] pb-[clamp(4rem,8vw,7rem)] pt-[clamp(5rem,9vw,8rem)] md:flex md:h-[100svh] md:min-h-[680px] md:flex-col md:justify-center md:py-24"
      >
        <div className="mono flex items-center justify-between text-paper/55 md:absolute md:inset-x-[var(--pad)] md:top-24">
          <span>[ 07 ] Our thinking</span>
          <span>
            Q <span className="text-lilac">0{Math.max(open, 0) + 1}</span> / 0{QA.length}
          </span>
        </div>

        <div className="mt-10 grid gap-12 md:mt-0 md:grid-cols-12 md:gap-8">
          {/* heading + big counter */}
          <div className="relative md:col-span-5 md:self-center">
            <h2 id="q-title" className="display max-w-[11ch] text-[clamp(2.4rem,5.4vw,5.8rem)] leading-[0.96]">
              Everything starts with a <span className="serif-i text-[1.08em] text-lilac">question.</span>
            </h2>
            <p className="mt-6 max-w-xs text-[0.95rem] leading-relaxed text-paper/60">
              Five questions we ask before we make anything. Here&apos;s how we answer them.
            </p>

            <div className="mt-8 hidden items-end gap-4 md:flex" aria-hidden>
              <span key={open} className="rise display text-[clamp(4.5rem,9vw,9.5rem)] leading-[0.8] text-lilac/30">
                0{Math.max(open, 0) + 1}
              </span>
              <span className="mono mb-2 text-paper/40">/ 0{QA.length}</span>
            </div>
            <span className="relative mt-6 hidden h-px w-full max-w-xs bg-paper/15 md:block" aria-hidden>
              <span ref={barRef} className="absolute inset-0 origin-left scale-x-0 bg-lilac" />
            </span>
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
                    onClick={() => choose(i)}
                    data-cursor={isOpen ? undefined : "Open"}
                    className="group/q grid w-full grid-cols-[2.4rem_1fr_auto] items-start gap-x-3 py-5 text-left md:grid-cols-[3.2rem_1fr_auto] md:py-4"
                  >
                    <span className={`mono pt-[0.7em] transition-colors duration-500 ${isOpen ? "text-lilac" : "text-paper/40 group-hover/q:text-paper/70"}`}>
                      Q{String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`serif-i text-[clamp(1.45rem,2.4vw,2.5rem)] leading-[1.08] transition-[color,filter,transform] duration-[600ms] ease-[var(--ease)] ${
                        isOpen
                          ? "translate-x-0 text-paper"
                          : "text-paper/55 group-hover/q:text-paper/90 group-data-[pinned=1]:blur-[2.4px] group-data-[pinned=1]:group-hover/q:blur-0"
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
                      <div className="grid grid-cols-[2.4rem_1fr] gap-x-3 pb-6 md:grid-cols-[3.2rem_1fr]">
                        <span className="mono pt-1 text-lilac">A</span>
                        <div>
                          <p className="qa-text max-w-[46ch] text-[1.02rem] leading-relaxed text-paper/75 md:text-[1.08rem]">{item.a}</p>
                          <Link href="/what-we-do" data-cursor="Go" className="mono u-link mt-4 inline-block text-paper">
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
          <span>[ 08 ] Process</span>
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
