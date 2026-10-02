"use client";

/**
 * FrameVideo — background video for a project frame.
 * - Plays only while on screen (saves battery/bandwidth), muted + inline for autoplay.
 * - Fades in once it can actually play, so the art underneath shows until then.
 * - Reduced motion: shows the poster only, never autoplays.
 */

import { useEffect, useRef, useState } from "react";

export function FrameVideo({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.15 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      onCanPlay={() => setReady(true)}
      aria-hidden
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${ready || poster ? "opacity-100" : "opacity-0"}`}
    />
  );
}
