"use client";

/**
 * Manifesto — the premise, read word by word.
 * Each word is "out of focus" (faint + soft) until scroll brings it in.
 * Under it, three beats show how hard each thing is to win.
 */

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";

const BEATS = [
  { label: "Attention", line: "is easy to buy.", effort: 0.28 },
  { label: "Trust", line: "is difficult to earn.", effort: 0.66 },
  { label: "Relevance", line: "is even harder.", effort: 1 },
] as const;

export function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(".mf-text", { type: "words", wordsClass: "mf-word" });
        // Same look as tweening every word's opacity + blur, but only the few words
        // that are mid-transition are touched, blur moves in 0.5px steps, and a fully
        // sharp word drops its filter altogether — far less repainting per scroll frame.
        const words = split.words as HTMLElement[];
        const each = 0.12;
        const dur = 0.5;
        const total = (words.length - 1) * each + dur;
        const last = new Array<string>(words.length).fill("");
        const paint = (p: number) => {
          const t = p * total;
          for (let i = 0; i < words.length; i++) {
            const w = Math.min(1, Math.max(0, (t - i * each) / dur));
            const b = Math.round((1 - w) * 6 * 2) / 2;
            const key = `${b}|${w === 0 || w === 1 ? w : w.toFixed(2)}`;
            if (key === last[i]) continue;
            last[i] = key;
            words[i].style.opacity = String(0.12 + 0.88 * w);
            words[i].style.filter = b === 0 ? "none" : `blur(${b}px)`;
          }
        };
        paint(0);
        const prog = { p: 0 };
        gsap.to(prog, {
          p: 1,
          ease: "none",
          onUpdate: () => paint(prog.p),
          scrollTrigger: {
            trigger: ".mf-text",
            start: "top 78%",
            end: "bottom 42%",
            scrub: 0.6,
          },
        });

        gsap.from(".mf-beat", {
          y: 40,
          opacity: 0,
          duration: 1,
          stagger: 0.12,
          ease: "expo.out",
          scrollTrigger: { trigger: ".mf-beats", start: "top 82%" },
        });
        gsap.utils.toArray<HTMLElement>(".mf-bar").forEach((bar) => {
          gsap.fromTo(
            bar,
            { scaleX: 0 },
            {
              scaleX: Number(bar.dataset.effort),
              duration: 1.6,
              ease: "expo.out",
              scrollTrigger: { trigger: bar, start: "top 88%" },
            }
          );
        });
        gsap.from(".mf-close", {
          y: 24,
          opacity: 0,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: ".mf-close", start: "top 92%" },
        });
        return () => split.revert();
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      data-nav="light"
      aria-labelledby="manifesto-title"
      className="relative z-10 rounded-t-[1.75rem] bg-paper px-[var(--pad)] pb-[clamp(5rem,12vw,11rem)] pt-[clamp(5rem,11vw,10rem)] text-ink"
    >
      <div className="mono mb-12 flex items-center justify-between text-ink/55 md:mb-20">
        <span>[ 01 ] The premise</span>
        <span className="hidden sm:block">Why we exist</span>
      </div>

      <h2
        id="manifesto-title"
        className="display mf-text max-w-[19ch] text-[clamp(2.4rem,7.4vw,8.4rem)] leading-[0.98] md:max-w-[17ch] [&_.serif-i]:text-[1.08em]"
      >
        We don&apos;t just market brands. We build their <span className="serif-i text-signal">presence.</span>
      </h2>

      <div className="mf-beats mt-[clamp(4rem,9vw,9rem)] grid gap-10 border-t border-ink/15 pt-10 md:grid-cols-3 md:gap-8">
        {BEATS.map((b, i) => (
          <div key={b.label} className="mf-beat">
            <p className="mono mb-5 flex items-center justify-between text-ink/55">
              <span>0{i + 1}</span>
              <span>Effort to win</span>
            </p>
            <p className="display text-[clamp(2rem,3.4vw,3.4rem)] leading-none">{b.label}</p>
            <p className="serif-i mt-2 text-[clamp(1.4rem,2.2vw,2.1rem)] text-ink/70">{b.line}</p>
            <div className="mt-6 h-[3px] w-full bg-ink/10">
              <div data-effort={b.effort} className="mf-bar h-full origin-left bg-signal" />
            </div>
          </div>
        ))}
      </div>

      <p className="mf-close display mt-[clamp(3rem,6vw,6rem)] text-[clamp(1.5rem,2.6vw,2.6rem)] leading-tight">
        We help brands build all three<span className="text-signal">.</span>
      </p>
    </section>
  );
}
