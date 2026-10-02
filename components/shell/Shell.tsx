"use client";

import type { ReactNode } from "react";
import { Preloader } from "./Preloader";
import { Cursor } from "./Cursor";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { ScrollHud } from "./ScrollHud";

/**
 * Shell — persistent chrome. <main> sits above a fixed footer and carries a
 * bottom margin equal to the footer's height, so the footer is "uncovered".
 */
export function Shell({ children }: { children: ReactNode }) {
  return (
    <div style={{ ["--footer-h" as string]: "max(100svh, 40rem)" }}>
      <style>{`@keyframes pl-failsafe{to{visibility:hidden}}#preloader{animation:pl-failsafe 0s 9s forwards}`}</style>
      <Preloader />
      <Cursor />
      <Nav />
      <ScrollHud />
      <main
        id="main"
        className="relative z-10 bg-ink"
        style={{ marginBottom: "var(--footer-h)" }}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
