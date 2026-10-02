/**
 * GSAP registration — lib/gsap.ts
 * Single import point so plugins are always registered before use.
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Flip } from "gsap/Flip";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Flip, SplitText);
  if (process.env.NODE_ENV !== "production") (window as unknown as { gsap: typeof gsap }).gsap = gsap;
}

gsap.config({ nullTargetWarn: false });
gsap.defaults({ ease: "power3.out", duration: 0.8 });

export { gsap, ScrollTrigger, ScrollToPlugin, Flip, SplitText };
export default gsap;
