"use client";

/**
 * Work — one real case told properly (Kalrav), then the "unexposed frames":
 * honest placeholders for the next stories, styled as undeveloped film.
 * The Kalrav frame opens from a small viewfinder crop to full-bleed on scroll.
 */

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { CountUp } from "@/components/ui/CountUp";
import { projects } from "@/content/work";

const kalrav = projects[0];
const RINGS = [
  { r: 36, dash: "0 11", w: 6, d: 40, dir: 1 },
  { r: 66, dash: "0 14", w: 5, d: 55, dir: -1 },
  { r: 98, dash: "10 10", w: 2.5, d: 70, dir: 1 },
  { r: 128, dash: "0 12", w: 6, d: 85, dir: -1 },
  { r: 160, dash: "22 8", w: 2, d: 110, dir: 1 },
  { r: 190, dash: "0 10", w: 5, d: 130, dir: -1 },
];
const UNEXPOSED = [
  { n: "02", kind: "Branding frame", note: "A brand identity waiting to be remembered." },
  { n: "03", kind: "Content frame", note: "The next thing that stops the scroll." },
  { n: "04", kind: "Performance frame", note: "Leads, measured. Results, shown." },
];

const FACTS = [
  { k: "Challenge", v: kalrav.challenge },
  { k: "Idea", v: kalrav.idea },
  { k: "Execution", v: kalrav.execution },
  { k: "Impact", v: kalrav.impact },
] as const;

