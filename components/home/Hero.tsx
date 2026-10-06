"use client";

/**
 * Hero — simple and bold.
 * "We create what people" in big type, "remember." pushed to the right
 * underneath it, the short paragraph tucked in the empty space to its left, and
 * the call to action below. The page then slides over this hero (it is
 * position: sticky).
 */

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap } from "@/lib/gsap";
import { bindPointer } from "@/lib/pointer";
import { onReady } from "@/lib/ready";
import { Magnetic } from "@/components/ui/Magnetic";
import { Pill } from "@/components/ui/Pill";

// the floating light discs behind the headline (WebGL, loaded after the page is interactive)
const Bokeh = dynamic(() => import("./Bokeh").then((m) => m.Bokeh), { ssr: false });

const LINES = ["We create", "what people"] as const;

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    bindPointer();

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
          .from(".hero-fade", { opacity: 0, y: 18, duration: 1, ease: "power3.out", stagger: 0.08 }, 0.5);
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

    return () => {
      off();
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
          <p className="mono hero-fade flex items-center gap-3 text-paper/70">
            <span className="h-px w-8 bg-lilac" /> 360° creative marketing — Bhopal, India
          </p>

          {/* the headline, the paragraph and "remember." share one grid: the paragraph sits in the empty left
              space beside "remember." (below it on narrower screens) */}
          <div className="grid gap-x-10 gap-y-5 lg:grid-cols-[minmax(0,24rem)_1fr] lg:items-center">
            <h1 className="display contents text-[clamp(2.4rem,min(17.3vw,calc((100svh-26rem)/4.6)),6.5rem)] leading-[0.92] tracking-[-0.025em] md:text-[clamp(3rem,min(11vw,17svh),9rem)] lg:text-[clamp(3rem,min(6.7vw,17svh),11rem)]">
              {/* phones: one word per line (bigger type fills the screen); md: two lines; lg+: one line */}
              <span className="block lg:col-span-2 lg:flex lg:gap-x-[0.27em]">
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
              </span>

              {/* "remember." pushed to the right, always crisp */}
              <span className="mask-line -mt-[0.05em] block pb-[0.1em] text-right lg:col-start-2 lg:row-start-2">
                <span className="hero-line serif-i inline-block text-[1.12em] normal-case leading-[0.9] tracking-[-0.03em] text-lilac">
                  remember.
                </span>
              </span>
            </h1>

            <p className="hero-fade max-w-sm text-[0.95rem] leading-relaxed text-paper/70 lg:col-start-1 lg:row-start-2">
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
