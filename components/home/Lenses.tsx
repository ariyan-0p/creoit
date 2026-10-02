"use client";

/**
 * Lenses — six services as six apertures.
 * The section pins; scroll steps the iris through f/1.4 → f/8 while the
 * active service swaps. The iris is plain SVG geometry recomputed per tick
 * (6 lines + 1 path), so it stays cheap.
 */

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { services } from "@/content/services";

const STOPS = ["f/1.4", "f/2", "f/2.8", "f/4", "f/5.6", "f/8"];
const RADII = [62, 53, 45, 37, 29, 21]; // hole circumradius per stop
const RIM = 94;
const N = 6;

function iris(r: number, rot: number) {
  const v = Array.from({ length: N }, (_, i) => {
    const a = ((i * 360) / N + rot) * (Math.PI / 180);
    return [Math.cos(a) * r, Math.sin(a) * r] as const;
  });
  // Blade edge i runs v[i] -> v[i+1]; extend it beyond v[i+1] out to the rim.
  const lines = v.map((p, i) => {
    const q = v[(i + 1) % N];
    const dx = q[0] - p[0];
    const dy = q[1] - p[1];
    const len = Math.hypot(dx, dy);
    const ux = dx / len;
    const uy = dy / len;
    // ray q + t*u intersects circle |x| = RIM
    const b = q[0] * ux + q[1] * uy;
    const c = q[0] * q[0] + q[1] * q[1] - RIM * RIM;
    const t = -b + Math.sqrt(b * b - c);
    return { x1: q[0], y1: q[1], x2: q[0] + ux * t, y2: q[1] + uy * t };
  });
  const hole = `M${v.map((p) => `${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join("L")}Z`;
  return { lines, hole };
}

export function Lenses() {
  const root = useRef<HTMLElement>(null);
  const holeRef = useRef<SVGPathElement>(null);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);
  const stopRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const draw = (r: number, rot: number) => {
        const { lines, hole } = iris(r, rot);
        holeRef.current?.setAttribute("d", `M0 -${RIM}A${RIM} ${RIM} 0 1 1 0 ${RIM}A${RIM} ${RIM} 0 1 1 0 -${RIM}Z${hole}`);
        lines.forEach((l, i) => {
          const el = lineRefs.current[i];
          if (!el) return;
          el.setAttribute("x1", l.x1.toFixed(2));
          el.setAttribute("y1", l.y1.toFixed(2));
          el.setAttribute("x2", l.x2.toFixed(2));
          el.setAttribute("y2", l.y2.toFixed(2));
        });
      };

      const state = { r: RADII[0], rot: 0 };
      draw(state.r, state.rot);

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const panels = gsap.utils.toArray<HTMLElement>(".lens-panel");
        const ticks = gsap.utils.toArray<HTMLElement>(".lens-tick");
        gsap.set(panels, { autoAlpha: 0, y: 60 });
        gsap.set(panels[0], { autoAlpha: 1, y: 0 });

        const setStop = (i: number) => {
          if (stopRef.current) stopRef.current.textContent = STOPS[i];
          ticks.forEach((t, k) => t.classList.toggle("is-on", k === i));
        };
        setStop(0);

        let current = -1;
        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          onUpdate: () => {
            const idx = Math.min(N - 1, Math.max(0, Math.round(tl.time() + 0.001)));
            if (idx !== current) {
              current = idx;
              setStop(idx);
            }
          },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${window.innerHeight * (N - 1) * 0.95}`,
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        for (let i = 1; i < N; i++) {
          const at = i - 1;
          tl.to(state, { r: RADII[i], rot: i * 22, duration: 1, onUpdate: () => draw(state.r, state.rot) }, at)
            .to(panels[i - 1], { autoAlpha: 0, y: -60, duration: 0.45, ease: "power2.in" }, at)
            .fromTo(panels[i], { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out" }, at + 0.45)
            .to(".lens-bar", { scaleY: (i + 1) / N, duration: 1, ease: "none" }, at);
        }
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      data-nav="dark"
      id="what-we-do"
      aria-label="What we do"
      className="relative z-10 flex h-[100svh] min-h-[640px] w-full flex-col overflow-hidden bg-deep px-[var(--pad)] pb-[var(--pad)] pt-24 text-paper"
    >
      <div className="mono flex items-center justify-between text-paper/55">
        <span>[ 02 ] Six lenses, one team</span>
        <span className="hidden sm:block">
          Aperture <span ref={stopRef} className="text-lilac">f/1.4</span>
        </span>
      </div>

      <div className="relative mt-4 grid flex-1 items-center gap-6 md:grid-cols-12">
        {/* Iris */}
        <div className="relative mx-auto aspect-square w-[min(34vh,78vw)] md:col-span-5 md:w-[min(44vw,64vh)]">
          <svg viewBox="-100 -100 200 200" className="h-full w-full" role="img" aria-label="Camera aperture opening with each service">
            <defs>
              <radialGradient id="lens-light" cx="50%" cy="50%" r="50%">
                <stop offset="0" stopColor="#ffffff" />
                <stop offset="0.35" stopColor="#a48bff" />
                <stop offset="1" stopColor="#5a2bff" />
              </radialGradient>
            </defs>
            <circle r={RIM} fill="url(#lens-light)" />
            <path ref={holeRef} fill="#0a0a0b" fillRule="evenodd" />
            {Array.from({ length: N }).map((_, i) => (
              <line
                key={i}
                ref={(el) => {
                  lineRefs.current[i] = el;
                }}
                stroke="rgba(255,255,255,0.28)"
                strokeWidth="0.45"
              />
            ))}
            <circle r={RIM} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" />
            <circle r={RIM + 4} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.5" strokeDasharray="1.2 2.4" />
          </svg>
        </div>

        {/* Panels */}
        <div className="relative min-h-[46vh] md:col-span-7 md:min-h-[58vh]">
          {services.map((s) => (
            <article key={s.id} className="lens-panel absolute inset-0 flex flex-col justify-center">
              <p className="mono mb-4 flex items-center gap-3 text-lilac">
                <span>{s.number}</span>
                <span className="h-px w-10 bg-lilac/60" />
                <span className="text-paper/55">{STOPS[Number(s.number) - 1]}</span>
              </p>
              <h3 className="display text-[clamp(2.6rem,7.4vw,8rem)]">{s.title}</h3>
              <p className="serif-i mt-3 max-w-[22ch] text-[clamp(1.5rem,3vw,2.8rem)] leading-[1.05] text-paper">{s.headline}</p>
              <p className="mt-6 max-w-md text-[0.95rem] leading-relaxed text-paper/65">{s.description}</p>
              <ul className="mono mt-6 flex max-w-xl flex-wrap gap-2">
                {s.offerings.map((o) => (
                  <li key={o} className="rounded-full border border-paper/25 px-3 py-1.5 text-paper/80">
                    {o}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>

      {/* progress rail */}
      <div className="absolute right-[var(--pad)] top-1/2 hidden -translate-y-1/2 items-center gap-3 md:flex" aria-hidden>
        <ul className="mono flex flex-col gap-3 text-right text-paper/35">
          {services.map((s) => (
            <li key={s.id} className="lens-tick transition-colors duration-500 [&.is-on]:text-paper">
              {s.number}
            </li>
          ))}
        </ul>
        <span className="relative block h-32 w-px bg-paper/20">
          <span className="lens-bar absolute inset-0 origin-top scale-y-[0.16] bg-lilac" />
        </span>
      </div>
    </section>
  );
}
