import type { ReactNode } from "react";
import { LensRing } from "@/components/ui/LensRing";

/**
 * PageHero — shared inner-page opener. Dark, viewfinder-framed, with the
 * lens-ring motif. `title` is rendered inside <h1 data-lines>.
 */
export function PageHero({
  index,
  label,
  title,
  lead,
  ring,
  children,
}: {
  index: string;
  label: string;
  title: ReactNode;
  lead?: string;
  ring: string;
  children?: ReactNode;
}) {
  return (
    <section
      data-nav="dark"
      className="relative flex min-h-[88svh] flex-col justify-end overflow-hidden bg-ink px-[var(--pad)] pb-[clamp(3rem,7vw,6rem)] pt-40 text-paper"
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 60% at 82% 38%, rgba(106,61,255,0.5) 0%, rgba(106,61,255,0) 70%), radial-gradient(50% 50% at 8% 0%, rgba(20,0,33,0.95) 0%, rgba(20,0,33,0) 100%)",
        }}
      />
      <div className="grain absolute inset-0 overflow-hidden" aria-hidden />

      <LensRing
        text={ring}
        className="pointer-events-none absolute right-[-12vw] top-[12svh] w-[min(86vw,66svh)] opacity-90 md:right-[3vw] md:w-[min(42vw,72svh)]"
      />

      <div className="pointer-events-none absolute inset-x-[var(--pad)] bottom-[var(--pad)] top-[5.6rem] text-paper/40" aria-hidden>
        <i className="vf vf-tl" />
        <i className="vf vf-tr" />
        <i className="vf vf-bl" />
        <i className="vf vf-br" />
      </div>

      <div className="relative z-10 md:px-5">
        <p className="mono mb-8 flex items-center gap-4 text-paper/70" data-reveal>
          <i className="rec" />
          <span>
            [ {index} ] {label}
          </span>
        </p>
        <h1 data-lines className="display max-w-[14ch] text-[clamp(3rem,10.4vw,11.5rem)] leading-[0.92]">
          {title}
        </h1>
        {lead && (
          <p data-reveal className="mt-10 max-w-md text-[1rem] leading-relaxed text-paper/75">
            {lead}
          </p>
        )}
        {children && (
          <div data-reveal className="mt-8">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
