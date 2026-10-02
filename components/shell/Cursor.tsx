"use client";

/**
 * Cursor — dot + viewfinder ring. Only mounts on fine pointers.
 * Hover any [data-cursor="label"] to morph the ring into a labelled lens.
 */

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { bindPointer, pointer } from "@/lib/pointer";

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine || !dot.current || !ring.current) return;

    bindPointer();
    document.documentElement.classList.add("has-cursor");

    const dx = gsap.quickTo(dot.current, "x", { duration: 0.08, ease: "power3" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.08, ease: "power3" });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.5, ease: "power3" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.5, ease: "power3" });

    gsap.set([dot.current, ring.current], { xPercent: -50, yPercent: -50, x: pointer.x, y: pointer.y });

    const move = () => {
      dx(pointer.x);
      dy(pointer.y);
      rx(pointer.x);
      ry(pointer.y);
    };
    window.addEventListener("pointermove", move, { passive: true });

    const over = (e: PointerEvent) => {
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor],a,button");
      const text = t?.dataset.cursor;
      if (text) {
        if (label.current) label.current.textContent = text;
        gsap.to(ring.current, { width: 92, height: 92, backgroundColor: "#ffffff", borderColor: "#ffffff", duration: 0.45, ease: "expo.out" });
        gsap.to(label.current, { opacity: 1, duration: 0.25 });
        gsap.to(dot.current, { scale: 0, duration: 0.25 });
      } else if (t) {
        gsap.to(ring.current, { width: 64, height: 64, backgroundColor: "rgba(255,255,255,0)", borderColor: "#ffffff", duration: 0.45, ease: "expo.out" });
        gsap.to(label.current, { opacity: 0, duration: 0.15 });
        gsap.to(dot.current, { scale: 1, duration: 0.25 });
      } else {
        gsap.to(ring.current, { width: 34, height: 34, backgroundColor: "rgba(255,255,255,0)", borderColor: "#ffffff", duration: 0.45, ease: "expo.out" });
        gsap.to(label.current, { opacity: 0, duration: 0.15 });
        gsap.to(dot.current, { scale: 1, duration: 0.25 });
      }
    };
    window.addEventListener("pointerover", over, { passive: true });

    const leave = () => gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.2 });
    const enter = () => gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.2 });
    document.documentElement.addEventListener("pointerleave", leave);
    document.documentElement.addEventListener("pointerenter", enter);

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.documentElement.removeEventListener("pointerenter", enter);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[300] mix-blend-difference">
      <div
        ref={ring}
        className="fixed left-0 top-0 grid h-[34px] w-[34px] place-items-center rounded-full border border-white"
      >
        <span ref={label} className="mono text-[0.6rem] text-ink opacity-0" />
      </div>
      <div ref={dot} className="fixed left-0 top-0 h-[6px] w-[6px] rounded-full bg-white" />
    </div>
  );
}
