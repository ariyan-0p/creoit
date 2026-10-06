"use client";

/**
 * Globe — "Rooted in Bhopal. Open to the world."
 *
 * The globe sits dead centre with the headline split around it ("Rooted in
 * Bhopal." on the left, "Open to the world." on the right). On a desktop the
 * section pins and you travel: scroll and the globe flies from Bhopal to Dubai,
 * London, New York, Singapore and Sydney, dropping a pin on each, with the
 * distance from the studio and that city's live local time below.
 *
 * Still a toy too: drag to spin, click to drop your own pin and brief us from it.
 * Phones and reduced-motion get the same layout without the pin or the journey.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

const CITIES = [
  { name: "Bhopal", tz: "Asia/Kolkata", lat: 23.2599, lon: 77.4126 },
  { name: "Dubai", tz: "Asia/Dubai", lat: 25.2048, lon: 55.2708 },
  { name: "London", tz: "Europe/London", lat: 51.5072, lon: -0.1276 },
  { name: "New York", tz: "America/New_York", lat: 40.7128, lon: -74.006 },
  { name: "Singapore", tz: "Asia/Singapore", lat: 1.3521, lon: 103.8198 },
  { name: "Sydney", tz: "Australia/Sydney", lat: -33.8688, lon: 151.2093 },
] as const;

/** great-circle distance from the studio, in km */
function kmFromHome(lat: number, lon: number) {
  const R = 6371;
  const rad = (d: number) => (d * Math.PI) / 180;
  const h = CITIES[0];
  const dLat = rad(lat - h.lat);
  const dLon = rad(lon - h.lon);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(h.lat)) * Math.cos(rad(lat)) * Math.sin(dLon / 2) ** 2;
  return Math.round((2 * R * Math.asin(Math.sqrt(a))) / 10) * 10;
}

