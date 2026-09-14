/**
 * Work / Projects Content — content/work.ts
 */

import type { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "kalrav-2024",
    slug: "kalrav",
    client: "KALRAV",
    projectName: "Kalrav Garba 2024",
    categories: ["Branding", "Events"],
    tagline: "Building anticipation for a premium Garba experience in Bhopal.",
    thumbnail: "/images/work/kalrav-thumb.jpg",
    description:
      "KALRAV is a premium Garba event in Bhopal. We built a comprehensive event marketing strategy combining brand identity, social media campaigns, and on-ground activations to create maximum anticipation.",
    challenge:
      "Stand out in a crowded festive events market and attract a premium audience willing to pay for a curated Garba experience.",
    idea:
      "Position KALRAV not as just an event, but as a cultural experience — something you look forward to all year. Use cinematic visual storytelling to build desire.",
    execution:
      "Brand identity, event collateral, social media campaign, reels & teaser content, influencer collaborations, and on-ground brand activation.",
    impact: "Sold out tickets ahead of the event date.",
    results: [
      { value: "130K+", label: "Music Video Views" },
      { value: "31K+", label: "Campaign Views" },
      { value: "100%", label: "Tickets Sold" },
    ],
    featured: true,
    year: 2024,
  },
  {
    id: "placeholder-1",
    slug: "coming-soon-1",
    client: "Brand Name",
    projectName: "Project Name",
    categories: ["Branding"],
    tagline: "A premium brand identity for a modern business.",
    thumbnail: "/images/work/placeholder-1.jpg",
    description: "Coming soon.",
    featured: true,
    year: 2025,
  },
  {
    id: "placeholder-2",
    slug: "coming-soon-2",
    client: "Brand Name",
    projectName: "Project Name",
    categories: ["Content"],
    tagline: "Content that stopped the scroll.",
    thumbnail: "/images/work/placeholder-2.jpg",
    description: "Coming soon.",
    featured: true,
    year: 2025,
  },
  {
    id: "placeholder-3",
    slug: "coming-soon-3",
    client: "Brand Name",
    projectName: "Project Name",
    categories: ["Performance"],
    tagline: "Performance marketing that generated real leads.",
    thumbnail: "/images/work/placeholder-3.jpg",
    description: "Coming soon.",
    featured: false,
    year: 2025,
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
