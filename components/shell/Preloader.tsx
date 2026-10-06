"use client";

/**
 * Preloader — just the real CREOIT logo on white. Two moves: (1) the whole word
 * "creoit" writes itself on, left to right, as one piece; (2) the dot of the i is a round ticker
 * that flips through our social icons, then settles into a plain round purple dot. The full stop is a
 * matching round dot. (The logo art is cut into two files with both dots removed:
 * public/images/logo/pl-script.png and pl-it.png.)
 *
 * Exit: that dot is the lens. Purple floods out of it and swallows the page,
 * then an iris opens from the same point and reveals the site underneath
 * (the hero camera pushes in, the headline rises, the nav drops).
 *
 * Plays on every full page load (client-side navigation keeps the shell
 * mounted, so it doesn't replay). Reduced motion: a quick fade instead.
 */

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { markReady } from "@/lib/ready";
import { useLenis } from "@/providers/SmoothScrollProvider";

const ICONS = [
  { src: "/images/instagram.png", alt: "Instagram" },
  { src: "/images/facebook.png", alt: "Facebook" },
  { src: "/images/twitter.png", alt: "X" },
  { src: "/images/youtube%20(1).png", alt: "YouTube" },
  { src: "/images/linkedin%20(1).png", alt: "LinkedIn" },
];

/** logo geometry: the art is 1762x542; the i dot centre is at (75.6%, 6.7%), the full stop at (97.8%, 92.8%) */
const SCRIPT_W = (1277 / 1762) * 100;
/** the art has a 38px gap between the o and the i; the "it" slides left so they join */
const JOIN = (40 / 1762) * 100;

