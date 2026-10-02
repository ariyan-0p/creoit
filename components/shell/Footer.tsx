"use client";

/**
 * Footer — fixed underneath the page and uncovered as <main> scrolls away
 * (the "curtain" reveal). Height is driven by --footer-h in Shell.
 */

import Link from "next/link";
import { NAV_LINKS, SOCIALS, EMAIL } from "@/lib/site";
import { Clock } from "./Clock";

export function Footer() {
  return (
    <footer
      className="fixed inset-x-0 bottom-0 z-0 flex flex-col justify-between overflow-hidden bg-deep px-[var(--pad)] pb-16 pt-24 md:pb-20 text-paper"
      style={{ height: "var(--footer-h)" }}
    >
      <div className="flex items-start justify-between gap-8">
        <div className="min-w-0">
          <p className="mono mb-6 flex items-center gap-3 text-dim">
            <i className="rec" /> Next frame is yours
          </p>
          <Link href="/contact" data-cursor="Talk" className="group block">
            <h2 className="display text-[clamp(2.4rem,8.2vw,9rem)]">
              Let&apos;s make
              <br />
              something{" "}
              <span className="whitespace-nowrap">
                <span className="serif-i text-lilac">unforgettable</span>
                <span className="inline-block translate-y-[0.04em] pl-[0.12em] text-lilac transition-transform duration-700 group-hover:translate-x-3">
                  →
                </span>
              </span>
            </h2>
          </Link>
        </div>

        {/* a small, quiet call to action for the empty right side (desktop only) */}
        <div className="hidden shrink-0 flex-col items-center gap-4 pt-8 md:flex">
          <Link
            href="/contact"
            data-cursor="Talk"
            aria-label="Start a project — go to the contact form"
            className="group relative block aspect-square w-[clamp(8rem,12vw,12.5rem)] text-paper"
          >
            <svg viewBox="-100 -100 200 200" className="absolute inset-0 h-full w-full" aria-hidden>
              <defs>
                <path id="tb-ring" d="M0 -76 a76 76 0 1 1 0 152 a76 76 0 1 1 0 -152" />
              </defs>
              <g className="tb-spin">
                <text className="mono" fill="currentColor" fontSize="11.5" letterSpacing="3">
                  <textPath href="#tb-ring" textLength="468" lengthAdjust="spacing">
                    {"LET’S TALK ✺ START A PROJECT ✺ SAY HELLO ✺ "}
                  </textPath>
                </text>
              </g>
            </svg>
            <span className="absolute inset-[27%] grid place-items-center rounded-full bg-signal text-[clamp(1.4rem,2vw,2rem)] leading-none transition-[transform,background-color] duration-500 group-hover:scale-110 group-hover:bg-lilac group-hover:text-ink">
              <span className="transition-transform duration-500 group-hover:rotate-45">↗</span>
            </span>
          </Link>
          <p className="mono max-w-[18ch] text-center text-paper/55">Tell us what you&apos;re trying to build.</p>
        </div>
      </div>

      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="mono mb-3 text-dim">Email</p>
          <a href={`mailto:${EMAIL}`} className="serif-i u-link text-3xl">
            {EMAIL}
          </a>
          <p className="mono mt-6 text-dim">Bhopal, India — working worldwide</p>
        </div>

        <ul className="mono grid grid-cols-2 gap-x-8 gap-y-2 lg:col-span-5">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="u-link">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <ul className="mono flex flex-col gap-2 lg:col-span-3">
          {SOCIALS.map((s) => (
            <li key={s.href}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" className="u-link">
                {s.label} ↗
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="mono flex flex-wrap items-center justify-between gap-3 border-t border-paper/15 pt-5 text-dim">
        <span>© {new Date().getFullYear()} CREOIT. All frames reserved.</span>
        <span>
          Bhopal <Clock seconds />
        </span>
        <span>We create what people remember.</span>
      </div>
    </footer>
  );
}
