import type { Metadata } from "next";
import { PageTransition } from "@/components/layout/PageTransition";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "About — We Are CREOIT",
  description:
    "CREOIT is a team-first creative and marketing organization. We believe great work is a team sport — built by strategists, designers, marketers, filmmakers and thinkers.",
};

const values = [
  {
    number: "01",
    title: "BE CONSISTENT.",
    description: "Consistency builds trust.",
  },
  {
    number: "02",
    title: "BE CREATIVE.",
    description: "Different thinking creates different results.",
  },
  {
    number: "03",
    title: "BE LOUD.",
    description: "Good work deserves attention.",
  },
];

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="bg-[var(--creoit-black)]">
        {/* Hero */}
        <section className="section min-h-screen pt-32 flex flex-col justify-end" aria-labelledby="about-heading">
          <div className="container">
            <p className="section-label">About</p>
            <AnimatedText
              text="WE ARE CREOIT."
              as="h1"
              id="about-heading"
              splitBy="word"
              delay={0.1}
              stagger={0.08}
              className="font-display font-bold text-[var(--creoit-off-white)] mb-8"
            />
            <p className="font-body text-lg text-[var(--creoit-grey-light)] max-w-xl leading-relaxed">
              We built CREOIT because we believe good ideas deserve better
              execution.
            </p>
          </div>
        </section>

        {/* Belief */}
        <section className="section bg-[var(--creoit-dark)]">
          <div className="container">
            <div className="max-w-3xl">
              <p className="section-label">Our Belief</p>
              <AnimatedText
                text="GREAT WORK IS A TEAM SPORT."
                as="h2"
                splitBy="word"
                delay={0}
                stagger={0.05}
                className="font-display font-bold text-[var(--creoit-off-white)] mb-8"
              />
              <p className="font-body text-[var(--creoit-grey-light)] leading-relaxed">
                Great work doesn&apos;t happen because one person is brilliant.
                It happens when different people bring different brilliance
                together.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="section" aria-labelledby="values-heading">
          <div className="container">
            <p className="section-label">Our Values</p>
            <h2 id="values-heading" className="sr-only">CREOIT Values</h2>
            <div className="flex flex-col gap-0 divide-y divide-[var(--border)] max-w-3xl">
              {values.map((value) => (
                <div key={value.number} className="py-8 flex items-start gap-8">
                  <span className="font-display text-xs text-[var(--creoit-grey-mid)] mt-1">{value.number}</span>
                  <div>
                    <h3 className="font-display font-bold text-2xl md:text-3xl text-[var(--creoit-off-white)] mb-2">
                      {value.title}
                    </h3>
                    <p className="font-body text-[var(--creoit-grey-light)]">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team CTA */}
        <section className={cn("section bg-[var(--creoit-dark)]")}>
          <div className="container text-center">
            <AnimatedText
              text="DIFFERENT PEOPLE. DIFFERENT SKILLS. ONE DIRECTION."
              as="h2"
              splitBy="word"
              delay={0}
              stagger={0.04}
              className="font-display font-bold text-[var(--creoit-off-white)] mb-6 max-w-3xl mx-auto"
            />
            <p className="font-body text-[var(--creoit-grey-light)] max-w-lg mx-auto">
              {/* TODO: Add team members section when photos are ready */}
              CREOIT is a team-first organization built around collaboration,
              creativity and shared growth.
            </p>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
