"use client";

/** Bottom-left scroll readout styled as a frame counter. Writes to the DOM directly — no React renders on scroll. */

import { useEffect, useRef } from "react";
import { useLenis } from "@/providers/SmoothScrollProvider";

export function ScrollHud() {
  const out = useRef<HTMLSpanElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    const update = (scroll: number, limit: number) => {
      const p = limit > 0 ? Math.min(1, Math.max(0, scroll / limit)) : 0;
      if (out.current) out.current.textContent = String(Math.round(p * 100)).padStart(3, "0");
      if (fill.current) fill.current.style.transform = `scaleY(${p})`;
    };

    if (lenis) {
      const on = (l: { scroll: number; limit: number }) => update(l.scroll, l.limit);
      lenis.on("scroll", on);
      on(lenis);
      return () => lenis.off("scroll", on);
    }

    const native = () =>
      update(window.scrollY, document.documentElement.scrollHeight - window.innerHeight);
    window.addEventListener("scroll", native, { passive: true });
    native();
    return () => window.removeEventListener("scroll", native);
  }, [lenis]);

  return (
    <div
      aria-hidden="true"
      className="mono pointer-events-none fixed bottom-5 left-[var(--pad)] z-[140] hidden items-center gap-3 nav-fg md:flex"
    >
      <span className="relative block h-10 w-px bg-current/30">
        <span ref={fill} className="absolute inset-0 origin-top scale-y-0 bg-current" />
      </span>
      <span>
        Frame <span ref={out}>000</span>/100
      </span>
    </div>
  );
}
