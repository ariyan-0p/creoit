"use client";

/**
 * Globe — "Rooted in Bhopal. Open to the world."
 * A draggable globe with one permanent pin (our studio) and a pin you can
 * drop anywhere. The dropped pin becomes a brief: "Brief us from here".
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
      data-nav="dark"
      aria-labelledby="globe-title"
      className="relative z-10 min-h-[100svh] overflow-hidden bg-ink px-[var(--pad)] py-[clamp(5rem,9vw,8rem)] text-paper"
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "radial-gradient(50% 60% at 62% 55%, rgba(106,61,255,0.28) 0%, rgba(106,61,255,0) 70%)" }}
      />

      <div className="relative z-10 flex items-start justify-between">
        <p className="mono gl-in text-paper/55">[ 04 ] Where we are</p>
        <p className="mono gl-in hidden text-right text-paper/55 sm:block">
          Local time <span className="text-paper"><Clock seconds /></span>
          <br />
          Time zone <span className="text-paper">GMT+5:30</span>
        </p>
      </div>

      <h2 id="globe-title" className="gl-in display relative z-10 mt-8 max-w-[11ch] text-[clamp(2.4rem,7vw,7.6rem)] leading-[0.95]">
        Rooted in Bhopal. Open to <span className="serif-i text-lilac text-[1.08em]">the world.</span>
      </h2>

      {/* globe stage */}
      {/* outer = layout (responsive translate lives here); inner = GSAP-animated, so the two never fight */}
      <div className="relative mx-auto mt-6 aspect-square w-[min(94vw,82svh)] md:absolute md:right-[2vw] md:top-1/2 md:-translate-y-[46%] md:mt-0 md:w-[min(62vw,92svh)]">
       <div className="gl-stage absolute inset-0">
        <GlobeCanvas onPin={onPin} hqRef={hqRef} pinRef={pinRef} resetSignal={reset} />

        {/* HQ pin */}
        <div ref={hqRef} className="group pointer-events-none absolute left-0 top-0 opacity-0" aria-hidden>
          <span className="absolute -left-[5px] -top-[5px] block h-[10px] w-[10px] bg-lilac shadow-[0_0_0_4px_rgba(164,139,255,0.25)]" />
          <span className="mono absolute left-3 top-[-0.55rem] whitespace-nowrap group-data-[flip=1]:left-auto group-data-[flip=1]:right-3 rounded-sm bg-ink/80 px-2 py-1 text-paper">
            CREOIT — Bhopal
          </span>
        </div>

        {/* dropped pin */}
        <div ref={pinRef} className="pointer-events-none absolute left-0 top-0 opacity-0" aria-hidden>
          <span className="absolute -left-[6px] -top-[6px] block h-3 w-3 animate-ping bg-signal" />
          <span className="absolute -left-[6px] -top-[6px] block h-3 w-3 bg-paper" />
        </div>
        </div>
      </div>

      {/* readout */}
      <div className="relative z-10 mt-8 flex flex-col gap-6 md:absolute md:bottom-[var(--pad)] md:left-[var(--pad)] md:mt-0 md:max-w-sm">
        <div className="gl-in mono min-h-[4.5rem] text-paper/60" aria-live="polite">
          {pin ? (
            <>
              <p className="text-paper">
                Pin dropped — {fmt(pin.lat, "N", "S")}, {fmt(pin.lon, "E", "W")}
              </p>
              <p className="mt-1">Wherever you are, we&apos;ll meet you there.</p>
            </>
          ) : (
            <>
              <p className="text-paper">Drag to spin. Click to drop a pin.</p>
              <p className="mt-1">Studio: {fmt(23.2599, "N", "S")}, {fmt(77.4126, "E", "W")}</p>
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
            className="mono rounded-full border border-paper/40 px-6 py-4 transition-colors duration-500 hover:bg-paper hover:text-ink"
          >
            Back to Bhopal
          </button>
        </div>
      </div>
    </section>
  );
}
