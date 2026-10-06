import type { Metadata } from "next";
import { PageMotion } from "@/components/ui/PageMotion";
import { PageHero } from "@/components/page/PageHero";
import { EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Careers — Join the CREOIT Team",
  description:
    "We're not looking for people to fill positions. We're looking for people who want to build something. Explore open roles at CREOIT.",
};

const ROLES = [
  { id: "social-media-exec", title: "Social Media Executive", type: "Full-time" },
  { id: "graphic-designer", title: "Graphic Designer", type: "Full-time" },
  { id: "video-editor", title: "Video Editor", type: "Full-time" },
  { id: "content-writer", title: "Content Writer", type: "Full-time" },
  { id: "videographer", title: "Videographer", type: "Freelance" },
];

const LIFE = [
  "Ideas are welcome.",
  "Everyone contributes.",
  "Good work gets noticed.",
  "Learning never stops.",
  "Collaboration comes first.",
  "We grow together.",
];

const apply = (role: string) =>
  `mailto:${EMAIL}?subject=${encodeURIComponent(`Application — ${role}`)}&body=${encodeURIComponent(
    `Hi CREOIT,\n\nI'd like to apply for the ${role} role.\n\nPortfolio / links:\n\nA line about me:\n`
  )}`;

export default function CareersPage() {
  return (
    <PageMotion>
      <PageHero
        index="05"
        label="Careers"
        title={
          <>
            We&apos;re building a <span className="serif-i text-lilac">team.</span>
          </>
        }
        lead="We're not just looking for people to fill positions. We're looking for people who want to build something."
      />

      <section data-nav="light" className="relative bg-paper px-[var(--pad)] py-[clamp(4rem,9vw,8rem)] text-ink">
        <p className="mono mb-8 flex justify-between text-ink/55" data-reveal>
          <span>Open positions</span>
          <span>{ROLES.length} roles</span>
        </p>
        <ul className="border-t border-ink/15">
          {ROLES.map((r, i) => (
            <li key={r.id} data-reveal className="border-b border-ink/15">
              <a
                href={apply(r.title)}
                data-cursor="Apply"
                className="group relative -mx-[var(--pad)] grid grid-cols-[2.5rem_1fr_auto] items-center gap-x-4 overflow-hidden px-[var(--pad)] py-6 md:grid-cols-[6rem_1fr_10rem_auto] md:py-8"
              >
                <span aria-hidden className="absolute inset-0 origin-left scale-x-0 bg-signal transition-transform duration-[800ms] ease-[var(--ease)] group-hover:scale-x-100" />
                <span className="mono relative text-ink/45 transition-colors group-hover:text-paper">0{i + 1}</span>
                <span className="display relative text-[clamp(1.8rem,4.6vw,4.8rem)] leading-none transition-colors duration-500 group-hover:text-paper">{r.title}</span>
                <span className="mono relative hidden text-ink/55 transition-colors group-hover:text-paper md:block">{r.type}</span>
                <span className="relative text-2xl transition-[transform,color] duration-500 group-hover:translate-x-2 group-hover:text-paper" aria-hidden>
                  →
                </span>
              </a>
            </li>
          ))}
        </ul>
        <p data-reveal className="mono mt-8 text-ink/60">
          Don&apos;t see your role?{" "}
          <a href={apply("Open application")} className="u-link text-ink">
            Tell us what you&apos;d build →
          </a>
        </p>
      </section>

      <section data-nav="dark" className="relative bg-deep px-[var(--pad)] py-[clamp(4rem,9vw,8rem)] text-paper">
        <p className="mono mb-8 text-paper/55" data-reveal>
          Life at CREOIT
        </p>
        <h2 data-lines className="display max-w-[14ch] text-[clamp(2.4rem,6.6vw,7rem)] leading-[0.96]">
          No big chairs. Just big <span className="serif-i text-lilac text-[1.08em]">responsibilities.</span>
        </h2>
        <ul className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-paper/15 bg-paper/15 sm:grid-cols-2 lg:grid-cols-3">
          {LIFE.map((l, i) => (
            <li key={l} data-reveal className="bg-deep p-7 transition-colors duration-500 hover:bg-signal md:p-9">
              <p className="mono mb-10 text-lilac">0{i + 1}</p>
              <p className="display text-[clamp(1.5rem,2.2vw,2.3rem)] leading-[1.05]">{l}</p>
            </li>
          ))}
        </ul>
      </section>
    </PageMotion>
  );
}
