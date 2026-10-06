"use client";

/**
 * Hero — simple, bold and centred, out of focus until it matters.
 * "We create" / "what people" / "remember." stacked in the middle: the first two
 * lines sit soft until a lens following the pointer (idle / touch: it drifts on
 * its own) brings them into focus; "remember." is always crisp. Then the short
 * paragraph and the call to action. The page slides over this hero (sticky).
 */

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap } from "@/lib/gsap";
import { bindPointer, pointer } from "@/lib/pointer";
import { onReady } from "@/lib/ready";
import { Magnetic } from "@/components/ui/Magnetic";
import { Pill } from "@/components/ui/Pill";

// the floating light discs behind the headline (WebGL, loaded after the page is interactive)
const Bokeh = dynamic(() => import("./Bokeh").then((m) => m.Bokeh), { ssr: false });

const LINES = ["We create", "what people"] as const;

/** the first headline line, as mask-lines (phones: one word per line; md: two lines; lg+: one line) */
function Line1() {
  return (
    <>
      {LINES.map((l) => (
        <span key={l} className="mask-line block">
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

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    bindPointer();

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lens = { x: 0, y: 0, r: 0, tx: 0, ty: 0 };
    let on = false;

    // The entrance waits for the preloader. Built inside a gsap.context so
    // React's dev double-mount reverts cleanly.
    let off = () => {};
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const intro = gsap.timeline({ paused: true });
        intro
          .from(".hero-bg", { scale: 1.22, duration: 2.2, ease: "expo.out" }, 0)
          .from(".hero-line", { yPercent: 108, duration: 1.3, ease: "expo.out", stagger: 0.1 }, 0.1)
          .from(".hero-fade", { opacity: 0, y: 18, duration: 1, ease: "power3.out", stagger: 0.08 }, 0.5)
          .add(() => {
            on = true;
          }, 0.2)
          .to(lens, { r: 1, duration: 1.6, ease: "expo.out" }, 0.4);
        off = onReady(() => intro.play());
      });

      // scroll: the page slides over the hero; hero recedes
      gsap.to(inner.current, {
        scale: 0.92,
        opacity: 0.25,
        yPercent: -6,
        ease: "none",
        scrollTrigger: { start: 0, end: () => window.innerHeight, scrub: true },
      });
    }, el);

    // ---- the lens follows the pointer; mask vars are written straight to the DOM ----
    const rect = { w: 1, h: 1, left: 0, top: 0 };
    const measure = () => {
      const sEl = sharp.current;
      if (!sEl) return;
      const b = sEl.getBoundingClientRect();
      rect.w = b.width;
      rect.h = b.height;
      rect.left = b.left;
      rect.top = b.top;
    };
    // measure only when layout can have changed (scroll moves/scales the hero, resize reflows it)
    let dirty = true;
    const markDirty = () => (dirty = true);
    window.addEventListener("scroll", markDirty, { passive: true });
    window.addEventListener("resize", markDirty);

    const t0 = performance.now();
    const frame = () => {
      if (!on || window.scrollY > window.innerHeight * 1.1 || document.hidden) return;
      if (dirty) {
        measure();
        dirty = false;
      }
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
      const sEl = sharp.current;
      if (sEl) {
        sEl.style.setProperty("--mx", `${lens.x}px`);
        sEl.style.setProperty("--my", `${lens.y}px`);
        sEl.style.setProperty("--r", `${R}px`);
      }
    };
    if (reduce) {
      // reduced motion: no lens, the sharp headline is simply fully visible
      sharp.current?.style.setProperty("--r", "4000px");
    } else {
      gsap.ticker.add(frame);
    }

    return () => {
      off();
      window.removeEventListener("scroll", markDirty);
      window.removeEventListener("resize", markDirty);
      gsap.ticker.remove(frame);
      ctx.revert();
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
                "radial-gradient(60% 55% at 78% 88%, rgba(106,61,255,0.42) 0%, rgba(106,61,255,0) 70%), radial-gradient(50% 50% at 14% 14%, rgba(20,0,33,0.9) 0%, rgba(20,0,33,0) 100%)",
            }}
          />
          <Bokeh className="absolute inset-0" />
        </div>

        <div className="absolute inset-0 flex flex-col justify-between gap-6 px-[var(--pad-in)] pb-[3rem] pt-[6.5rem] lg:justify-center lg:gap-12 lg:pb-[var(--pad-bottom)] lg:pt-[7rem]">
          <p className="mono hero-fade flex items-center justify-center gap-3 text-center text-paper/70">
            <span className="h-px w-8 bg-lilac" /> 360° creative marketing — Bhopal, India
          </p>

          {/* everything centred: two soft lines, "remember." below, then the paragraph */}
          <div className="flex flex-col items-center gap-5 text-center lg:gap-7">
            <h1 className="display w-full text-[clamp(2.4rem,min(17.3vw,calc((100svh-26rem)/4.6)),6.5rem)] leading-[0.92] tracking-[-0.025em] md:text-[clamp(3rem,min(11vw,17svh),9rem)] lg:text-[clamp(3rem,min(9vw,calc((100svh-26rem)/2.9)),11rem)]">
              {/* a soft copy underneath and a sharp copy revealed through the lens on top */}
              <span className="grid">
                <span aria-hidden className="col-start-1 row-start-1 block select-none text-paper/55 blur-[7px] will-change-transform [@media(hover:none)]:text-paper/80 [@media(hover:none)]:blur-[2.5px]">
                  <Line1 />
                </span>
                <span
                  ref={sharp}
                  className="col-start-1 row-start-1 block text-paper will-change-transform"
                  style={{
                    WebkitMaskImage:
                      "radial-gradient(circle var(--r, 0px) at var(--mx, 50%) var(--my, 50%), #000 0%, #000 52%, transparent 100%)",
                    maskImage:
                      "radial-gradient(circle var(--r, 0px) at var(--mx, 50%) var(--my, 50%), #000 0%, #000 52%, transparent 100%)",
                  }}
                >
                  <Line1 />
                </span>
              </span>

              {/* "remember." centred below, always crisp */}
              <span className="mask-line -mt-[0.05em] block pb-[0.1em]">
                <span className="hero-line serif-i inline-block text-[1.12em] normal-case leading-[0.9] tracking-[-0.03em] text-lilac">
                  remember.
                </span>
              </span>
            </h1>

            <p className="hero-fade max-w-md text-[0.95rem] leading-relaxed text-paper/70">
              CREOIT is a collective of creative thinkers, strategists, marketers and makers — helping brands become
              impossible to ignore.
            </p>
          </div>

          <div className="hero-fade flex flex-wrap items-center justify-center gap-3">
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
    </section>
  );
}
