import type { Metadata } from "next";
import { PageTransition } from "@/components/layout/PageTransition";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Work — Our Projects & Case Studies",
  description:
    "Ideas, campaigns, brands and experiences we've had the opportunity to build. Browse our work across branding, content, performance marketing, digital and events.",
};

export default function WorkPage() {
  return (
    <PageTransition>
      <section
        className={cn("section min-h-screen pt-32 bg-[var(--creoit-black)]")}
        aria-labelledby="work-page-heading"
      >
        <div className="container">
          <p className="section-label">The Work</p>
          <AnimatedText
            text="THE WORK."
            as="h1"
            id="work-page-heading"
            splitBy="word"
            delay={0.1}
            stagger={0.08}
            className="font-display font-bold text-[var(--creoit-off-white)] mb-6 max-w-3xl"
          />
          <p className="font-body text-[var(--creoit-grey-light)] max-w-xl leading-relaxed mb-16">
            Ideas, campaigns, brands and experiences we&apos;ve had the
            opportunity to build.
          </p>

          {/* TODO: Add project filter tabs + project grid */}
          <div className="py-20 text-center border border-dashed border-[var(--border)] rounded-sm">
            <p className="font-display text-sm uppercase tracking-widest text-[var(--creoit-grey-mid)]">
              Project grid coming soon
            </p>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
