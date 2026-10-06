"use client";

/**
 * Globe — "Rooted in Bhopal. Open to the world."
 * A light, clean globe dead centre with the headline split around it ("Rooted
 * in Bhopal." left, "Open to the world." right; stacked above it on narrower
 * screens). Drag to spin; click to drop a purple pin that becomes a brief:
 * "Brief us from here". One permanent marker: our studio. No pinning, no extra scroll.
 */

import { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { Clock } from "@/components/shell/Clock";
import { Pill } from "@/components/ui/Pill";
import type { Pin } from "./GlobeCanvas";

const GlobeCanvas = dynamic(() => import("./GlobeCanvas").then((m) => m.GlobeCanvas), {
  ssr: false,
  loading: () => null,
});

const fmt = (v: number, pos: string, neg: string) => `${Math.abs(v).toFixed(2)}° ${v >= 0 ? pos : neg}`;

const HQ = { lat: 23.2599, lon: 77.4126 };

export function Globe() {
  const root = useRef<HTMLElement>(null);
  const hqRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [pin, setPin] = useState<Pin | null>(null);
  const [reset, setReset] = useState(0);

  const onPin = useCallback((p: Pin | null) => setPin(p), []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".gl-stage", {
          scale: 0.82,
          opacity: 0,
          duration: 1.6,
          ease: "expo.out",
          scrollTrigger: { trigger: ".gl-stage", start: "top 85%" },
        });
        gsap.from(".gl-in", {
          y: 40,
          opacity: 0,
          duration: 1,
          stagger: 0.08,
          ease: "expo.out",
          scrollTrigger: { trigger: root.current, start: "top 65%" },
        });
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      data-nav="light"
      aria-labelledby="globe-title"
      className="relative z-10 flex flex-col overflow-hidden bg-paper px-[var(--pad)] pb-[var(--pad)] pt-[clamp(4.5rem,8vw,5.5rem)] text-ink md:min-h-[100svh]"
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "radial-gradient(42% 58% at 50% 50%, rgba(106,61,255,0.12) 0%, rgba(106,61,255,0) 72%)" }}
      />

      <div className="relative z-10 flex items-start justify-between">
        <p className="mono gl-in text-ink/55">[ 05 ] Where we are</p>
        <p className="mono gl-in hidden text-right text-ink/55 sm:block">
          Local time <span className="text-ink"><Clock seconds /></span>
          <br />
          Time zone <span className="text-ink">GMT+5:30</span>
        </p>
      </div>

      {/* headline halves flank the globe (stacked above it on narrower screens) */}
      <div className="relative z-10 mt-6 grid flex-1 content-center items-center gap-y-3 [--gs:min(80vw,52svh)] md:mt-0 md:[--gs:min(60vw,max(14rem,calc(100svh-20rem)))] xl:grid-cols-[1fr_var(--gs)_1fr] xl:[--gs:min(50vw,max(16rem,calc(100svh-16rem)))]">
        <h2 id="globe-title" className="contents">
          <span className="gl-in display order-1 block text-center text-[clamp(2.2rem,8.4vw,4.4rem)] leading-[0.95] xl:text-right xl:text-[clamp(2.4rem,4.2vw,6rem)]">
            Rooted in <br className="hidden xl:block" />
            Bhopal.
          </span>
          <span className="gl-in display order-2 block text-center text-[clamp(2.2rem,8.4vw,4.4rem)] leading-[0.95] xl:order-3 xl:text-left xl:text-[clamp(2.4rem,4.2vw,6rem)]">
            Open to <br className="hidden xl:block" />
            <span className="serif-i text-[1.08em] normal-case text-signal">the world.</span>
          </span>
        </h2>

        {/* globe stage: outer = layout, .gl-stage = GSAP entrance, so the two never fight */}
        <div className="relative order-3 mx-auto aspect-square w-[var(--gs)] xl:order-2">
          <div className="gl-stage absolute inset-0">
            <GlobeCanvas onPin={onPin} hqRef={hqRef} pinRef={pinRef} resetSignal={reset} />

            {/* studio marker */}
            <div ref={hqRef} className="group pointer-events-none absolute left-0 top-0 opacity-0" aria-hidden>
              <span className="absolute -left-[5px] -top-[5px] block h-[10px] w-[10px] rounded-full bg-signal shadow-[0_0_0_4px_rgba(106,61,255,0.2)]" />
              <span className="mono absolute left-3 top-[-0.55rem] whitespace-nowrap group-data-[flip=1]:left-auto group-data-[flip=1]:right-3 rounded-sm bg-ink px-2 py-1 text-paper">
                CREOIT — Bhopal
              </span>
            </div>

            {/* the pin you drop */}
            <div ref={pinRef} className="pointer-events-none absolute left-0 top-0 opacity-0" aria-hidden>
              <span className="absolute -left-[6px] -top-[6px] block h-3 w-3 animate-ping rounded-full bg-signal/50" />
              <span className="absolute -left-[6px] -top-[6px] block h-3 w-3 rounded-full bg-signal" />
            </div>
          </div>
        </div>
      </div>

      {/* readout */}
      <div className="relative z-10 mt-6 flex flex-col gap-5 md:mt-4 md:flex-row md:items-end md:justify-between">
        <div className="gl-in mono min-h-[3.5rem] text-ink/60" aria-live="polite">
          {pin ? (
            <>
              <p className="text-ink">
                Pin dropped — {fmt(pin.lat, "N", "S")}, {fmt(pin.lon, "E", "W")}
              </p>
              <p className="mt-1">Wherever you are, we&apos;ll meet you there.</p>
            </>
          ) : (
            <>
              <p className="text-ink">Drag to spin. Click to drop a pin.</p>
              <p className="mt-1">Studio: {fmt(HQ.lat, "N", "S")}, {fmt(HQ.lon, "E", "W")}</p>
            </>
          )}
        </div>
        <div className="gl-in flex flex-wrap gap-3">
          {pin && (
            <Pill href="/contact" tone="signal" cursor="Talk">
              Brief us from here
            </Pill>
          )}
          <button
            type="button"
            onClick={() => setReset((n) => n + 1)}
            className="mono rounded-full border border-ink/40 px-6 py-4 transition-colors duration-500 hover:bg-ink hover:text-paper"
          >
            Back to Bhopal
          </button>
        </div>
      </div>
    </section>
  );
}
