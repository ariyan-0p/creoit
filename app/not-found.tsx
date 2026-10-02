import Link from "next/link";
import { Pill } from "@/components/ui/Pill";

export default function NotFound() {
  return (
    <section data-nav="dark" className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink px-[var(--pad)] pb-[clamp(3rem,7vw,6rem)] pt-40 text-paper">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "radial-gradient(55% 60% at 70% 40%, rgba(106,61,255,0.45) 0%, rgba(106,61,255,0) 70%)" }}
      />
      <div className="grain absolute inset-0 overflow-hidden" aria-hidden />
      <div className="relative z-10">
        <p className="mono mb-8 flex items-center gap-3 text-paper/70">
          <i className="rec" /> Error 404
        </p>
        <h1 className="display max-w-[12ch] text-[clamp(3rem,11vw,12rem)] leading-[0.92]">
          Frame <span className="serif-i text-lilac">not found.</span>
        </h1>
        <p className="mt-8 max-w-md text-paper/75">This page slipped out of focus. Let&apos;s get you back to something worth remembering.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Pill href="/" tone="signal">
            Back home
          </Pill>
          <Pill href="/work" tone="light">
            See the work
          </Pill>
        </div>
        <Link href="/contact" className="mono u-link mt-10 inline-block text-paper/60">
          Or tell us what you were looking for
        </Link>
      </div>
    </section>
  );
}
