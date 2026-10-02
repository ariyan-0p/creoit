import type { Metadata } from "next";
import { PageMotion } from "@/components/ui/PageMotion";
import { PageHero } from "@/components/page/PageHero";
import { Pill } from "@/components/ui/Pill";

export const metadata: Metadata = {
  title: "About — We Are CREOIT",
  description:
    "CREOIT is a team-first creative and marketing organization. We believe great work is a team sport — built by strategists, designers, marketers, filmmakers and thinkers.",
};

const VALUES = [
  { n: "01", t: "Be consistent.", d: "Consistency builds trust." },
  { n: "02", t: "Be creative.", d: "Different thinking creates different results." },
  { n: "03", t: "Be loud.", d: "Good work deserves attention." },
];

const CRAFTS = ["Strategists", "Designers", "Marketers", "Filmmakers", "Thinkers"];

export default function AboutPage() {
  return (
    <PageMotion>
      <PageHero
        index="01"
        label="About"
        ring="Team first creative"
        title={
          <>
            We are <span className="serif-i text-lilac">CREOIT.</span>
          </>
        }
        lead="We built CREOIT because we believe good ideas deserve better execution."
      />

      {/* Belief */}
      <section data-nav="light" className="relative bg-paper px-[var(--pad)] py-[clamp(4rem,9vw,9rem)] text-ink">
        <p className="mono mb-8 flex justify-between text-ink/55" data-reveal>
          <span>Our belief</span>
          <span className="hidden sm:block">Why we work this way</span>
        </p>
        <h2 data-lines className="display max-w-[16ch] text-[clamp(2.4rem,7.2vw,8rem)] leading-[0.96]">
          Great work is a <span className="serif-i text-signal text-[1.08em]">team sport.</span>
        </h2>
        <p data-reveal className="mt-10 max-w-xl text-[1.08rem] leading-relaxed text-ink/75">
          Great work doesn&apos;t happen because one person is brilliant. It happens when different people bring different
          brilliance together.
        </p>

        <ul className="mt-[clamp(3rem,7vw,7rem)] border-t border-ink/15">
          {CRAFTS.map((c, i) => (
            <li
              key={c}
              data-reveal
              className="group flex items-baseline justify-between border-b border-ink/15 py-4 transition-[padding,color] duration-700 ease-[var(--ease)] hover:pl-6 hover:text-signal md:py-5"
            >
              <span className="display text-[clamp(2rem,5.6vw,6rem)] leading-none">{c}</span>
              <span className="mono text-ink/45">0{i + 1}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Values */}
      <section data-nav="dark" className="relative bg-deep px-[var(--pad)] py-[clamp(4rem,9vw,9rem)] text-paper">
        <p className="mono mb-10 flex justify-between text-paper/55" data-reveal>
          <span>Our values</span>
          <span className="hidden sm:block">Three rules, no exceptions</span>
        </p>
        <ul>
          {VALUES.map((v) => (
            <li
              key={v.n}
              data-reveal
              className="group relative -mx-[var(--pad)] overflow-hidden border-t border-paper/15 px-[var(--pad)] last:border-b"
            >
              <span aria-hidden className="absolute inset-0 origin-bottom scale-y-0 bg-signal transition-transform duration-[800ms] ease-[var(--ease)] group-hover:scale-y-100" />
              <div className="relative grid items-baseline gap-4 py-8 md:grid-cols-[6rem_1fr_auto] md:py-12">
                <span className="mono text-lilac group-hover:text-paper">{v.n}</span>
                <h3 className="display text-[clamp(2.6rem,9vw,10rem)] leading-[0.95]">{v.t}</h3>
                <p className="serif-i max-w-[14ch] text-[clamp(1.4rem,2.2vw,2.2rem)] leading-[1.1] text-paper/75 group-hover:text-paper">{v.d}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Closing */}
      <section data-nav="light" className="relative bg-paper px-[var(--pad)] py-[clamp(4rem,9vw,9rem)] text-ink">
        <h2 data-lines className="display max-w-[18ch] text-[clamp(2.2rem,6.2vw,7rem)] leading-[0.98]">
          Different people. Different skills. <span className="serif-i text-signal text-[1.08em]">One direction.</span>
        </h2>
        <p data-reveal className="mt-8 max-w-md text-[1.02rem] leading-relaxed text-ink/70">
          CREOIT is a team-first organization built around collaboration, creativity and shared growth.
        </p>
        <div data-reveal className="mt-10 flex flex-wrap gap-3">
          <Pill href="/careers" tone="signal" cursor="Join">
            Join the team
          </Pill>
          <Pill href="/work" tone="dark">
            See the work
          </Pill>
        </div>
      </section>
    </PageMotion>
  );
}