export function Work() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".wk-frame",
          { clipPath: "inset(14% 15% 14% 15% round 28px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            ease: "none",
            scrollTrigger: { trigger: ".wk-frame", start: "top 92%", end: "top 8%", scrub: true },
          }
        );
        gsap.fromTo(
          ".wk-art",
          { scale: 1.35 },
          { scale: 1, ease: "none", scrollTrigger: { trigger: ".wk-frame", start: "top 92%", end: "top 8%", scrub: true } }
        );
        gsap.from(".wk-fact", {
          y: 36,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: { trigger: ".wk-facts", start: "top 84%" },
        });
        gsap.from(".wk-un", {
          y: 60,
          opacity: 0,
          duration: 1.1,
          stagger: 0.12,
          ease: "expo.out",
          scrollTrigger: { trigger: ".wk-uns", start: "top 85%" },
        });
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      data-nav="light"
      id="work"
      aria-labelledby="work-title"
      className="relative z-10 bg-paper pb-[clamp(5rem,10vw,9rem)] pt-[clamp(5rem,10vw,9rem)] text-ink"
    >
      <div className="px-[var(--pad)]">
        <div className="mono mb-10 flex items-center justify-between text-ink/55">
          <span>[ 03 ] Selected work</span>
          <Link href="/work" className="u-link">All work →</Link>
        </div>
        <h2 id="work-title" className="display max-w-[16ch] text-[clamp(2.4rem,7.4vw,8.4rem)] leading-[0.98]">
          Some things we&apos;ve been <span className="serif-i text-signal text-[1.08em]">busy</span> making.
        </h2>
      </div>

      {/* Kalrav — viewfinder frame */}
      <Link href="/work" data-cursor="View" className="wk-frame relative mt-14 block aspect-[4/5] w-full overflow-hidden bg-[#0d0420] text-paper sm:aspect-[16/10] md:aspect-[16/9]">
        <div className="wk-art absolute inset-0 origin-center will-change-transform">
          <div className="absolute inset-0" style={{ background: "radial-gradient(60% 70% at 50% 50%, #8e63ff 0%, #4a22d9 38%, #1a0640 75%, #0d0420 100%)" }} />
          <svg viewBox="-200 -200 400 400" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
            {RINGS.map((ring) => (
              <g
                key={ring.r}
                className="wk-ring"
                style={{ animation: `wk-spin ${ring.d}s linear infinite ${ring.dir < 0 ? "reverse" : ""}` }}
              >
                <circle r={ring.r} fill="none" stroke="#f1eaff" strokeOpacity="0.85" strokeWidth={ring.w} strokeLinecap="round" strokeDasharray={ring.dash} />
              </g>
            ))}
          </svg>
          <div className="grain absolute inset-0 overflow-hidden" aria-hidden />
        </div>

        <div className="absolute inset-0 grid place-items-center">
          <p className="display text-center text-[clamp(3.4rem,15vw,15rem)] leading-[0.82] text-paper">
            KAL<br className="sm:hidden" />RAV
          </p>
        </div>

        <div className="pointer-events-none absolute inset-[var(--pad)] text-paper/85" aria-hidden>
          <i className="vf vf-tl" />
          <i className="vf vf-tr" />
          <i className="vf vf-bl" />
          <i className="vf vf-br" />
          <span className="mono absolute left-4 top-3 flex items-center gap-2"><i className="rec" /> Rec — {kalrav.projectName}</span>
          <span className="mono absolute bottom-3 left-4">{kalrav.categories.join(" · ")}</span>
          <span className="mono absolute bottom-3 right-4 hidden sm:block">Bhopal · {kalrav.year}</span>
        </div>
        <style>{`@keyframes wk-spin{to{transform:rotate(360deg)}}.wk-ring{transform-origin:0 0;transform-box:view-box}@media (prefers-reduced-motion:reduce){.wk-ring{animation:none!important}}`}</style>
      </Link>

      <div className="px-[var(--pad)]">
        <p className="serif-i mt-10 max-w-[28ch] text-[clamp(1.6rem,3vw,2.8rem)] leading-[1.1]">{kalrav.tagline}</p>

        <dl className="wk-facts mt-12 grid gap-x-8 gap-y-10 border-t border-ink/15 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {FACTS.map((f) => (
            <div key={f.k} className="wk-fact">
              <dt className="mono mb-3 text-signal">{f.k}</dt>
              <dd className="text-[0.95rem] leading-relaxed text-ink/75">{f.v}</dd>
            </div>
          ))}
        </dl>

        <ul className="mt-14 grid gap-6 border-t border-ink/15 pt-10 sm:grid-cols-3">
          {[
            { to: 130, suffix: "K+", label: "Music video views" },
            { to: 31, suffix: "K+", label: "Campaign views" },
            { to: 100, suffix: "%", label: "Tickets sold" },
          ].map((s) => (
            <li key={s.label}>
              <CountUp to={s.to} suffix={s.suffix} className="display block text-[clamp(3.4rem,8vw,8rem)] leading-none" />
              <p className="mono mt-2 text-ink/55">{s.label}</p>
            </li>
          ))}
        </ul>

        {/* Unexposed frames */}
        <div className="mono mb-6 mt-[clamp(5rem,9vw,9rem)] flex items-center justify-between text-ink/55">
          <span>Contact sheet — next frames</span>
          <span className="hidden sm:block">Not yet exposed</span>
        </div>
        <ul className="wk-uns grid gap-4 md:grid-cols-3">
          {UNEXPOSED.map((u) => (
            <li key={u.n} className="wk-un">
              <Link
                href="/contact"
                data-cursor="Develop"
                className="group relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-[10px] border border-ink/25 bg-ink p-5 text-paper transition-colors duration-700 hover:border-signal"
              >
                <span aria-hidden className="absolute inset-0 translate-y-full bg-signal transition-transform duration-[900ms] ease-[var(--ease)] group-hover:translate-y-0" />
                <span aria-hidden className="absolute inset-x-0 top-0 h-3 opacity-40 [background:repeating-linear-gradient(90deg,transparent_0_10px,rgba(255,255,255,.7)_10px_18px)]" />
                <span aria-hidden className="absolute inset-x-0 bottom-0 h-3 opacity-40 [background:repeating-linear-gradient(90deg,transparent_0_10px,rgba(255,255,255,.7)_10px_18px)]" />
                <span className="mono relative z-10 mt-4 flex justify-between group-hover:text-paper">
                  <span>Frame {u.n}</span>
                  <span>Unexposed</span>
                </span>
                <span className="relative z-10 mb-3">
                  <span className="display block text-[clamp(1.8rem,2.8vw,2.8rem)] group-hover:text-paper">{u.kind}</span>
                  <span className="serif-i mt-2 block text-xl text-paper/70 group-hover:text-paper">{u.note}</span>
                  <span className="mono mt-5 block group-hover:text-paper">Develop this frame →</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