export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const curtain = useRef<HTMLDivElement>(null);
  const tile = useRef<HTMLDivElement>(null);
  const stop = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const el = sheet.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.style.overflow = "hidden";
    lenis?.stop();

    const finish = () => {
      document.documentElement.style.overflow = "";
      lenis?.start();
      setGone(true);
    };

    if (reduce) {
      markReady();
      const t = gsap.to(root.current, { opacity: 0, duration: 0.5, delay: 0.3, onComplete: finish });
      return () => {
        t.kill();
        document.documentElement.style.overflow = "";
      };
    }

    const ctx = gsap.context(() => {
      const icons = gsap.utils.toArray<HTMLElement>(".pl-icon");
      gsap.set(icons, { yPercent: -100 });
      gsap.set(icons[0], { yPercent: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, onComplete: finish });
      if (process.env.NODE_ENV !== "production" && new URLSearchParams(window.location.search).has("plseek")) {
        // dev-only: ?plseek pauses the timeline so the transition can be stepped through
        tl.pause();
        (window as unknown as { __plTl?: gsap.core.Timeline }).__plTl = tl;
      }

      // 1) the whole word writes itself on, left to right (the full stop pops in as it lands)
      tl.to(".pl-logo", { clipPath: "inset(-12% 0% -12% 0%)", duration: 1.6, ease: "power2.inOut" }, 0.15).fromTo(
        stop.current,
        { scale: 0 },
        { scale: 1, duration: 0.6, ease: "back.out(2.4)" },
        1.45
      );

      // round ticker pops in as the i's dot, flips fast through the icons
      tl.fromTo(tile.current, { scale: 0, opacity: 0, yPercent: -25 }, { scale: 1, opacity: 1, yPercent: -25, duration: 0.6, ease: "back.out(2)" }, 1.2);
      const FLIP = 0.2;
      const flips = 7;
      for (let k = 0; k < flips; k++) {
        const cur = icons[k % icons.length];
        const next = icons[(k + 1) % icons.length];
        const at = 1.5 + k * FLIP;
        tl.to(cur, { yPercent: 100, duration: FLIP * 0.8, ease: "power2.in" }, at).fromTo(
          next,
          { yPercent: -100 },
          { yPercent: 0, duration: FLIP * 0.8, ease: "power2.out" },
          at + FLIP * 0.2
        );
      }
      const settle = 1.5 + flips * FLIP + 0.1;
      // the icons fade and the ticker settles into a round purple dot, the twin of the full stop
      tl.to(icons, { opacity: 0, duration: 0.2, ease: "none" }, settle).to(
        tile.current,
        { scale: 0.47, yPercent: 0, duration: 0.7, ease: "elastic.out(1, 0.5)" },
        settle + 0.05
      );

      // ── exit: the dot becomes the lens ─────────────────────────────
      const iris = { grow: 0, hole: 0 };
      let cx = 0;
      let cy = 0;
      let far = 0;

      // 1) the dot breathes in
      tl.to(tile.current, { scale: 0.8, duration: 0.24, ease: "power2.out" }, settle + 0.72)
        // 2) purple floods out of the dot and swallows the page
        .call(
          () => {
            const bb = tile.current!.getBoundingClientRect();
            cx = bb.left + bb.width / 2;
            cy = bb.top + bb.height / 2;
            far = Math.hypot(Math.max(cx, window.innerWidth - cx), Math.max(cy, window.innerHeight - cy)) + 40;
            curtain.current!.style.clipPath = `circle(0px at ${cx}px ${cy}px)`;
          },
          undefined,
          settle + 0.9
        )
        .to(
          iris,
          {
            grow: 1,
            duration: 0.72,
            ease: "power3.inOut",
            onUpdate: () => {
              curtain.current!.style.clipPath = `circle(${(iris.grow * far).toFixed(1)}px at ${cx}px ${cy}px)`;
            },
          },
          settle + 0.9
        )
        // 3) an iris opens from the same point; the site is revealed underneath
        .call(
          () => {
            markReady();
            const r = root.current!;
            r.style.setProperty("--cx", `${cx}px`);
            r.style.setProperty("--cy", `${cy}px`);
            r.style.setProperty("--r", "0px");
            const mask = "radial-gradient(circle at var(--cx) var(--cy), transparent var(--r), #000 calc(var(--r) + 1px))";
            r.style.setProperty("-webkit-mask-image", mask);
            r.style.setProperty("mask-image", mask);
          },
          undefined,
          settle + 1.5
        )
        .to(
          iris,
          {
            hole: 1,
            duration: 1.05,
            ease: "expo.inOut",
            onUpdate: () => root.current!.style.setProperty("--r", `${(iris.hole * far).toFixed(1)}px`),
          },
          settle + 1.5
        );
    }, el);

    return () => {
      ctx.revert();
      document.documentElement.style.overflow = "";
    };
    // lenis arrives after first render; only stop/start is needed from it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gone) return null;

  return (
    <div ref={root} id="preloader" aria-hidden="true" className="fixed inset-0 z-[200]">
      <style>{`
        .pl-logo{clip-path:inset(-12% 100% -12% 0%)}
        .pl-stop{transform:scale(0)}
      `}</style>

      <div ref={sheet} className="absolute inset-0 grid place-items-center bg-paper px-[var(--pad)] text-ink">
        {/* the real logo: script + it, with the two dots drawn here so they can be round */}
        <div className="relative" style={{ width: "min(80vw, 60rem)", aspectRatio: "1762 / 542" }}>
          {/* the word is revealed as one piece, a wipe from left to right */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="pl-logo absolute inset-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo/pl-script.png" alt="" className="absolute left-0 top-0 h-full" style={{ width: `${SCRIPT_W}%` }} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo/pl-it.png" alt="" className="absolute top-0 h-full" style={{ left: `${SCRIPT_W - JOIN}%`, width: `${100 - SCRIPT_W}%` }} />
            </div>
          </div>

          {/* the ticker: a round badge where the dot of the i sits */}
          <div
            ref={tile}
            className="absolute aspect-square overflow-hidden rounded-full bg-signal opacity-0 shadow-[0_0_0_0.5vw_rgba(106,61,255,0.18)]"
            style={{ left: `${70.9 - JOIN}%`, top: "-8.5%", width: "9.4%" }}
          >
            {ICONS.map((ic) => (
              /* each slot is the FULL badge, so sliding ±100% moves the neighbour completely out of view */
              <div key={ic.alt} className="pl-icon absolute inset-0 grid place-items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ic.src} alt="" className="h-[50%] w-[50%] object-contain" style={{ filter: "brightness(0) invert(1)" }} />
              </div>
            ))}
          </div>

          {/* the full stop: a round purple dot, the twin of the settled ticker */}
          <div ref={stop} className="pl-stop absolute aspect-square rounded-full bg-signal" style={{ left: `${95.7 - JOIN}%`, top: "85.9%", width: "4.3%" }} />
        </div>
      </div>

      {/* purple flood: clipped to a circle that grows out of the dot */}
      <div ref={curtain} aria-hidden className="absolute inset-0 bg-signal" style={{ clipPath: "circle(0px at 50% 50%)" }} />
    </div>
  );
}
