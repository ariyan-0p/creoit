"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";

/* ─────────────────────────────────────────────────────────────────
   CREOIT Preloader — definitive version
   ─────────────────────────────────────────────────────────────────
   What happens:
   1. White screen. Icon strip appears — fixed position, flipping fast.
   2. "CREOiT" (Inter 900, black, huge) rises SLOWLY from below.
   3. When "i" reaches the icon strip → both stay visible for 1.5 s.
   4. Everything slides UP → landing page.

   Why icons are a separate DOM element (not inside the word):
   — Inline absolute children of an inline-block span get 0 height
     when the text content is transparent, causing the icon to
     collapse and become invisible. A separate fixed div avoids
     all that complexity.

   Font-loading: we wait for document.fonts.ready before measuring,
   so Inter is definitely loaded and glyph metrics are correct.
   ───────────────────────────────────────────────────────────────── */

const ICONS = [
  { src: "/images/instagram.png",      alt: "Instagram" },
  { src: "/images/facebook.png",       alt: "Facebook"  },
  { src: "/images/twitter.png",        alt: "Twitter"   },
  { src: "/images/youtube%20(1).png",  alt: "YouTube"   },
  { src: "/images/linkedin%20(1).png", alt: "LinkedIn"  },
];

// Icon strip size in px — square, sized to feel proportional to the text
const STRIP_SIZE = 140; // px  (tweak if needed)
const STRIP_GAP  =   8; // px gap between strip bottom and "i" top

export default function Preloader({ onComplete }: { onComplete?: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const wordRef    = useRef<HTMLDivElement>(null);
  const iRef       = useRef<HTMLSpanElement>(null);
  const stripRef   = useRef<HTMLDivElement>(null);
  const iconEls    = useRef<(HTMLDivElement | null)[]>([]);
  const loopOn     = useRef(true);
  const curIdx     = useRef(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;

    /* ── wait for Inter to be fully loaded ───────────────────── */
    document.fonts.ready.then(() => {
      const overlay = overlayRef.current;
      const word    = wordRef.current;
      const iSpan   = iRef.current;
      const strip   = stripRef.current;
      if (!overlay || !word || !iSpan || !strip) return;

      /* ── 1. Measure "i" at its final (centred) position ─────── */
      gsap.set(word, { y: 0, opacity: 0 });  // invisible, at final pos

      const iR = iSpan.getBoundingClientRect(); // final viewport coords of "i"

      // Place strip centred on the "i" horizontally, just above it
      const stripLeft = iR.left + iR.width / 2 - STRIP_SIZE / 2;
      const stripTop  = iR.top - STRIP_SIZE - STRIP_GAP;

      gsap.set(strip, {
        left:    stripLeft,
        top:     stripTop,
        width:   STRIP_SIZE,
        height:  STRIP_SIZE,
        opacity: 1,         // show it
      });

      /* ── 2. Reset word to start below viewport ───────────────── */
      gsap.set(word, { y: "110vh", opacity: 1 });

      /* ── 3. Initialise icon positions ───────────────────────── */
      // Index 0: visible, at rest (y:0%). Others: above, hidden.
      iconEls.current.forEach((el, i) => {
        if (!el) return;
        gsap.set(el, {
          y:       i === 0 ? "0%"  : "-100%",
          opacity: i === 0 ? 1    : 0,
        });
      });

      /* ── 4. Fast vertical ticker loop ───────────────────────── */
      // Each flip: current slides DOWN (exits), next slides in from TOP.
      // Full cycle per icon ≈ 0.15 + 0.1 + 0.15 + 0.18 wait ≈ 0.58 s
      function tick() {
        if (!loopOn.current) return;
        const c  = iconEls.current[curIdx.current];
        const ni = (curIdx.current + 1) % ICONS.length;
        const n  = iconEls.current[ni];
        if (!c || !n) return;

        // Current exits downward
        gsap.to(c, { y: "100%", duration: 0.15, ease: "power2.in" });

        // Next enters from above
        gsap.set(n, { y: "-100%", opacity: 1 });
        gsap.to(n, {
          y: "0%",
          duration: 0.15,
          ease: "power2.out",
          delay: 0.1,
          onComplete: () => {
            curIdx.current = ni;
            if (loopOn.current) gsap.delayedCall(0.18, tick);
          },
        });
      }

      tick(); // start loop immediately

      /* ── 5. Main timeline ─────────────────────────────────────── */
      const tl = gsap.timeline();

      tl
        // Word rises VERY SLOWLY from below — 3.5 s ease-out
        .to(word, { y: 0, duration: 3.5, ease: "power2.out" })

        // Hold — icons keep flipping, word stays put — 1.5 s
        .to({}, { duration: 1.5 })

        // Stop loop
        .add(() => { loopOn.current = false; })

        // Preloader + strip slide UP → landing page
        .to([overlay, strip], {
          y: "-100vh",
          duration: 0.9,
          ease: "expo.inOut",
          onComplete: () => {
            setDone(true);
            onComplete?.();
          },
        });

      /* ── Cleanup ─────────────────────────────────────────────── */
      return () => {
        loopOn.current = false;
        tl.kill();
        gsap.killTweensOf([overlay, strip, word]);
        iconEls.current.forEach((el) => el && gsap.killTweensOf(el));
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (done) return null;

  return (
    <>
      {/*
        ── WHITE OVERLAY ─────────────────────────────────────────
        Full-screen white. overflow:hidden clips the rising word.
        Animates to y:-100vh on exit.
      */}
      <div
        ref={overlayRef}
        id="creoit-preloader"
        style={{
          position:        "fixed",
          inset:           0,
          zIndex:          9999,
          backgroundColor: "#ffffff",
          display:         "flex",
          alignItems:      "center",
          justifyContent:  "center",
          overflow:        "hidden",
        }}
      >
        {/*
          CREOiT — Inter 900, white bg, very large.
          opacity:0 until JS moves it to y:110vh and shows it.
        */}
        <div
          ref={wordRef}
          style={{
            display:       "flex",
            alignItems:    "baseline",
            fontFamily:    "'Inter', system-ui, sans-serif",
            fontSize:      "clamp(3rem, 20vw, 320px)",
            fontWeight:    900,
            lineHeight:    1,
            letterSpacing: "-0.04em",
            color:         "#000000",
            userSelect:    "none",
            whiteSpace:    "nowrap",
            opacity:       0,   // JS reveals it after positioning
          }}
        >
          <span>CREO</span>
          {/* "i" — ref so we can measure its final screen position */}
          <span ref={iRef}>i</span>
          <span>T</span>
        </div>
      </div>

      {/*
        ── ICON STRIP ────────────────────────────────────────────
        Completely separate from the overlay — NOT inside it.
        This means overflow:hidden on the overlay CANNOT clip it.
        position:fixed, sized/positioned by JS after font loads.
        overflow:hidden clips icons that are sliding in/out.
        Animates to y:-100vh on exit (same as overlay).
      */}
      <div
        ref={stripRef}
        style={{
          position: "fixed",
          overflow: "hidden",
          opacity:  0,       // JS sets to 1 after measuring
          zIndex:   10000,   // above the overlay
          // left / top / width / height → set by JS
        }}
      >
        {ICONS.map((icon, i) => (
          <div
            key={icon.alt}
            ref={(el) => { iconEls.current[i] = el; }}
            style={{
              position: "absolute",
              inset:    0,
            }}
          >
            <Image
              src={icon.src}
              alt={icon.alt}
              fill
              style={{ objectFit: "contain" }}
              sizes="140px"
              priority={i === 0}
            />
          </div>
        ))}
      </div>
    </>
  );
}
