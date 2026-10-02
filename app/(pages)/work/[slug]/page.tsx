import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/content/work";
import { PageMotion } from "@/components/ui/PageMotion";
import { CountUp } from "@/components/ui/CountUp";
import { MandalaFrame } from "@/components/ui/MandalaFrame";
import { Pill } from "@/components/ui/Pill";

const live = projects.filter((p) => p.description !== "Coming soon.");

export function generateStaticParams() {
  return live.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = live.find((x) => x.slug === slug);
  return p ? { title: `${p.projectName} — Case study`, description: p.tagline } : {};
}

/** "130K+" → { to: 130, suffix: "K+" } so figures can count up. */
function parse(value: string) {
  const m = value.match(/^(\d+)(.*)$/);
  return m ? { to: Number(m[1]), suffix: m[2] } : null;
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = live.find((x) => x.slug === slug);
  if (!p) notFound();

  const facts = [
    { k: "Challenge", v: p.challenge },
    { k: "Idea", v: p.idea },
    { k: "Execution", v: p.execution },
    { k: "Impact", v: p.impact },
  ].filter((f): f is { k: string; v: string } => Boolean(f.v));

  return (
    <PageMotion>
      <section data-nav="dark" className="relative h-[92svh] min-h-[560px] overflow-hidden bg-[#0d0420] text-paper">
        <MandalaFrame title={p.client} rec={p.projectName} left={p.categories.join(" · ")} right={`Bhopal · ${p.year}`} video={p.videoUrl} poster={p.posterUrl} />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/70 to-transparent" />
      </section>

      <section data-nav="light" className="relative bg-paper px-[var(--pad)] py-[clamp(4rem,9vw,8rem)] text-ink">
        <p className="mono mb-8 flex items-center justify-between text-ink/55" data-reveal>
          <Link href="/work" className="u-link">
            ← All work
          </Link>
          <span>{p.categories.join(" · ")}</span>
        </p>
        <h1 data-lines className="display max-w-[14ch] text-[clamp(2.6rem,8.4vw,9rem)] leading-[0.95]">
          {p.projectName}
        </h1>
        <p data-reveal className="serif-i mt-8 max-w-[24ch] text-[clamp(1.7rem,3.2vw,3.2rem)] leading-[1.08] text-signal">
          {p.tagline}
        </p>
        <p data-reveal className="mt-8 max-w-xl text-[1.02rem] leading-relaxed text-ink/75">
          {p.description}
        </p>

        <dl className="mt-[clamp(3rem,7vw,7rem)] grid gap-x-10 gap-y-12 border-t border-ink/15 pt-12 md:grid-cols-2">
          {facts.map((f, i) => (
            <div key={f.k} data-reveal>
              <dt className="mono mb-4 flex items-center gap-3 text-signal">
                <span>0{i + 1}</span>
                <span className="h-px w-8 bg-signal/60" />
                <span>{f.k}</span>
              </dt>
              <dd className="max-w-md text-[1.05rem] leading-relaxed text-ink/80">{f.v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {p.results && (
        <section data-nav="dark" className="relative bg-signal px-[var(--pad)] py-[clamp(4rem,9vw,8rem)] text-paper">
          <p className="mono mb-10" data-reveal>
            Results
          </p>
          <ul className="grid gap-10 sm:grid-cols-3">
            {p.results.map((r) => {
              const n = parse(r.value);
              return (
                <li key={r.label} data-reveal>
                  {n ? (
                    <CountUp to={n.to} suffix={n.suffix} className="display block text-[clamp(3.6rem,10vw,10rem)] leading-none" />
                  ) : (
                    <span className="display block text-[clamp(3.6rem,10vw,10rem)] leading-none">{r.value}</span>
                  )}
                  <p className="mono mt-3">{r.label}</p>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section data-nav="light" className="relative bg-paper px-[var(--pad)] py-[clamp(4rem,9vw,8rem)] text-ink">
        <p className="mono mb-6 text-ink/55" data-reveal>
          Next frame
        </p>
        <h2 data-lines className="display max-w-[16ch] text-[clamp(2.2rem,6vw,6.5rem)] leading-[0.98]">
          Your brand could be <span className="serif-i text-signal">next.</span>
        </h2>
        <div data-reveal className="mt-10 flex flex-wrap gap-3">
          <Pill href="/contact" tone="signal" cursor="Talk">
            Start a project
          </Pill>
          <Pill href="/work" tone="dark">
            All work
          </Pill>
        </div>
      </section>
    </PageMotion>
  );
}
