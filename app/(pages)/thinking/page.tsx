import type { Metadata } from "next";
import { PageMotion } from "@/components/ui/PageMotion";
import { PageHero } from "@/components/page/PageHero";
import { ArticleList } from "@/components/page/ArticleList";

export const metadata: Metadata = {
  title: "Thinking — Marketing Insights & Industry Observations",
  description:
    "CREOIT's Thinking section: marketing insights, brand analysis, creative opinions and growth strategies from a team-first creative marketing company.",
};

export default function ThinkingPage() {
  return (
    <PageMotion>
      <PageHero
        index="04"
        label="Thinking"
        title={
          <>
            Think<span className="serif-i text-lilac">ing.</span>
          </>
        }
        lead="Marketing insights, industry observations, case studies and creative opinions from the CREOIT team."
      />
      <section data-nav="light" className="relative bg-paper px-[var(--pad)] py-[clamp(4rem,9vw,8rem)] text-ink">
        <ArticleList />
      </section>
    </PageMotion>
  );
}
