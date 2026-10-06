import type { Metadata } from "next";
import Link from "next/link";
import { team } from "@/content/team";
import { PageMotion } from "@/components/ui/PageMotion";
import { PageHero } from "@/components/page/PageHero";
import { Portrait } from "@/components/ui/Portrait";
import { Pill } from "@/components/ui/Pill";

export const metadata: Metadata = {
  title: "Team — The people behind CREOIT",
  description:
    "Strategists, designers, filmmakers and marketers. Different people, different skills, one direction. Meet the CREOIT team.",
};

const FRAMES = ["bg-[#ece8f7] text-signal", "bg-deep text-lilac", "bg-[#4a22d9] text-paper", "bg-ink text-lilac"] as const;

export default function TeamPage() {
  return (
    <PageMotion>
      <PageHero
        index="07"
        label="The team"
        title={
          <>
            The <span className="serif-i text-lilac">people.</span>
          </>
        }
        lead="Different people. Different skills. One direction. These are the minds and hands behind the work."
      />

      <section data-nav="light" className="relative bg-paper px-[var(--pad)] py-[clamp(4rem,9vw,8rem)] text-ink">
        <p className="mono mb-10 flex justify-between text-ink/55" data-reveal>
          <span>{team.length} people</span>
          <span className="hidden sm:block">Bhopal, India</span>
        </p>

        <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m, i) => {
            const hasName = m.name !== "Team Member";
            return (
              <li key={m.id} data-reveal>
                <Portrait photo={m.photo} label={hasName ? m.name : m.role} className={`aspect-[4/5] w-full rounded-[1.4rem] ${FRAMES[i % FRAMES.length]}`} />
                <p className="mono mt-5 text-signal">{hasName ? m.role : `Team member 0${i + 1}`}</p>
                <h2 className="display mt-2 text-[clamp(1.7rem,2.4vw,2.6rem)] leading-[0.98]">{hasName ? m.name : m.role}</h2>
                {m.quote && <p className="serif-i mt-3 text-[1.25rem] leading-[1.15] text-ink/80">&ldquo;{m.quote}&rdquo;</p>}
                <p className="mt-3 text-[0.92rem] leading-relaxed text-ink/65">{m.bio}</p>
                {m.craft && (
                  <ul className="mono mt-4 flex flex-wrap gap-2">
                    {m.craft.map((c) => (
                      <li key={c} className="rounded-full border border-ink/25 px-3 py-1.5 text-ink/75">
                        {c}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section data-nav="dark" className="relative bg-deep px-[var(--pad)] py-[clamp(4rem,9vw,8rem)] text-paper">
        <h2 data-lines className="display max-w-[16ch] text-[clamp(2.2rem,6vw,6.5rem)] leading-[0.98]">
          Want to be on this <span className="serif-i text-lilac">page?</span>
        </h2>
        <p data-reveal className="mt-6 max-w-md text-paper/70">
          We&apos;re not looking for people to fill positions. We&apos;re looking for people who want to build something.
        </p>
        <div data-reveal className="mt-10 flex flex-wrap items-center gap-4">
          <Pill href="/careers" tone="signal" cursor="Join">
            See open roles
          </Pill>
          <Link href="/about" className="mono u-link text-paper/70">
            About CREOIT →
          </Link>
        </div>
      </section>
    </PageMotion>
  );
}
