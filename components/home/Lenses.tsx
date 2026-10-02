"use client";

/**
 * Lenses — six services as six apertures.
 *
 * The section pins; scroll steps the iris through f/1.4 → f/8 while the active
 * service swaps. Around the iris:
 *  - depth of field: bokeh lights behind the blades go from big+soft (wide open)
 *    to small+sharp (stopped down)
 *  - an engraved f-stop ring that turns so the active stop sits under the marker
 *  - a live exposure readout (shutter slows as the iris closes — same exposure)
 * Each service also draws its own little illustration as it arrives.
 *
 * The iris is plain SVG geometry recomputed per tick (6 lines + 1 path + a few
 * circles), so it stays cheap.
 */

import { useRef, type ReactNode } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { services } from "@/content/services";

const STOPS = ["f/1.4", "f/2", "f/2.8", "f/4", "f/5.6", "f/8"];
const SHUTTER = ["1/2000", "1/1000", "1/500", "1/250", "1/125", "1/60"]; // same exposure at every stop
const DOF = ["Very shallow", "Shallow", "Moderate", "Moderate", "Deep", "Very deep"];
const RADII = [62, 53, 45, 37, 29, 21]; // hole circumradius per stop
const RIM = 94;
const N = 6;

/** Real, existing work to point at (Kalrav is branding + events). */
const SEEN_IN: Record<string, { href: string; label: string }> = {
  branding: { href: "/work/kalrav", label: "Kalrav Garba 2024" },
  experiences: { href: "/work/kalrav", label: "Kalrav Garba 2024" },
};

