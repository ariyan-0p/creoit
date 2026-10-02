"use client";

/**
 * Hero — "Out of focus until it matters."
 *
 * The headline sits soft behind a sharp copy that is revealed through a
 * lens following the pointer (idle / touch: the lens drifts on its own).
 * "remember." is always crisp — it's the one thing we want you to keep.
 * The page then slides over this hero (it is position: sticky).
 */

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap } from "@/lib/gsap";
import { bindPointer, pointer } from "@/lib/pointer";
import { onReady } from "@/lib/ready";
import { Magnetic } from "@/components/ui/Magnetic";
import { Pill } from "@/components/ui/Pill";

const Bokeh = dynamic(() => import("./Bokeh").then((m) => m.Bokeh), { ssr: false });

const LINES = ["We create", "what people"] as const;

function Lines() {
  return (
    <>
      {LINES.map((l) => (
        <span key={l} className="mask-line block">
          {/* phones: one word per line (bigger type fills the screen); md+: two lines */}
          <span className="hero-line block">
            {l.split(" ").map((w, i) => (
              <span key={w} className="block md:inline">
                {i > 0 && <span className="hidden md:inline"> </span>}
                {w}
              </span>
            ))}
          </span>
        </span>
      ))}
    </>
  );
}

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const sharp = useRef<HTMLSpanElement>(null);
  const soft = useRef<HTMLSpanElement>(null);
  const timecode = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    bindPointer();

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lens = { x: 0, y: 0, r: 0, tx: 0, ty: 0 };
    let on = false;

    // ---- entrance (waits for the preloader curtain) ----
    // Built inside a gsap.context so React's dev double-mount reverts cleanly.
    let off = () => {};
    const ctx = gsap.context(() => {
      const intro = gsap.timeline({ paused: true });
      intro
        .from(".hero-bg", { scale: 1.22, duration: 2.2, ease: "expo.out" }, 0)
        .from(".hero-line", { yPercent: 108, duration: 1.3, ease: "expo.out", stagger: 0.1 })
        .from(".hero-rem", { yPercent: 108, rotate: 3, duration: 1.4, ease: "expo.out" }, 0.25)
        .from(".hero-fade", { opacity: 0, y: 18, duration: 1, ease: "power3.out", stagger: 0.08 }, 0.5)
        .from(".hero-vf", { opacity: 0, scale: 1.04, duration: 1.4, ease: "expo.out" }, 0.2)
        .add(() => {
          on = true;
        }, 0.2)
        .to(lens, { r: 1, duration: 1.6, ease: "expo.out" }, 0.4);
      off = onReady(() => intro.play());

      // scroll: the page slides over the hero; hero recedes
      gsap.to(inner.current, {
        scale: 0.92,
        opacity: 0.25,
        yPercent: -6,
        ease: "none",
        scrollTrigger: { start: 0, end: () => window.innerHeight, scrub: true },
      });
    }, el);

    // ---- lens follows pointer; mask vars written straight to the DOM ----
    const rect = { w: 1, h: 1, left: 0, top: 0 };
    const measure = () => {
      const s = sharp.current;
      if (!s) return;
      const b = s.getBoundingClientRect();
      rect.w = b.width;
      rect.h = b.height;
      rect.left = b.left;
      rect.top = b.top;
    };

    const t0 = performance.now();
    const frame = () => {
      if (!on || window.scrollY > window.innerHeight * 1.1 || document.hidden) return;
      measure();
      const t = (performance.now() - t0) / 1000;
      const useReal = pointer.moved;
      // No pointer (touch / idle): sweep the lens back and forth across the headline itself.
      const px = useReal ? pointer.x : rect.left + rect.w * (0.5 + Math.sin(t * 0.7) * 0.5);
      const py = useReal ? pointer.y : rect.top + rect.h * (0.5 + Math.sin(t * 1.15 + 1) * 0.32);
      lens.tx = px - rect.left;
      lens.ty = py - rect.top;
      lens.x += (lens.tx - lens.x) * 0.14;
      lens.y += (lens.ty - lens.y) * 0.14;
      const R = Math.max(170, Math.min(window.innerWidth * 0.17, 280)) * lens.r;
      const m = reduce ? "100% 100%" : "";
      const s = sharp.current;
      if (s) {
        s.style.setProperty("--mx", `${lens.x}px`);
        s.style.setProperty("--my", `${lens.y}px`);
        s.style.setProperty("--r", reduce ? "4000px" : `${R}px`);
        if (m) s.style.setProperty("--r", "4000px");
      }
      if (timecode.current) {
        const f = Math.floor(t * 24);
        const sec = Math.floor(t) % 60;
        const min = Math.floor(t / 60) % 60;
        timecode.current.textContent = `00:${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}:${String(f % 24).padStart(2, "0")}`;
      }
    };
    gsap.ticker.add(frame);

    return () => {
      off();
      ctx.revert();
      gsap.ticker.remove(frame);
    };
  }, []);

  return (
    <section
      ref={root}
      data-nav="dark"
      aria-label="Introduction"
      className="sticky top-0 z-0 h-[100svh] min-h-[600px] w-full overflow-hidden bg-ink text-paper"
    >
      <div ref={inner} className="absolute inset-0 origin-center will-change-transform">
        <div className="hero-bg absolute inset-0 will-change-transform">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 55% at 78% 88%, rgba(106,61,255,0.42) 0%, rgba(106,61,255,0) 70%), radial-gradient(45% 45% at 12% 12%, rgba(20,0,33,0.9) 0%, rgba(20,0,33,0) 100%)",
          }}
        />
        <Bokeh className="absolute inset-0" />
        </div>

        {/* vignette keeps type legible over the discs */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 30% 55%, rgba(10,10,11,0) 0%, rgba(10,10,11,0.55) 70%, rgba(10,10,11,0.92) 100%)",
          }}
        />
        <div className="grain absolute inset-0 overflow-hidden" aria-hidden />

        {/* viewfinder frame */}
        <div className="hero-vf pointer-events-none absolute inset-x-[var(--pad)] bottom-[var(--pad)] top-[var(--vf-top)] text-paper/55" aria-hidden>
          <i className="vf vf-tl" />
          <i className="vf vf-tr" />
          <i className="vf vf-bl" />
          <i className="vf vf-br" />
          <span className="mono absolute left-4 top-3 hidden items-center gap-2 sm:flex">
            <i className="rec" /> Rec <span ref={timecode} className="tabular-nums">00:00:00:00</span>
          </span>
          <span className="mono absolute right-4 top-3 hidden sm:block">ISO 800 · f/1.4 · 24fps</span>
        </div>

        {/* content */}
        <div className="absolute inset-0 flex flex-col justify-end px-[var(--pad-in)] pb-[var(--pad-bottom)] pt-[clamp(7rem,15svh,9rem)]">
          <p className="mono hero-fade mb-[clamp(0.9rem,2.6svh,1.75rem)] flex items-center gap-3 text-paper/70">
            <span className="h-px w-8 bg-lilac" /> 360° creative marketing — Bhopal, India
          </p>

          <h1 className="display grid text-[clamp(2.6rem,min(10.6vw,15svh),12rem)] leading-[0.9] tracking-[-0.025em] max-md:text-[clamp(2.6rem,min(17.5vw,12.5svh),6.5rem)]">
            <span ref={soft} aria-hidden className="col-start-1 row-start-1 select-none text-paper/55 blur-[7px] [@media(hover:none)]:text-paper/80 [@media(hover:none)]:blur-[2.5px]">
              <Lines />
            </span>
            <span
              ref={sharp}
              className="col-start-1 row-start-1 text-paper"
              style={{
                WebkitMaskImage:
                  "radial-gradient(circle var(--r, 0px) at var(--mx, 50%) var(--my, 50%), #000 0%, #000 52%, transparent 100%)",
                maskImage:
                  "radial-gradient(circle var(--r, 0px) at var(--mx, 50%) var(--my, 50%), #000 0%, #000 52%, transparent 100%)",
              }}
            >
              <Lines />
            </span>
            {/* tucked tight under "what people", a touch larger (the serif has a smaller x-height): reads as ONE sentence */}
            <span className="mask-line col-start-1 row-start-2 -mt-[0.14em] block pb-[0.1em]">
              <span className="hero-rem serif-i block text-[1.12em] text-lilac normal-case tracking-[-0.03em] leading-[0.82]">
                remember.
              </span>
            </span>
          </h1>

          <div className="mt-[clamp(1.25rem,4svh,2.5rem)] flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <p className="hero-fade max-w-md text-[0.95rem] leading-relaxed text-paper/75">
              CREOIT is a collective of creative thinkers, strategists, marketers and makers — helping brands become
              impossible to ignore.
            </p>
            <div className="hero-fade flex flex-wrap items-center gap-3">
              <Magnetic>
                <Pill href="/contact" tone="signal" cursor="Talk">
                  Start a project
                </Pill>
              </Magnetic>
              <Pill href="/work" tone="light">
                See the work
              </Pill>
            </div>
          </div>
        </div>

        {/* bottom meta */}
        <div className="mono hero-fade absolute inset-x-[var(--pad-in)] bottom-[var(--pad)] flex items-center justify-between text-paper/55">
          <span className="hidden sm:block" />
          <span className="flex items-center gap-3">
            <span className="[@media(hover:none)]:hidden">Move to focus</span>
            <span className="hidden [@media(hover:none)]:inline">Watch it focus</span>
            <span className="inline-block h-px w-10 bg-paper/40" /> Scroll
          </span>
        </div>
      </div>
    </section>
  );
}
