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
      className="fixed inset-x-0 bottom-0 z-0 flex flex-col justify-between overflow-hidden bg-deep px-[var(--pad)] pb-11 pt-[4.5rem] md:pb-20 md:pt-24 text-paper"
      style={{ height: "var(--footer-h)" }}
    >
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:gap-8">
        <div className="min-w-0">
          <p className="mono mb-4 flex items-center gap-3 text-dim md:mb-6">
            <i className="rec" /> Next frame is yours
          </p>
          <Link href="/contact" data-cursor="Talk" className="group block">
            <h2 className="display text-[clamp(2.4rem,8.2vw,9rem)]">
              Let&apos;s make
              <br />
              something
              <br />
              <span className="whitespace-nowrap serif-i text-lilac">unforgettable</span>
            </h2>
          </Link>
        </div>

        {/* a small, quiet call to action: an arrow pointing the way, then the badge.
            centred in the empty space on desktop; its own row under the headline on phones */}
        <div className="flex w-full items-center justify-start gap-[clamp(1rem,3vw,3rem)] md:w-auto md:flex-1 md:justify-center md:self-center">
          <svg
            viewBox="0 0 160 40"
            className="tb-arrow w-[clamp(4.5rem,9vw,9.5rem)] text-lilac"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M4 20 H152 M132 4 L152 20 L132 36" />
          </svg>
          <div className="flex shrink-0 flex-col items-center gap-4">
          <Link
            href="/contact"
            data-cursor="Talk"
            aria-label="Start a project — go to the contact form"
            className="group relative block aspect-square w-[clamp(6.75rem,12vw,12.5rem)] text-paper [@media(max-height:760px)]:max-md:w-[6rem]"
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
          <p className="mono max-w-[18ch] text-center text-paper/55 max-md:hidden">Tell us what you&apos;re trying to build.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:gap-10 lg:grid-cols-12">
        <div className="col-span-2 sm:col-span-1 lg:col-span-4">
          <p className="mono mb-3 text-dim">Email</p>
          <a href={`mailto:${EMAIL}`} className="serif-i u-link text-[1.65rem] md:text-3xl">
            {EMAIL}
          </a>
          <p className="mono mt-4 text-dim md:mt-6 [@media(max-height:700px)]:hidden">Bhopal, India — working worldwide</p>
        </div>

        <ul className="mono grid grid-cols-1 gap-y-2 sm:grid-cols-2 sm:gap-x-8 lg:col-span-5">
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

      <div className="mono flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-paper/15 pt-4 text-dim md:gap-3 md:pt-5">
        <span>© {new Date().getFullYear()} CREOIT. All frames reserved.</span>
        <span className="max-md:[@media(max-height:700px)]:hidden">
          Bhopal <Clock seconds />
        </span>
        <span className="max-md:hidden">We create what people remember.</span>
      </div>
      {/* the credit: centred on its own line at the very bottom */}
      <p className="mono absolute inset-x-0 bottom-3 text-center text-dim md:bottom-5">
        Powered by{" "}
        <a
          href="https://ariyan-0p.github.io/Ariyan-portlio/"
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="Visit"
          className="u-link text-paper"
        >
          Ariyan Samal ↗
        </a>
      </p>
    </footer>
  );
}
