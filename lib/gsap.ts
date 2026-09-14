/**
 * GSAP Registration — lib/gsap.ts
 *
 * Central place to import and register all GSAP plugins.
 * Import from here instead of directly from "gsap" to ensure
 * plugins are always registered before use.
 *
 * Usage:
 *   import { gsap, ScrollTrigger } from "@/lib/gsap";
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Flip } from "gsap/Flip";

// Register all plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Flip);
}

// Default GSAP config for the project
gsap.config({
  nullTargetWarn: false, // suppress warnings for null targets (SSR safety)
});

// Default ease used across the site
gsap.defaults({
  ease: "power3.out",
  duration: 0.8,
});

export { gsap, ScrollTrigger, ScrollToPlugin, Flip };
export default gsap;
