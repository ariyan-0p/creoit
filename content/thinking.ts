/**
 * Thinking (Articles / Blog) Content — content/thinking.ts
 */

import type { Article } from "@/types";

export const articles: Article[] = [
  {
    id: "article-1",
    slug: "why-most-brands-waste-money-on-ads",
    title: "Why Most Brands Waste Money on Ads",
    excerpt:
      "Running ads without a brand foundation is like filling a leaky bucket. Here's why your ad performance starts with your brand strategy.",
    category: "Marketing Insights",
    coverImage: "/images/thinking/ads-waste.jpg",
    publishedAt: "2025-01-15",
    readTime: 5,
    featured: true,
  },
  {
    id: "article-2",
    slug: "the-problem-with-posting-every-day",
    title: "The Problem With Posting Every Day",
    excerpt:
      "Consistency is not the same as frequency. Most brands confuse the two, and it's hurting their growth.",
    category: "Strategy",
    coverImage: "/images/thinking/posting-everyday.jpg",
    publishedAt: "2025-02-10",
    readTime: 4,
    featured: true,
  },
  {
    id: "article-3",
    slug: "what-makes-content-actually-work",
    title: "What Makes Content Actually Work?",
    excerpt:
      "Not engagement. Not reach. Here's the real question you should be asking about every piece of content you create.",
    category: "Creative",
    coverImage: "/images/thinking/content-works.jpg",
    publishedAt: "2025-03-05",
    readTime: 6,
    featured: true,
  },
  {
    id: "article-4",
    slug: "why-branding-is-more-than-a-logo",
    title: "Why Branding Is More Than a Logo",
    excerpt:
      "Your logo is the last thing your brand needs. Here's what actually builds a brand that people trust and remember.",
    category: "Brand Analysis",
    coverImage: "/images/thinking/branding-logo.jpg",
    publishedAt: "2025-03-22",
    readTime: 7,
    featured: false,
  },
  {
    id: "article-5",
    slug: "how-we-approach-lead-generation",
    title: "How We Approach Lead Generation",
    excerpt:
      "Lead generation isn't about tricks. It's about building a system that attracts the right people at the right moment.",
    category: "Case Study",
    coverImage: "/images/thinking/lead-gen.jpg",
    publishedAt: "2025-04-11",
    readTime: 8,
    featured: false,
  },
];

export const featuredArticles = articles.filter((a) => a.featured);
