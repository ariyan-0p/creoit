"use client";

/**
 * Preloader — a camera "arming" before the shot.
 * Counter 000→100, word flips from FORGETTABLE to UNFORGETTABLE, then the
 * curtain lifts. Plays once per session; skipped instantly on return visits.
 */

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { markReady } from "@/lib/ready";
import { useLenis } from "@/providers/SmoothScrollProvider";

export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const skip = document.documentElement.classList.contains("pl-done");
    if (skip) {
      // CSS (.pl-done) already hides it; just release the intro.
      markReady();
      return;
    }

    document.documentElement.style.overflow = "hidden";
    lenis?.stop();

    const counter = { v: 0 };
    const ctx = gsap.context(() => {
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        try {
          sessionStorage.setItem("creoit-pl", "1");
        } catch {}
        document.documentElement.style.overflow = "";
        lenis?.start();
        setGone(true);
      },
    });

    tl.from(".pl-in", { y: 24, opacity: 0, duration: 0.7, stagger: 0.08 }, 0.1)
      .to(
        counter,
        {
          v: 100,
          duration: 1.9,
          ease: "power2.inOut",
          onUpdate: () => {
            if (num.current) num.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
          },
        },
        0.2
      )
      .to(bar.current, { scaleX: 1, duration: 1.9, ease: "power2.inOut" }, 0.2)
      .to(word.current, { yPercent: -100, duration: 0.7, ease: "power4.inOut" }, 1.55)
      .to(".pl-out", { opacity: 0, y: -16, duration: 0.45, stagger: 0.04 }, 2.25)
      .to(
        el,
        {
          clipPath: "inset(0 0 100% 0)",
          duration: 1.05,
          ease: "expo.inOut",
          onStart: markReady,
        },
        2.45
      );
    }, el);

    return () => {
      ctx.revert();
      document.documentElement.style.overflow = "";
    };
    // lenis arrives after first render; we only need its stop/start, so re-running is unnecessary.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gone) return null;

  return (
    <div
      ref={root}
      id="preloader"
      aria-hidden="true"
      className="fixed inset-0 z-[200] flex flex-col justify-between bg-ink px-[var(--pad)] py-[var(--pad)] text-paper"
      style={{ clipPath: "inset(0 0 0% 0)" }}
    >
      <div className="mono pl-in pl-out flex items-center justify-between">
        <span>Creoit ®</span>
        <span className="flex items-center gap-2">
          <i className="rec" /> Rec
        </span>
      </div>

      <div className="relative">
        <div className="pl-out overflow-hidden">
          <div className="pl-in display flex items-end gap-4 text-[clamp(3rem,10vw,9rem)]">
            <span className="mask-line block h-[1em] overflow-hidden leading-[1]">
              <span ref={word} className="block">
                <span className="block text-paper/30 line-through decoration-signal decoration-[0.06em]">
                  Forgettable
                </span>
                <span className="block">
                  Un<span className="serif-i text-signal">forgettable</span>
                </span>
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="pl-out">
        <div className="pl-in mono mb-3 flex items-end justify-between">
          <span>Developing the first frame</span>
          <span className="display text-[clamp(2rem,6vw,4.5rem)] leading-none tabular-nums">
            <span ref={num}>000</span>
          </span>
        </div>
        <div className="h-px w-full bg-paper/20">
          <div ref={bar} className="h-full origin-left scale-x-0 bg-signal" />
        </div>
      </div>
    </div>
  );
}