/** the city's live local time + how far ahead/behind the studio it is */
function CityTime({ tz }: { tz: string }) {
  const [now, setNow] = useState<{ t: string; diff: string } | null>(null);

  useEffect(() => {
    const f = new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
    const offset = (zone: string, d: Date) => Date.parse(d.toLocaleString("en-US", { timeZone: zone })) - Date.parse(d.toLocaleString("en-US", { timeZone: "UTC" }));
    const tick = () => {
      const d = new Date();
      const mins = Math.round((offset(tz, d) - offset("Asia/Kolkata", d)) / 60000);
      const a = Math.abs(mins);
      const text = mins === 0 ? "same time as us" : `${Math.floor(a / 60)}h${a % 60 ? ` ${a % 60}m` : ""} ${mins > 0 ? "ahead of" : "behind"} us`;
      setNow({ t: f.format(d), diff: text });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tz]);

  return (
    <>
      <span className="tabular-nums text-paper">{now?.t ?? "--:--:--"}</span>
      <span className="text-paper/55"> · {now?.diff ?? ""}</span>
    </>
  );
}

export function Globe() {
  const root = useRef<HTMLElement>(null);
  const hqRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [pin, setPin] = useState<Pin | null>(null);
  const [reset, setReset] = useState(0);
  const [step, setStep] = useState(0);

  const onPin = useCallback((p: Pin | null) => setPin(p), []);
  const city = CITIES[step];
  const target = useMemo<Pin | null>(() => (step === 0 ? null : { lat: CITIES[step].lat, lon: CITIES[step].lon }), [step]);

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

      // the journey: pinned, scroll travels the globe from city to city
      mm.add("(min-width: 768px) and (min-height: 560px) and (prefers-reduced-motion: no-preference)", () => {
        let last = 0;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${window.innerHeight * 3.4}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const i = Math.min(CITIES.length - 1, Math.floor(self.progress * CITIES.length));
              if (i !== last) {
                last = i;
                setStep(i);
                setPin(null); // a flight replaces any pin you dropped
              }
            },
          },
        });
        // the headline halves drift apart and the globe leans in as you travel
        tl.to(".gl-left", { xPercent: -5, ease: "none" }, 0)
          .to(".gl-right", { xPercent: 5, ease: "none" }, 0)
          .to(".gl-orb", { scale: 1.08, ease: "none" }, 0);
        return () => {
          last = 0;
          setStep(0);
        };
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      data-nav="dark"
      aria-labelledby="globe-title"
      className="relative z-10 flex flex-col overflow-hidden bg-ink px-[var(--pad)] pb-[var(--pad)] pt-[clamp(4.5rem,8vw,5.5rem)] text-paper md:h-[100svh]"
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "radial-gradient(42% 58% at 50% 50%, rgba(106,61,255,0.3) 0%, rgba(106,61,255,0) 72%)" }}
      />

      <div className="relative z-10 flex items-start justify-between">
        <p className="mono gl-in text-paper/55">[ 05 ] Where we are</p>
        <p className="mono gl-in hidden text-right text-paper/55 sm:block">
          Studio time <span className="text-paper"><Clock seconds /></span>
          <br />
          Time zone <span className="text-paper">GMT+5:30</span>
        </p>
      </div>

      {/* headline halves flank the globe (stacked above it on narrower screens) */}
      <div className="relative z-10 mt-6 grid flex-1 content-center items-center gap-y-3 md:mt-0 [--gs:min(80vw,46svh)] md:[--gs:min(56vw,max(12rem,calc(100svh-27rem)))] xl:grid-cols-[1fr_var(--gs)_1fr] xl:[--gs:min(50vw,max(14rem,calc(100svh-17rem)))]">
        <h2 id="globe-title" className="contents">
          <span className="gl-in gl-left display order-1 block text-center text-[clamp(2.2rem,8.4vw,4.4rem)] leading-[0.95] xl:text-right xl:text-[clamp(2.4rem,4.2vw,6rem)]">
            Rooted in <br className="hidden xl:block" />
            Bhopal.
          </span>
          <span className="gl-in gl-right display order-2 block text-center text-[clamp(2.2rem,8.4vw,4.4rem)] leading-[0.95] xl:order-3 xl:text-left xl:text-[clamp(2.4rem,4.2vw,6rem)]">
            Open to <br className="hidden xl:block" />
            <span className="serif-i text-[1.08em] normal-case text-lilac">the world.</span>
          </span>
        </h2>

        {/* globe stage. outer = layout, .gl-orb = scroll lean-in, .gl-stage = entrance, so GSAP never fights itself */}
        <div className="relative order-3 mx-auto aspect-square w-[var(--gs)] xl:order-2">
          <div className="gl-orb absolute inset-0">
            <div className="gl-stage absolute inset-0">
              <GlobeCanvas onPin={onPin} hqRef={hqRef} pinRef={pinRef} resetSignal={reset} target={target} />

              {/* HQ pin */}
              <div ref={hqRef} className="group pointer-events-none absolute left-0 top-0 opacity-0" aria-hidden>
                <span className="absolute -left-[5px] -top-[5px] block h-[10px] w-[10px] bg-lilac shadow-[0_0_0_4px_rgba(164,139,255,0.25)]" />
                <span className="mono absolute left-3 top-[-0.55rem] whitespace-nowrap group-data-[flip=1]:left-auto group-data-[flip=1]:right-3 rounded-sm bg-ink/80 px-2 py-1 text-paper">
                  CREOIT — Bhopal
                </span>
              </div>

              {/* dropped / journey pin */}
              <div ref={pinRef} className="pointer-events-none absolute left-0 top-0 opacity-0" aria-hidden>
                <span className="absolute -left-[6px] -top-[6px] block h-3 w-3 animate-ping bg-signal" />
                <span className="absolute -left-[6px] -top-[6px] block h-3 w-3 bg-paper" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* bottom: readout · where the journey is · progress */}
      <div className="relative z-10 mt-6 grid items-end gap-6 md:mt-0 md:grid-cols-[1fr_auto_1fr]">
        <div className="flex flex-col gap-5">
          <div className="gl-in mono min-h-[3.5rem] text-paper/60" aria-live="polite">
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
                <p className="mt-1">Studio: {fmt(CITIES[0].lat, "N", "S")}, {fmt(CITIES[0].lon, "E", "W")}</p>
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

        {/* the journey readout (desktop) */}
        <div className="gl-in hidden text-center md:block" aria-live="off">
          <p className="mono text-paper/55">{step === 0 ? "Home base" : "Now over"}</p>
          <p className="serif-i mt-1 text-[clamp(2rem,3.4vw,3.6rem)] leading-none text-lilac">{city.name}</p>
          <p className="mono mt-2 text-paper/60">
            {step === 0 ? "Where it all starts · " : `${kmFromHome(city.lat, city.lon).toLocaleString("en-IN")} km from us · `}
            <CityTime tz={city.tz} />
          </p>
        </div>

        <div className="gl-in hidden items-end justify-end gap-4 text-right md:flex">
          <div>
            <p className="mono text-paper/55">Scroll to travel</p>
            <p className="mono mt-1 text-paper">
              0{step + 1} <span className="text-paper/40">/ 0{CITIES.length}</span>
            </p>
          </div>
          <div aria-hidden className="flex flex-col gap-1.5 pb-1">
            {CITIES.map((c, i) => (
              <i key={c.name} className={`block h-1.5 rounded-full bg-current transition-all duration-500 ${i === step ? "w-6 text-lilac" : "w-1.5 text-paper/30"}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
