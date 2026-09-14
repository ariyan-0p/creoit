import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { BrandStatement } from "@/components/sections/BrandStatement";
import { WhatWeDo } from "@/components/sections/WhatWeDo";
import { HowWeThink } from "@/components/sections/HowWeThink";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { Results } from "@/components/sections/Results";
import { OurProcess } from "@/components/sections/OurProcess";
import { TeamCulture } from "@/components/sections/TeamCulture";
import { Clients } from "@/components/sections/Clients";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata: Metadata = {
  title: "CREOIT — We Create What People Remember",
  description:
    "CREOIT is a 360° creative marketing company. Branding, content, performance, digital, events and growth strategy — all under one team.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <BrandStatement />
      <WhatWeDo />
      <HowWeThink />
      <FeaturedWork />
      <Results />
      <OurProcess />
      <TeamCulture />
      <Clients />
      <FinalCTA />
    </>
  );
}