/** Bokeh lights behind the blades: [x, y, base radius]. */
const BOKEH: [number, number, number][] = [
  [-18, -12, 11],
  [22, -20, 9],
  [8, 18, 13],
  [-26, 14, 8],
  [30, 10, 7],
  [-4, -32, 10],
  [14, -2, 6],
  [-34, -22, 7],
];

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
    const b = q[0] * ux + q[1] * uy;
    const c = q[0] * q[0] + q[1] * q[1] - RIM * RIM;
    const t = -b + Math.sqrt(b * b - c);
    return { x1: q[0], y1: q[1], x2: q[0] + ux * t, y2: q[1] + uy * t };
  });
  const hole = `M${v.map((p) => `${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join("L")}Z`;
  return { lines, hole };
}

/* ── per-service illustrations (drawn on as the panel arrives) ───────────── */

const sk = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const D = { pathLength: 1 } as const; // lets every shape be "drawn on" with dashoffset 1 → 0

function Illus({ id }: { id: string }) {
  let body: ReactNode = null;
  switch (id) {
    case "branding": // identity construction sheet
      body = (
        <>
          <circle className="il" {...D} cx="70" cy="65" r="40" />
          <circle className="il" {...D} cx="70" cy="65" r="24" />
          <line className="il" {...D} x1="20" y1="65" x2="120" y2="65" />
          <line className="il" {...D} x1="70" y1="15" x2="70" y2="115" />
          <rect className="il" {...D} x="124" y="26" width="58" height="58" rx="9" />
          <path className="il" {...D} d="M124 102 H182 M124 114 H160" />
          <circle className="il-pop" cx="153" cy="55" r="10" fill="currentColor" />
        </>
      );
      break;
    case "content": // film strip with play
      body = (
        <>
          <rect className="il" {...D} x="14" y="28" width="172" height="74" rx="7" />
          <rect className="il" {...D} x="30" y="46" width="38" height="38" rx="3" />
          <rect className="il" {...D} x="81" y="46" width="38" height="38" rx="3" />
          <rect className="il" {...D} x="132" y="46" width="38" height="38" rx="3" />
          <path className="il" {...D} d="M92 55 L108 65 L92 75 Z" />
          <path className="il" {...D} d="M24 36 H176 M24 94 H176" />
        </>
      );
      break;
    case "performance": // rising line to a target
      body = (
        <>
          <path className="il" {...D} d="M20 112 H186 M20 112 V16" />
          <polyline className="il" {...D} points="26,96 56,84 82,90 112,58 142,50 172,24" />
          <circle className="il" {...D} cx="172" cy="24" r="10" />
          <circle className="il-pop" cx="172" cy="24" r="3.5" fill="currentColor" />
        </>
      );
      break;
    case "digital": // browser wireframe
      body = (
        <>
          <rect className="il" {...D} x="18" y="16" width="164" height="100" rx="9" />
          <line className="il" {...D} x1="18" y1="36" x2="182" y2="36" />
          <circle className="il-pop" cx="32" cy="26" r="2.6" fill="currentColor" />
          <circle className="il-pop" cx="42" cy="26" r="2.6" fill="currentColor" />
          <circle className="il-pop" cx="52" cy="26" r="2.6" fill="currentColor" />
          <rect className="il" {...D} x="30" y="46" width="84" height="32" rx="4" />
          <rect className="il" {...D} x="124" y="46" width="46" height="32" rx="4" />
          <rect className="il" {...D} x="30" y="86" width="36" height="20" rx="3" />
          <rect className="il" {...D} x="74" y="86" width="36" height="20" rx="3" />
          <rect className="il" {...D} x="118" y="86" width="52" height="20" rx="3" />
        </>
      );
      break;
    case "experiences": // ripples off a stage
      body = (
        <>
          <path className="il" {...D} d="M64 96 A36 36 0 0 1 136 96" />
          <path className="il" {...D} d="M44 96 A56 56 0 0 1 156 96" />
          <path className="il" {...D} d="M24 96 A76 76 0 0 1 176 96" />
          <path className="il" {...D} d="M18 110 H182" />
          <circle className="il-pop" cx="100" cy="96" r="4" fill="currentColor" />
          <circle className="il-pop" cx="60" cy="104" r="2.4" fill="currentColor" />
          <circle className="il-pop" cx="82" cy="106" r="2.4" fill="currentColor" />
          <circle className="il-pop" cx="118" cy="106" r="2.4" fill="currentColor" />
          <circle className="il-pop" cx="140" cy="104" r="2.4" fill="currentColor" />
        </>
      );
      break;
    default: // growth: compounding steps
      body = (
        <>
          <rect className="il" {...D} x="26" y="86" width="26" height="26" rx="3" />
          <rect className="il" {...D} x="62" y="68" width="26" height="44" rx="3" />
          <rect className="il" {...D} x="98" y="48" width="26" height="64" rx="3" />
          <rect className="il" {...D} x="134" y="24" width="26" height="88" rx="3" />
          <path className="il" {...D} d="M26 70 C70 62 112 42 168 14" />
          <path className="il" {...D} d="M156 12 L170 14 L166 28" />
        </>
      );
  }
  return (
    <svg viewBox="0 0 200 130" className="lp-il h-full w-full text-lilac" aria-hidden {...sk}>
      {body}
    </svg>
  );
}

export function Lenses() {
  const root = useRef<HTMLElement>(null);
  const holeRef = useRef<SVGPathElement>(null);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);
  const bokehRefs = useRef<(SVGCircleElement | null)[]>([]);
  const blurRef = useRef<SVGFEGaussianBlurElement>(null);
  const ringRef = useRef<SVGGElement>(null);
  const stopRef = useRef<HTMLSpanElement>(null);
  const hudStop = useRef<HTMLSpanElement>(null);
  const hudShutter = useRef<HTMLSpanElement>(null);
  const hudDof = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const draw = (r: number, rot: number, dof: number, ring: number) => {
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
        // depth of field: dof 0 (wide open) → 1 (stopped down)
        const size = 1.55 - dof * 1.2;
        blurRef.current?.setAttribute("stdDeviation", (7 - dof * 6.6).toFixed(2));
        bokehRefs.current.forEach((c, i) => {
          if (!c) return;
          c.setAttribute("r", (BOKEH[i][2] * size).toFixed(2));
          c.setAttribute("opacity", (0.5 + dof * 0.45).toFixed(2));
        });
        ringRef.current?.setAttribute("transform", `rotate(${ring.toFixed(2)})`);
      };

      const state = { r: RADII[0], rot: 0, dof: 0, ring: 0 };
      draw(state.r, state.rot, state.dof, state.ring);

      const mm = gsap.matchMedia();

      // Reduced motion: no pin, no scrub — show every service as a simple stacked list.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        root.current?.classList.add("lp-static");
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const panels = gsap.utils.toArray<HTMLElement>(".lens-panel");
        const ticks = gsap.utils.toArray<HTMLElement>(".lens-tick");
        const kids = panels.map((p) => gsap.utils.toArray<HTMLElement>(".lp-k", p));
        const draws = panels.map((p) => gsap.utils.toArray<SVGElement>(".il", p));
        const pops = panels.map((p) => gsap.utils.toArray<SVGElement>(".il-pop", p));

        gsap.set(panels, { autoAlpha: 0 });
        gsap.set(panels[0], { autoAlpha: 1 });
        kids.forEach((k, i) => i > 0 && gsap.set(k, { opacity: 0, y: 26 }));
        draws.forEach((d, i) => i > 0 && gsap.set(d, { strokeDasharray: 1, strokeDashoffset: 1 }));
        pops.forEach((p, i) => i > 0 && gsap.set(p, { opacity: 0, scale: 0.2, transformOrigin: "50% 50%" }));

        const setStop = (i: number) => {
          if (stopRef.current) stopRef.current.textContent = STOPS[i];
          if (hudStop.current) hudStop.current.textContent = STOPS[i];
          if (hudShutter.current) hudShutter.current.textContent = SHUTTER[i];
          if (hudDof.current) hudDof.current.textContent = DOF[i];
          ticks.forEach((t, k) => t.classList.toggle("is-on", k === i));
          root.current?.querySelectorAll<HTMLElement>(".dof-cell").forEach((c, k) => c.classList.toggle("is-on", k <= i));
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
          tl.to(
            state,
            {
              r: RADII[i],
              rot: i * 22,
              dof: i / (N - 1),
              ring: -i * 60,
              duration: 1,
              onUpdate: () => draw(state.r, state.rot, state.dof, state.ring),
            },
            at
          )
            .to(panels[i - 1], { autoAlpha: 0, y: -60, duration: 0.45, ease: "power2.in" }, at)
            .fromTo(panels[i], { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out" }, at + 0.45)
            // staggered text, and the illustration sketches itself on
            .to(kids[i], { opacity: 1, y: 0, duration: 0.45, stagger: 0.05, ease: "power2.out" }, at + 0.52)
            .to(draws[i], { strokeDashoffset: 0, duration: 0.6, stagger: 0.04, ease: "none" }, at + 0.55)
            .to(pops[i], { opacity: 1, scale: 1, duration: 0.35, stagger: 0.05, ease: "back.out(2.5)" }, at + 0.95)
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
      className="lp-root relative z-10 flex h-[100svh] min-h-[640px] w-full flex-col overflow-hidden bg-deep px-[var(--pad)] pb-[var(--pad)] pt-24 text-paper"
    >
      <style>{`
        .lp-static{height:auto!important;min-height:0!important;overflow:visible!important}
        .lp-static .lens-panel{position:relative!important;opacity:1!important;visibility:visible!important;transform:none!important;margin-bottom:4rem}
        .lp-static .lp-aperture,.lp-static .lp-rail{display:none}
        .dof-cell{background:rgba(255,255,255,.18);transition:background .5s}
        .dof-cell.is-on{background:var(--color-lilac)}
        @keyframes lp-drift{0%,100%{transform:translate(0,0)}50%{transform:translate(2.2px,-2.6px)}}
        .lp-bk{animation:lp-drift 7s ease-in-out infinite}
      `}</style>

      <div className="mono flex items-center justify-between text-paper/55">
        <span>[ 02 ] Six lenses, one team</span>
        <span className="hidden sm:block">
          Aperture <span ref={stopRef} className="text-lilac">f/1.4</span>
        </span>
      </div>

      <div className="relative mt-4 grid flex-1 items-center gap-6 md:grid-cols-12">
        {/* ── Aperture ───────────────────────────────────────── */}
        <div className="lp-aperture relative mx-auto flex w-[min(27vh,66vw)] flex-col items-center md:col-span-5 md:w-[min(44vw,62vh)]">
          <div className="relative aspect-square w-full">
            <svg viewBox="-124 -124 248 248" className="h-full w-full" role="img" aria-label="Camera aperture: opens and closes with each service">
              <defs>
                <radialGradient id="lens-light" cx="50%" cy="50%" r="50%">
                  <stop offset="0" stopColor="#ffffff" />
                  <stop offset="0.35" stopColor="#a48bff" />
                  <stop offset="1" stopColor="#5a2bff" />
                </radialGradient>
                <filter id="lens-bokeh" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur ref={blurRef} stdDeviation="7" />
                </filter>
                <clipPath id="lens-disc">
                  <circle r={RIM} />
                </clipPath>
              </defs>

              {/* light + depth-of-field bokeh (only the hole shows them) */}
              <circle r={RIM} fill="url(#lens-light)" />
              <g clipPath="url(#lens-disc)">
                <g filter="url(#lens-bokeh)">
                  {BOKEH.map(([x, y, r], i) => (
                    <circle
                      key={i}
                      ref={(el) => {
                        bokehRefs.current[i] = el;
                      }}
                      className="lp-bk"
                      style={{ animationDelay: `${-i * 0.9}s` }}
                      cx={x}
                      cy={y}
                      r={r * 1.55}
                      fill="#ffffff"
                      opacity="0.5"
                    />
                  ))}
                </g>
              </g>

              {/* blades */}
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

              {/* engraved f-stop ring: turns so the active stop sits under the marker */}
              <circle r="100" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.5" strokeDasharray="1.2 2.4" />
              <g ref={ringRef}>
                {Array.from({ length: 36 }).map((_, i) => (
                  <line
                    key={i}
                    x1="0"
                    y1={-102}
                    x2="0"
                    y2={i % 6 === 0 ? -108 : -105}
                    stroke="rgba(255,255,255,0.45)"
                    strokeWidth={i % 6 === 0 ? 0.9 : 0.5}
                    transform={`rotate(${i * 10})`}
                  />
                ))}
                {STOPS.map((s, i) => (
                  <text
                    key={s}
                    className="mono"
                    fill="rgba(255,255,255,0.78)"
                    fontSize="7.2"
                    textAnchor="middle"
                    transform={`rotate(${i * 60}) translate(0,-116)`}
                  >
                    {s.replace("f/", "")}
                  </text>
                ))}
              </g>
              {/* fixed marker */}
              <path d="M-4 -123 L4 -123 L0 -118 Z" fill="#a48bff" />
            </svg>
          </div>

          {/* exposure readout */}
          <div className="mono mt-3 hidden w-full max-w-[26rem] grid-cols-3 gap-x-4 gap-y-2 border-t border-paper/15 pt-3 text-paper/60 md:grid">
            <span>
              Aperture
              <br />
              <span ref={hudStop} className="text-paper">f/1.4</span>
            </span>
            <span>
              Shutter
              <br />
              <span ref={hudShutter} className="text-paper">1/2000</span>
            </span>
            <span>
              ISO
              <br />
              <span className="text-paper">100</span>
            </span>
            <span className="col-span-3 flex items-center gap-3">
              <span className="shrink-0">Depth of field</span>
              <span className="flex flex-1 gap-1" aria-hidden>
                {Array.from({ length: N }).map((_, i) => (
                  <i key={i} className="dof-cell block h-[3px] flex-1 rounded-full" />
                ))}
              </span>
              <span ref={hudDof} className="w-[6.5rem] shrink-0 text-right text-paper">Very shallow</span>
            </span>
          </div>
        </div>

        {/* ── Panels ─────────────────────────────────────────── */}
        <div className="relative min-h-[48vh] md:col-span-7 md:min-h-[62vh]">
          {services.map((s, idx) => {
            const seen = SEEN_IN[s.id];
            return (
              <article key={s.id} className="lens-panel absolute inset-0 flex flex-col justify-center">
                <p className="lp-k mono mb-4 flex items-center gap-3 text-lilac">
                  <span>{s.number}</span>
                  <span className="h-px w-10 bg-lilac/60" />
                  <span className="text-paper/55">{STOPS[idx]}</span>
                </p>
                <h3 className="lp-k display text-[clamp(2.6rem,7.4vw,8rem)]">{s.title}</h3>

                <div className="mt-3 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,15rem)] lg:items-end lg:gap-10">
                  <div>
                    <p className="lp-k serif-i max-w-[22ch] text-[clamp(1.5rem,3vw,2.8rem)] leading-[1.05] text-paper">{s.headline}</p>
                    <p className="lp-k mt-3 max-w-md text-[0.9rem] leading-relaxed text-paper/65 md:mt-5 md:text-[0.95rem]">{s.description}</p>
                    <ul className="mono mt-4 flex max-w-xl flex-wrap gap-2 md:mt-5">
                      {s.offerings.map((o) => (
                        <li key={o} className="lp-k rounded-full border border-paper/25 px-3 py-1.5 text-paper/80">
                          {o}
                        </li>
                      ))}
                    </ul>
                    <p className="lp-k mono mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-paper/60 md:mt-6">
                      {seen ? (
                        <Link href={seen.href} data-cursor="View" className="u-link text-paper">
                          Seen in: {seen.label} →
                        </Link>
                      ) : (
                        <Link href="/contact" data-cursor="Talk" className="u-link text-paper">
                          Start a {s.title.toLowerCase()} project →
                        </Link>
                      )}
                      <Link href="/what-we-do" className="u-link hidden sm:inline">
                        All services
                      </Link>
                    </p>
                  </div>

                  {/* illustration sketches itself on as the panel arrives */}
                  <div className="lp-k hidden aspect-[200/130] w-full lg:block" aria-hidden>
                    <Illus id={s.id} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* progress rail */}
      <div className="lp-rail absolute right-[var(--pad)] top-1/2 hidden -translate-y-1/2 items-center gap-3 md:flex" aria-hidden>
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
