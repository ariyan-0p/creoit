import type { Metadata } from "next";
import { PageMotion } from "@/components/ui/PageMotion";
import { PageHero } from "@/components/page/PageHero";
import { WorkGrid } from "@/components/page/WorkGrid";

export const metadata: Metadata = {
  title: "Work — Our Projects & Case Studies",
  description:
    "Ideas, campaigns, brands and experiences we've had the opportunity to build. Browse our work across branding, content, performance marketing, digital and events.",
};

export default function WorkPage() {
  return (
    <PageMotion>
      <PageHero
        index="03"
        label="The work"
        title={
          <>
            Ideas that <span className="serif-i text-lilac">stuck.</span>
          </>
        }
        lead="Ideas, campaigns, brands and experiences we've had the opportunity to build."
      />
      <section data-nav="light" className="relative bg-paper px-[var(--pad)] py-[clamp(4rem,9vw,8rem)] text-ink">
        <WorkGrid />
      </section>
    </PageMotion>
  );
}
