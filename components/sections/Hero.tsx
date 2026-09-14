"use client";

/**
 * Hero — components/sections/Hero.tsx
 *
 * Full-screen cinematic hero.
 * - MoltenMetal WebGL shader background
 * - MaskedHeading: SVG clip-path headline filled with nebula gradient
 * - Editorial left-aligned layout with proper spacing
 */

import { useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import MaskedHeading from "@/components/ui/MaskedHeading";
import { cn } from "@/lib/cn";

const MoltenMetal = dynamic(() => import("@/components/ui/MoltenMetal"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[var(--bg-base)]" />,
});

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.timeline({ delay: 0.4 })
        .from(".h-eyebrow", {
          opacity: 0, y: 10, duration: 0.55, ease: "power3.out",
        })
        .from(".h-sub", {
          opacity: 0, y: 16, duration: 0.6, ease: "power3.out",
        }, "+=0.8")           // wait for heading rise to finish
        .from(".h-cta-row", {
          opacity: 0, y: 12, duration: 0.5, ease: "power3.out",
        }, "-=0.35")
        .from(".h-meta", {
          opacity: 0, duration: 0.7,
        }, "-=0.2");
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen flex flex-col overflow-hidden"
      aria-label="Hero"
    >
      {/* ── WebGL Background ─────────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <MoltenMetal
          color1="#5227FF"
          color2="#FF9FFC"
          color3="#FFFFFF"
          speed={0.35}
          scale={4}
          detail={3}
          glow={1.6}
          coreSize={0.1}
          swirl={1}
          fold={-0.2}
          blackPoint={0.05}
          brightness={1.3}
          colorMode="molten"
          grain
          grainIntensity={0.05}
          mouseInteraction={false}
          mouseStrength={0}
          opacity={1}
          lightMode={false}
        />
      </div>

      {/* ── Gradient overlay ─────────────────────────────────────── */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: `linear-gradient(
            160deg,
            rgba(4,4,10,0.78) 0%,
            rgba(4,4,10,0.30) 45%,
            rgba(4,4,10,0.08) 65%,
            rgba(4,4,10,0.78) 100%
          )`,
        }}
      />

      {/* ── Centred content block ─────────────────────────────────── */}
      <div className="relative z-20 flex-1 flex items-center">
        <div className="w-full max-w-[1440px] mx-auto px-8 sm:px-16 lg:px-24 xl:px-32">

          {/* Eyebrow */}
          <div className="h-eyebrow flex items-center gap-4 mb-10">
            <div className="w-8 h-px bg-gradient-to-r from-[#5227FF] to-[#FF9FFC]" />
            <span className="font-secondary font-semibold text-[10px] uppercase tracking-[0.28em] text-[#FF9FFC]">
              360° Creative Marketing
            </span>
          </div>

          {/* ── Masked headline ───────────────────────────────────── */}
          {/*   Line 1 */}
          <MaskedHeading
            text="WE CREATE WHAT"
            tag="h1"
            src="/images/hero-text-fill.jpg"
            mediaType="image"
            fillScale={1.3}
            parallax={20}
            drift={14}
            brightness={1.1}
            saturation={1.2}
            reveal="rise"
            trigger="mount"
            duration={1.0}
            stagger={0.08}
            align="left"
            weight={800}
            tracking={-0.03}
            lineHeight={0.9}
            textScale={0.1}
            className="font-primary mb-1"
          />

          {/*   Line 2 */}
          <MaskedHeading
            text="PEOPLE REMEMBER."
            tag="span"
            src="/images/hero-text-fill.jpg"
            mediaType="image"
            fillScale={1.3}
            parallax={20}
            drift={14}
            brightness={1.1}
            saturation={1.2}
            reveal="rise"
            trigger="mount"
            duration={1.0}
            stagger={0.08}
            align="left"
            weight={800}
            tracking={-0.03}
            lineHeight={0.9}
            textScale={0.1}
            className="font-primary mb-10 block"
          />

          {/* ── Supporting copy + rule ────────────────────────────── */}
          <div className="flex items-start gap-6 mb-10">
            <div className="w-px h-14 bg-gradient-to-b from-[#5227FF] to-[#FF9FFC] shrink-0 mt-1 opacity-70" />
            <p
              className={cn(
                "h-sub font-secondary font-light",
                "text-[clamp(0.875rem,1.1vw,1rem)]",
                "leading-[1.8] text-[var(--text-secondary)]",
                "max-w-xs"
              )}
            >
              CREOIT is a collective of creative thinkers, strategists,
              marketers and makers — helping brands become impossible to ignore.
            </p>
          </div>

          {/* ── CTAs ─────────────────────────────────────────────── */}
          <div className="h-cta-row flex flex-wrap items-center gap-4">
            <Link
              href="/contact"
              className={cn(
                "group inline-flex items-center gap-3",
                "font-secondary font-semibold text-[10px] uppercase tracking-[0.22em]",
                "px-8 py-[15px]",
                "bg-[#5227FF] text-white",
                "border border-[#5227FF]",
                "hover:bg-[#FF9FFC] hover:border-[#FF9FFC] hover:text-[#04040a]",
                "transition-all duration-300 shadow-[0_0_28px_rgba(82,39,255,0.45)]"
              )}
            >
              Let&apos;s Create
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>

            <Link
              href="/work"
              className={cn(
                "group inline-flex items-center gap-3",
                "font-secondary font-semibold text-[10px] uppercase tracking-[0.22em]",
                "px-8 py-[15px]",
                "bg-transparent text-[var(--text-primary)]",
                "border border-[rgba(255,255,255,0.14)]",
                "hover:border-[#FF9FFC] hover:text-[#FF9FFC]",
                "transition-all duration-300"
              )}
            >
              Explore Work
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>

        </div>
      </div>

      {/* ── Bottom meta bar ───────────────────────────────────────── */}
      <div
        className={cn(
          "h-meta relative z-20",
          "max-w-[1440px] mx-auto w-full",
          "px-8 sm:px-16 lg:px-24 xl:px-32 pb-8",
          "flex items-end justify-between"
        )}
      >
        <span className="font-secondary text-[9px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
          Est. 2024
        </span>

        <div className="flex flex-col items-center gap-2">
          <span className="font-secondary text-[9px] uppercase tracking-[0.3em] text-[var(--text-muted)]">
            Scroll
          </span>
          <div
            className="w-px h-8 bg-gradient-to-b from-[rgba(255,255,255,0.3)] to-transparent"
            style={{ animation: "h-pulse 2.2s ease-in-out infinite" }}
          />
        </div>

        <span className="font-secondary text-[9px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
          India — Worldwide
        </span>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `@keyframes h-pulse { 0%,100%{opacity:.2} 50%{opacity:.9} }`,
      }} />
    </section>
  );
}

export default Hero;
