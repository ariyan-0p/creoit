"use client";

import type { ReactNode } from "react";
import { Preloader } from "./Preloader";
import { Cursor } from "./Cursor";
import { Nav } from "./Nav";
import { Footer } from "./Footer";

/**
 * Shell — persistent chrome. <main> sits above a fixed footer and carries a
 * bottom margin equal to the footer's height, so the footer is "uncovered".
 */
export function Shell({ children }: { children: ReactNode }) {
  return (
    <div>
      <style>{`@keyframes pl-failsafe{to{visibility:hidden}}#preloader{animation:pl-failsafe 0s 12s forwards}`}</style>
      <Preloader />
      <Cursor />
      <Nav />
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
