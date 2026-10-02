"use client";

/**
 * Nav — blend-difference bar that tucks away on scroll-down, plus a
 * full-screen menu that opens like a shutter.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { NAV_LINKS, SOCIALS, EMAIL } from "@/lib/site";
import { useLenis } from "@/providers/SmoothScrollProvider";
import { Clock } from "./Clock";

export function Nav() {
  const bar = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const lenis = useLenis();

  // Build the open/close timeline once (inside a context so dev double-mount reverts cleanly).
  useEffect(() => {
    const el = menu.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.set(el, { clipPath: "inset(0 0 100% 0)", visibility: "hidden" });
      const t = gsap.timeline({ paused: true });
      t.set(el, { visibility: "visible" })
        .to(el, { clipPath: "inset(0 0 0% 0)", duration: 0.9, ease: "expo.inOut" })
        .from(".menu-link .menu-label", { yPercent: 110, duration: 0.9, stagger: 0.06, ease: "expo.out" }, 0.35)
        .from(".menu-meta", { opacity: 0, y: 14, duration: 0.6, stagger: 0.06 }, 0.6);
      t.eventCallback("onReverseComplete", () => {
        gsap.set(el, { visibility: "hidden" });
      });
      tl.current = t;
    }, el);
    return () => {
      ctx.revert();
      tl.current = null;
    };
  }, []);

  useEffect(() => {
    const t = tl.current;
    if (!t) return;
    if (open) {
      lenis?.stop();
      t.timeScale(1).play();
    } else {
      lenis?.start();
      t.timeScale(1.3).reverse();
    }
  }, [open, lenis]);

  // Menu state → html class (forces light-on-dark nav while the menu is open).
  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
  }, [open]);

  // Theme the nav + HUD by whichever [data-nav] section is visibly under the bar.
  // We ask the browser (elementsFromPoint) instead of relying on scroll-trigger events:
  // that stays correct with sticky/overlapping sections and through layout refreshes.
  useEffect(() => {
    const root = document.documentElement;
    let last = "";
    const update = () => {
      const els = document.elementsFromPoint(window.innerWidth / 2, 48);
      let theme = "dark";
      for (const e of els) {
        const s = (e as HTMLElement).closest?.<HTMLElement>("[data-nav]");
        if (s) {
          theme = s.dataset.nav ?? "dark";
          break;
        }
      }
      if (theme !== last) {
        last = theme;
        root.setAttribute("data-nav-theme", theme);
      }
    };
    update();
    const settle = [120, 600, 1800].map((ms) => window.setTimeout(update, ms));
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    lenis?.on("scroll", update);
    return () => {
      settle.forEach(window.clearTimeout);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      lenis?.off("scroll", update);
    };
  }, [pathname, lenis]);

  // Esc closes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Hide on scroll-down, return on scroll-up.
  useEffect(() => {
    if (!lenis || !bar.current) return;
    const y = gsap.quickTo(bar.current, "yPercent", { duration: 0.6, ease: "power3" });
    const onScroll = (l: { direction: number; scroll: number }) => {
      if (l.scroll < 120) y(0);
      else if (l.direction === 1) y(-120);
      else if (l.direction === -1) y(0);
    };
    lenis.on("scroll", onScroll);
    return () => lenis.off("scroll", onScroll);
  }, [lenis]);

  return (
    <>
      <header
        ref={bar}
        className="nav-fg pointer-events-none fixed inset-x-0 top-0 z-[160] flex items-center justify-between px-[var(--pad)] pt-5"
      >
        <Link href="/" aria-label="CREOIT — home" className="pointer-events-auto block" data-cursor="Home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo/creoit-logo-white.png" alt="CREOIT" width={1175} height={442} className="nav-logo h-11 w-auto" style={{ width: "auto" }} />
        </Link>

        <div className="mono pointer-events-none hidden items-center gap-3 md:flex">
          <i className="rec" />
          <span>Bhopal</span>
          <Clock />
        </div>

        <div className="pointer-events-auto flex items-center gap-3">
          <Link
            href="/contact"
            className="nav-btn mono hidden px-5 py-3 sm:block"
          >
            Let&apos;s talk
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="site-menu"
            className="nav-btn mono group flex items-center gap-3 px-5 py-3"
          >
            <span>{open ? "Close" : "Menu"}</span>
            <span className="relative block h-2 w-5">
              <span
                className="absolute left-0 top-0 h-px w-full bg-current transition-transform duration-500"
                style={{ transform: open ? "translateY(4px) rotate(45deg)" : "none" }}
              />
              <span
                className="absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-500"
                style={{ transform: open ? "translateY(-3px) rotate(-45deg)" : "none" }}
              />
            </span>
          </button>
        </div>
      </header>

      <div
        ref={menu}
        id="site-menu"
        role="dialog"
        aria-label="Site menu"
        className="fixed inset-0 z-[150] flex flex-col justify-between bg-deep px-[var(--pad)] pb-[var(--pad)] pt-28 text-paper"
      >
        <nav aria-label="Main">
          <ul className="group/list flex flex-col">
            {NAV_LINKS.map((l, i) => (
              <li
                key={l.href}
                className="border-b border-paper/10 transition-opacity duration-500 group-hover/list:opacity-30 hover:opacity-100!"
              >
                <Link href={l.href} onClick={() => setOpen(false)} className="menu-link flex items-baseline gap-5 overflow-hidden py-[0.6vh]" data-cursor="Go">
                  <span className="mono w-8 text-lilac">0{i + 1}</span>
                  <span className="menu-label display block text-[clamp(2.4rem,8.2vh,6.5rem)]">{l.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-8">
          <div className="menu-meta">
            <p className="mono mb-2 text-dim">Say hello</p>
            <a href={`mailto:${EMAIL}`} className="serif-i u-link text-3xl sm:text-4xl">
              {EMAIL}
            </a>
          </div>
          <ul className="menu-meta mono flex flex-wrap gap-x-6 gap-y-2">
            {SOCIALS.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="u-link">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
