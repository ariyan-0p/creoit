"use client";

/**
 * Preloader — "creoit." rises on white; the dot of the i is a ticker that
 * flips through our social icons, then settles into a purple dot. A purple
 * curtain and the white sheet then lift away in sequence.
 *
 * Plays on every full page load (client-side navigation keeps the shell
 * mounted, so it doesn't replay). Reduced motion: a quick fade instead.
 */

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { markReady } from "@/lib/ready";
import { useLenis } from "@/providers/SmoothScrollProvider";

const ICONS = [
  { src: "/images/instagram.png", alt: "Instagram" },
  { src: "/images/facebook.png", alt: "Facebook" },
  { src: "/images/twitter.png", alt: "X" },
  { src: "/images/youtube%20(1).png", alt: "YouTube" },
  { src: "/images/linkedin%20(1).png", alt: "LinkedIn" },
];

const WORD: { ch: string; cls: string }[] = [
  { ch: "c", cls: "pl-serif" },
  { ch: "r", cls: "pl-serif" },
  { ch: "e", cls: "pl-serif" },
  { ch: "o", cls: "pl-serif" },
  { ch: "ı", cls: "pl-sans pl-i" },
  { ch: "t", cls: "pl-sans" },
  { ch: ".", cls: "pl-sans pl-dot" },
];

export function Preloader() {
  const sheet = useRef<HTMLDivElement>(null);
  const curtain = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const tile = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const el = sheet.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.style.overflow = "hidden";
    lenis?.stop();

    const finish = () => {
      document.documentElement.style.overflow = "";
      lenis?.start();
      setGone(true);
    };

    if (reduce) {
      markReady();
      const t = gsap.to([el, curtain.current], { opacity: 0, duration: 0.5, delay: 0.3, onComplete: finish });
      return () => {
        t.kill();
        document.documentElement.style.overflow = "";
      };
    }

    const counter = { v: 0 };
    const ctx = gsap.context(() => {
      const icons = gsap.utils.toArray<HTMLElement>(".pl-icon");
      gsap.set(icons, { yPercent: -100 });
      gsap.set(icons[0], { yPercent: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, onComplete: finish });

      // chrome
      tl.fromTo(".pl-chrome", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.06 }, 0.1);

      // wordmark rises letter by letter
      tl.to(".pl-ch", { y: 0, duration: 1.5, ease: "expo.out", stagger: 0.09 }, 0.25);

      // progress
      tl.to(
        counter,
        {
          v: 100,
          duration: 3.1,
          ease: "power2.inOut",
          onUpdate: () => {
            if (num.current) num.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
          },
        },
        0.2
      ).to(bar.current, { scaleX: 1, duration: 3.1, ease: "power2.inOut" }, 0.2);

      // ticker tile pops in as the i's dot, flips fast through the icons
      tl.fromTo(tile.current, { scale: 0, opacity: 0, yPercent: -25 }, { scale: 1, opacity: 1, yPercent: -25, duration: 0.6, ease: "back.out(2)" }, 1.15);
      const FLIP = 0.2;
      const flips = 9;
      for (let k = 0; k < flips; k++) {
        const cur = icons[k % icons.length];
        const next = icons[(k + 1) % icons.length];
        const at = 1.75 + k * FLIP;
        tl.to(cur, { yPercent: 100, duration: FLIP * 0.8, ease: "power2.in" }, at).fromTo(
          next,
          { yPercent: -100 },
          { yPercent: 0, duration: FLIP * 0.8, ease: "power2.out" },
          at + FLIP * 0.2
        );
      }
      const settle = 1.75 + flips * FLIP + 0.1;
      // the last icon drops out and the tile settles into a square purple dot, like the period
      tl.to(icons, { opacity: 0, duration: 0.2, ease: "none" }, settle).to(
        tile.current,
        { scale: 0.52, yPercent: 0, duration: 0.7, ease: "elastic.out(1, 0.5)" },
        settle + 0.05
      );

      // exit: purple curtain lifts, then the white sheet
      const exitAt = settle + 0.95;
      tl.to(".pl-chrome, .pl-wordwrap", { opacity: 0, duration: 0.4 }, exitAt - 0.1)
        .add(markReady, exitAt + 0.15)
        .to(curtain.current, { yPercent: -100, duration: 1.1, ease: "expo.inOut" }, exitAt)
        .to(el, { yPercent: -100, duration: 1.1, ease: "expo.inOut" }, exitAt + 0.12);
    }, el);

    return () => {
      ctx.revert();
      document.documentElement.style.overflow = "";
    };
    // lenis arrives after first render; only stop/start is needed from it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gone) return null;

  return (
    <div id="preloader" aria-hidden="true" className="fixed inset-0 z-[200]">
      <style>{`
        .pl-ch{display:inline-block;transform:translateY(118%)}
        .pl-serif{font-family:var(--font-moniqa),Georgia,serif;font-style:italic;font-weight:700}
        .pl-sans{font-family:var(--font-clash),'Helvetica Neue',sans-serif;font-weight:600}
        .pl-dot{color:var(--color-signal)}
        .pl-chrome{opacity:0}
      `}</style>

      {/* purple curtain sits behind the white sheet and trails it on exit */}
      <div ref={curtain} className="absolute inset-0 bg-signal" />

      <div ref={sheet} className="absolute inset-0 flex flex-col justify-between bg-paper px-[var(--pad)] py-[var(--pad)] text-ink">
        <div className="mono pl-chrome flex items-center justify-between">
          <span>Creoit ®</span>
          <span className="hidden sm:block">Believe it into existence</span>
          <span className="tabular-nums">
            <span ref={num}>000</span>%
          </span>
        </div>

        <div className="pl-wordwrap grid place-items-center">
          <div className="relative flex items-baseline leading-[1] tracking-[-0.03em]" style={{ fontSize: "min(34vw, 28rem)" }}>
            {WORD.map((w, i) => {
              const isI = w.cls.includes("pl-i");
              return (
                <span key={i} className="relative inline-block">
                  <span className="mask-line -mx-[0.04em] block px-[0.04em]">
                    <span className={`pl-ch ${w.cls}`}>{w.ch}</span>
                  </span>
                  {isI && (
                    /* the ticker: sits where the dot of the i would be */
                    <div
                      ref={tile}
                      className="absolute left-1/2 top-[0.03em] aspect-square w-[0.3em] -translate-x-1/2 overflow-hidden rounded-[0.07em] bg-signal opacity-0"
                    >
                      {ICONS.map((ic) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={ic.alt}
                          src={ic.src}
                          alt=""
                          className="pl-icon absolute inset-0 m-auto h-[58%] w-[58%] object-contain"
                          style={{ filter: "brightness(0) invert(1)" }}
                        />
                      ))}
                    </div>
                  )}
                </span>
              );
            })}
          </div>
        </div>

        <div className="pl-chrome">
          <div className="h-px w-full bg-ink/15">
            <div ref={bar} className="h-full origin-left scale-x-0 bg-signal" />
          </div>
        </div>
      </div>
    </div>
  );
}
