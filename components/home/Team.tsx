"use client";

/**
 * Team — "Different people. Different skills. One direction."
 *
 * An intro, then one full-screen card per team member, stacked like a deck:
 * each card sticks to the top and the next one slides over it while the old
 * card shrinks back, tilts and dims. As a card arrives its text rises in and
 * the portrait wipes open and sketches itself on.
 *
 * Until real names and photos exist (content/team.ts), each card shows the role
 * as its title and an honest "portrait developing" frame. Add a name/photo and
 * the card switches automatically.
 */

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { team } from "@/content/team";
import { Pill } from "@/components/ui/Pill";
import { Portrait } from "@/components/ui/Portrait";

const MEMBERS = team;

const THEMES = [
  { bg: "bg-signal", text: "text-paper", nav: "dark", sub: "text-paper/80", chip: "border-paper/45 text-paper", frame: "bg-[#4a22d9] text-paper", accent: "text-ink", pill: "light" },
  { bg: "bg-ink", text: "text-paper", nav: "dark", sub: "text-paper/65", chip: "border-paper/25 text-paper/85", frame: "bg-deep text-lilac", accent: "text-lilac", pill: "signal" },
  { bg: "bg-paper", text: "text-ink", nav: "light", sub: "text-ink/70", chip: "border-ink/25 text-ink/80", frame: "bg-[#ece8f7] text-signal", accent: "text-signal", pill: "dark" },
  { bg: "bg-deep", text: "text-paper", nav: "dark", sub: "text-paper/65", chip: "border-paper/25 text-paper/85", frame: "bg-[#0d0420] text-lilac", accent: "text-lilac", pill: "signal" },
] as const;

