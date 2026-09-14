import type { Metadata } from "next";
import Link from "next/link";
import { PageTransition } from "@/components/layout/PageTransition";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { articles } from "@/content/thinking";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Thinking — Marketing Insights & Industry Observations",
  description:
    "CREOIT's Thinking section: marketing insights, brand analysis, creative opinions and growth strategies from a team-first creative marketing company.",
};

export default function ThinkingPage() {
  return (
    <PageTransition>
      <section
        className={cn("section min-h-screen pt-32 bg-[var(--creoit-black)]")}
        aria-labelledby="thinking-page-heading"
      >
        <div className="container">
          <p className="section-label">Thinking</p>
          <AnimatedText
            text="THINKING."
            as="h1"
            id="thinking-page-heading"
            splitBy="word"
            delay={0.1}
            stagger={0.08}
            className="font-display font-bold text-[var(--creoit-off-white)] mb-6"
          />
          <p className="font-body text-[var(--creoit-grey-light)] max-w-lg leading-relaxed mb-16">
            Marketing insights, industry observations, case studies and creative
            opinions from the CREOIT team.
          </p>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/thinking/${article.slug}`}
                className="group flex flex-col"
              >
                {/* Cover image placeholder */}
                <div
                  className={cn(
                    "relative aspect-[4/3] overflow-hidden",
                    "bg-[var(--creoit-dark-2)] mb-5"
                  )}
                >
                  <div className="absolute inset-0 bg-[var(--creoit-dark-3)] group-hover:scale-105 transition-transform duration-500" />
                </div>

                <div>
                  <span className={cn(
                    "font-display text-[10px] uppercase tracking-widest",
                    "text-[var(--creoit-accent)] mb-2 block"
                  )}>
                    {article.category} · {article.readTime} min read
                  </span>
                  <h2 className={cn(
                    "font-display font-bold text-lg md:text-xl",
                    "text-[var(--creoit-off-white)]",
                    "group-hover:text-[var(--creoit-accent)]",
                    "transition-colors duration-300 mb-2"
                  )}>
                    {article.title}
                  </h2>
                  <p className="font-body text-sm text-[var(--creoit-grey-light)] leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
