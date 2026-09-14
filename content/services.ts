/**
 * Services Content — content/services.ts
 */

import type { Service } from "@/types";

export const services: Service[] = [
  {
    id: "branding",
    number: "01",
    title: "Branding",
    headline: "We build brands people remember.",
    offerings: [
      "Brand Strategy",
      "Brand Identity",
      "Positioning",
      "Visual Identity",
    ],
    description:
      "Your brand is more than a logo. It's what people feel when they hear your name. We build the strategy, the identity, and the system that makes your brand impossible to ignore.",
  },
  {
    id: "content",
    number: "02",
    title: "Content",
    headline: "Content that stops the scroll.",
    offerings: [
      "Social Media Content",
      "Photography",
      "Videography",
      "Creative Campaigns",
      "Reels & Films",
    ],
    description:
      "Attention is won in the first three seconds. We create content that earns that attention — and keeps it.",
  },
  {
    id: "performance",
    number: "03",
    title: "Performance",
    headline: "Ads that actually work.",
    offerings: [
      "Meta Ads",
      "Google Ads",
      "Lead Generation",
      "Performance Marketing",
    ],
    description:
      "Creativity without results is just art. We combine creative thinking with data-driven performance marketing to generate real business impact.",
  },
  {
    id: "digital",
    number: "04",
    title: "Digital",
    headline: "Digital experiences worth experiencing.",
    offerings: ["Website Development", "SEO", "Digital Experiences"],
    description:
      "Your website is your most important salesperson. We build digital experiences that convert visitors into customers.",
  },
  {
    id: "experiences",
    number: "05",
    title: "Experiences",
    headline: "Make them feel your brand.",
    offerings: [
      "Event Marketing",
      "Brand Activations",
      "Influencer Marketing",
      "Artist Management",
    ],
    description:
      "Some of the most powerful brand moments happen in the real world. We create experiences that people talk about long after they're over.",
  },
  {
    id: "growth",
    number: "06",
    title: "Growth",
    headline: "Strategy that scales.",
    offerings: [
      "Marketing Strategy",
      "Brand Consulting",
      "Growth Strategy",
    ],
    description:
      "Growth without direction is just noise. We help brands build a clear marketing strategy that compounds over time.",
  },
];
