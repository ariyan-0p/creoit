import type { Metadata } from "next";
import Link from "next/link";
import { PageTransition } from "@/components/layout/PageTransition";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { cn } from "@/lib/cn";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers — Join the CREOIT Team",
  description:
    "We're not looking for people to fill positions. We're looking for people who want to build something. Explore open roles at CREOIT.",
};

const openings = [
  { id: "social-media-exec", title: "Social Media Executive", type: "Full-time" },
  { id: "graphic-designer", title: "Graphic Designer", type: "Full-time" },
  { id: "video-editor", title: "Video Editor", type: "Full-time" },
  { id: "content-writer", title: "Content Writer", type: "Full-time" },
  { id: "videographer", title: "Videographer", type: "Freelance" },
] as const;

const lifeAtCreoit = [
  "Ideas are welcome.",
  "Everyone contributes.",
  "Good work gets noticed.",
  "Learning never stops.",
  "Collaboration comes first.",
  "We grow together.",
];

export default function CareersPage() {
  return (
    <PageTransition>
      <div className="bg-[var(--creoit-black)]">
        {/* Hero */}
        <section className="section min-h-[60vh] pt-32 flex flex-col justify-end" aria-labelledby="careers-heading">
          <div className="container">
            <p className="section-label">Careers</p>
            <AnimatedText
              text="WE'RE BUILDING A TEAM."
              as="h1"
              id="careers-heading"
              splitBy="word"
              delay={0.1}
              stagger={0.07}
              className="font-display font-bold text-[var(--creoit-off-white)] mb-6"
            />
            <p className="font-body text-lg text-[var(--creoit-grey-light)] max-w-lg leading-relaxed">
              We&apos;re not just looking for people to fill positions. We&apos;re
              looking for people who want to build something.
            </p>
          </div>
        </section>

        {/* Open Positions */}
        <section className="section" aria-labelledby="openings-heading">
          <div className="container">
            <p className="section-label">Open Positions</p>
            <h2 id="openings-heading" className="sr-only">Open Positions</h2>
            <div className="flex flex-col divide-y divide-[var(--border)]">
              {openings.map((role) => (
                <div key={role.id} className="py-6 flex items-center justify-between group cursor-pointer hover:pl-2 transition-all duration-300">
                  <div>
                    <h3 className="font-display font-bold text-xl md:text-2xl text-[var(--creoit-off-white)] group-hover:text-[var(--creoit-accent)] transition-colors duration-300">
                      {role.title}
                    </h3>
                    <span className="font-body text-sm text-[var(--creoit-grey-light)]">{role.type}</span>
                  </div>
                  <ArrowRight
                    size={20}
                    className="text-[var(--creoit-grey-mid)] group-hover:text-[var(--creoit-accent)] group-hover:translate-x-1 transition-all duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Life at CREOIT */}
        <section className="section bg-[var(--creoit-dark)]" aria-labelledby="life-heading">
          <div className="container">
            <p className="section-label">Life at CREOIT</p>
            <h2 id="life-heading" className="sr-only">Life at CREOIT</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {lifeAtCreoit.map((item, i) => (
                <div
                  key={i}
                  className={cn(
                    "py-6 px-6 border border-[var(--border)]",
                    "font-display font-medium text-base text-[var(--creoit-off-white)]"
                  )}
                >
                  <span className="text-[var(--creoit-accent)] mr-2">—</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
