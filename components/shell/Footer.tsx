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
      className="fixed inset-x-0 bottom-0 z-0 flex flex-col justify-between overflow-hidden bg-ink px-[var(--pad)] pb-16 pt-24 md:pb-20 text-paper"
      style={{ height: "var(--footer-h)" }}
    >
      <div>
        <p className="mono mb-6 flex items-center gap-3 text-dim">
          <i className="rec" /> Next frame is yours
        </p>
        <Link href="/contact" data-cursor="Talk" className="group block">
          <h2 className="display text-[clamp(2.4rem,8.2vw,9rem)]">
            Let&apos;s make
            <br />
            something{" "}
            <span className="whitespace-nowrap">
              <span className="serif-i text-signal">unforgettable</span>
              <span className="inline-block translate-y-[0.04em] pl-[0.12em] text-signal transition-transform duration-700 group-hover:translate-x-3">
                →
              </span>
            </span>
          </h2>
        </Link>
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
