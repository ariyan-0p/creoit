"use client";

/**
 * SmoothScrollProvider — providers/SmoothScrollProvider.tsx
 *
 * Wraps the app with Lenis smooth scroll, synchronized with GSAP's RAF loop.
 * This ensures GSAP ScrollTrigger and Lenis play well together without
 * duplicate requestAnimationFrame loops.
 *
 * Based on: https://lenis.darkroom.engineering/
 */

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { LENIS_OPTIONS } from "@/lib/lenis";

// ── Context ───────────────────────────────────────────────────────────────
interface SmoothScrollContextValue {
  lenis: Lenis | null;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  lenis: null,
});

export function useLenis() {
  return useContext(SmoothScrollContext).lenis;
}

// ── Provider ──────────────────────────────────────────────────────────────
interface SmoothScrollProviderProps {
  children: ReactNode;
}

export default function SmoothScrollProvider({
  children,
}: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Instantiate Lenis
    const lenis = new Lenis(LENIS_OPTIONS);
    lenisRef.current = lenis;

    // Sync Lenis scroll position with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Use GSAP ticker to drive Lenis RAF (single unified loop)
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000); // GSAP time is in seconds; Lenis needs ms
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0); // Disable lag smoothing for accuracy

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <SmoothScrollContext.Provider value={{ lenis: lenisRef.current }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
