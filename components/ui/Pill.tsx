import Link from "next/link";
import type { ReactNode } from "react";

/** Pill link — fills from below on hover. `tone` picks the colour pair. */
export function Pill({
  href,
  children,
  tone = "light",
  cursor,
}: {
  href: string;
  children: ReactNode;
  tone?: "light" | "dark" | "signal";
  cursor?: string;
}) {
  const tones = {
    light: "border-paper/60 text-paper before:bg-paper hover:text-ink",
    dark: "border-ink/60 text-ink before:bg-ink hover:text-paper",
    signal: "border-signal bg-signal text-paper before:bg-paper hover:border-paper hover:text-ink",
  } as const;

  return (
    <Link
      href={href}
      data-cursor={cursor}
      className={`mono group relative isolate inline-flex items-center gap-3 overflow-hidden rounded-full border px-7 py-4 transition-colors duration-500 before:absolute before:inset-0 before:-z-10 before:translate-y-[101%] before:rounded-[50%] before:transition-transform before:duration-700 before:ease-[var(--ease)] hover:before:translate-y-0 hover:before:rounded-none ${tones[tone]}`}
    >
      {children}
      <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">→</span>
    </Link>
  );
}