export function Team() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // intro
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".tm-intro-in", {
          y: 46,
          opacity: 0,
          duration: 1.1,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: { trigger: ".tm-intro", start: "top 75%" },
        });
      });

      // the deck: every width, motion allowed, as long as a card can fit the screen
      // (very short screens, e.g. a phone held sideways, fall back to a normal scroll)
      mm.add("(min-height: 561px) and (prefers-reduced-motion: no-preference)", () => {
        const slides = gsap.utils.toArray<HTMLElement>(".tm-slide");

        slides.forEach((slide, i) => {
          const card = slide.querySelector<HTMLElement>(".tm-card")!;
          const dim = slide.querySelector<HTMLElement>(".tm-dim")!;
          const kids = gsap.utils.toArray<HTMLElement>(".tm-k", slide);
          const frame = slide.querySelector<HTMLElement>(".tm-frame");
          const draws = gsap.utils.toArray<SVGElement>(".pt-draw", slide);

          // the card recedes as the next one covers it
          const next = slides[i + 1];
          if (next) {
            gsap.to(card, {
              scale: 0.9,
              yPercent: -3,
              rotationX: 5,
              transformPerspective: 1400,
              transformOrigin: "50% 0%",
              ease: "none",
              scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true },
            });
            gsap.to(dim, {
              opacity: 0.6,
              ease: "none",
              scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true },
            });
          }

          // arrival: text rises, portrait wipes open, silhouette sketches on
          gsap.set(kids, { opacity: 0, y: 46 });
          if (frame) gsap.set(frame, { clipPath: "inset(0% 0% 100% 0% round 28px)" });
          gsap.set(draws, { strokeDasharray: 1, strokeDashoffset: 1 });

          const tl = gsap.timeline({ paused: true });
          tl.to(kids, { opacity: 1, y: 0, duration: 0.9, stagger: 0.09, ease: "power3.out" }, 0);
          if (frame) tl.to(frame, { clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 1.2, ease: "power3.inOut" }, 0.1);
          tl.to(draws, { strokeDashoffset: 0, duration: 1.1, stagger: 0.08, ease: "power2.inOut" }, 0.5);

          ScrollTrigger.create({
            trigger: slide,
            start: i === 0 ? "top 62%" : "top 72%",
            onEnter: () => tl.play(),
            onLeaveBack: () => tl.reverse(),
          });
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="team" aria-labelledby="team-title" className="relative z-10">
      {/* intro */}
      <div data-nav="light" className="tm-intro bg-paper px-[var(--pad)] pb-[clamp(3.5rem,7vw,6rem)] pt-[clamp(5rem,9vw,8rem)] text-ink">
        <p className="mono tm-intro-in mb-8 flex items-center justify-between text-ink/55">
          <span>[ 03 ] The team</span>
          <span className="hidden sm:block">{team.length} of us, up close</span>
        </p>
        <h2 id="team-title" className="tm-intro-in display max-w-[17ch] text-[clamp(2.4rem,6.6vw,7.2rem)] leading-[0.97]">
          Different people. Different skills. <span className="serif-i text-[1.08em] text-signal">One direction.</span>
        </h2>
        <div className="tm-intro-in mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Pill href="/team" tone="signal" cursor="Meet">
            See our whole team
          </Pill>
          <p className="max-w-xs text-[0.95rem] leading-relaxed text-ink/65">Scroll to meet the people behind what people remember.</p>
        </div>
      </div>

      {/* the deck */}
      <div>
        {MEMBERS.map((m, i) => {
          const th = THEMES[i % THEMES.length];
          const hasName = m.name !== "Team Member";
          const last = i === MEMBERS.length - 1;
          return (
            <div
              key={m.id}
              className="tm-slide sticky top-0 h-[100svh] [@media(max-height:560px)]:static [@media(max-height:560px)]:h-auto"
              style={{ zIndex: i + 1 }}
            >
              <article
                data-nav={th.nav}
                aria-label={`${hasName ? m.name : m.role}, ${m.role}`}
                className={`tm-card relative flex h-full flex-col justify-between overflow-hidden rounded-t-[1.75rem] px-[var(--pad)] pb-6 pt-[5.25rem] md:pb-[clamp(4.5rem,7vw,5.75rem)] md:pt-[clamp(5.5rem,8vw,7rem)] [@media(max-height:560px)]:h-auto [@media(max-height:560px)]:min-h-[100svh] ${th.bg} ${th.text}`}
              >
                <div aria-hidden className="tm-dim pointer-events-none absolute inset-0 z-20 bg-ink opacity-0" />

                {/* a dot indicator showing which of the four you're on (stacked layouts) */}
                <div aria-hidden className="absolute right-3 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-2 lg:hidden">
                  {MEMBERS.map((_, k) => (
                    <i key={k} className={`block w-1.5 rounded-full bg-current ${k === i ? "h-5" : "h-1.5 opacity-30"}`} />
                  ))}
                </div>

                <div className={`mono tm-k flex items-center justify-between ${th.sub}`}>
                  <span>{hasName ? m.role : `Team member 0${i + 1}`}</span>
                  <span>
                    0{i + 1} / 0{MEMBERS.length}
                  </span>
                </div>

                <div className="flex min-h-0 flex-1 flex-col gap-4 pt-4 lg:grid lg:flex-none lg:grid-cols-[minmax(0,44rem)_auto] lg:items-end lg:justify-center lg:gap-x-[clamp(3rem,6vw,7rem)] lg:pt-0">
                  <div>
                    <h3 className="tm-k display max-w-[12ch] text-[clamp(2rem,9.4vw,3.2rem)] leading-[0.95] md:text-[clamp(2.6rem,6.4vw,7rem)]">
                      {hasName ? m.name : m.role}
                    </h3>
                    {m.quote && (
                      <p className={`tm-k serif-i mt-3 max-w-[26ch] text-[1.2rem] leading-[1.1] md:mt-5 md:text-[clamp(1.4rem,2.6vw,2.5rem)] ${th.accent}`}>
                        &ldquo;{m.quote}&rdquo;
                      </p>
                    )}
                    {/* on short phones the bio steps aside so the card still fits one screen */}
                    <p
                      className={`tm-k mt-3 line-clamp-2 max-w-md text-[0.88rem] leading-relaxed max-md:[@media(max-height:700px)]:hidden md:mt-5 md:line-clamp-none md:text-[1rem] ${th.sub}`}
                    >
                      {m.bio}
                    </p>

                    {m.craft && (
                      <ul className="mono mt-3 flex max-w-xl flex-wrap gap-1.5 md:mt-5 md:gap-2">
                        {m.craft.map((c) => (
                          <li key={c} className={`tm-k rounded-full border px-3 py-1 md:py-1.5 ${th.chip}`}>
                            {c}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="tm-k mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 md:mt-7">
                      {last ? (
                        <Pill href="/team" tone={th.pill} cursor="Meet">
                          See our whole team
                        </Pill>
                      ) : (
                        <Link href="/work" data-cursor="View" className={`mono u-link ${th.text}`}>
                          See the work →
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* stacked (phones, iPad portrait): the portrait takes all the free height above the text. side by side from lg, and big */}
                  <div className="relative order-first min-h-[26svh] flex-1 lg:order-none lg:min-h-0 lg:flex-none [@media(max-height:560px)]:h-[78svh]">
                    <div className="absolute inset-0 lg:static">
                      <Portrait
                        photo={m.photo}
                        label={hasName ? m.name : m.role}
                        className={`tm-frame h-full w-full rounded-[1.5rem] lg:aspect-[4/5] lg:h-auto lg:w-[min(36vw,34rem)] lg:max-h-[72svh] lg:rounded-[1.75rem] ${th.frame}`}
                      />
                    </div>
                  </div>
                </div>
              </article>
            </div>
          );
        })}
      </div>
    </section>
  );
}
