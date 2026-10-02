import { Hero } from "@/components/home/Hero";
import { Manifesto } from "@/components/home/Manifesto";
import { Lenses } from "@/components/home/Lenses";
import { Team } from "@/components/home/Team";
import { Work } from "@/components/home/Work";
import { Globe } from "@/components/home/Globe";
import { Numbers } from "@/components/home/Numbers";
import { Questions } from "@/components/home/Questions";
import { Culture } from "@/components/home/Culture";

export default function HomePage() {
  return (
    <div className="relative">
      <Hero />
      <Manifesto />
      <Lenses />
      <Team />
      <Work />
      <Globe />
      <Numbers />
      <Questions />
      <Culture />
    </div>
  );
}
