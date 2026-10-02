/**
 * Shared TypeScript Types — types/index.ts
 *
 * Central type definitions used across the CREOIT website.
 */

// ── Navigation ─────────────────────────────────────────────────────────────
export interface NavLink {
  label: string;
  href: string;
  isExternal?: boolean;
}

// ── Work / Projects ────────────────────────────────────────────────────────
export type ServiceCategory =
  | "Branding"
  | "Content"
  | "Performance"
  | "Digital"
  | "Events"
  | "Growth";

export interface Project {
  id: string;
  slug: string;
  client: string;
  projectName: string;
  categories: ServiceCategory[];
  tagline: string;
  thumbnail: string; // image path or URL
  videoUrl?: string; // drop a file in /public/videos and set this to play real footage
  posterUrl?: string; // still shown before the video loads / with reduced motion
  description: string;
  challenge?: string;
  idea?: string;
  execution?: string;
  impact?: string;
  results?: ProjectResult[];
  gallery?: string[];
  featured: boolean;
  year: number;
}

export interface ProjectResult {
  value: string;
  label: string;
}

// ── Team ───────────────────────────────────────────────────────────────────
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo: string;
  funFact?: string;
  quote?: string;
  socials?: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
}

// ── Services ───────────────────────────────────────────────────────────────
export interface Service {
  id: string;
  number: string;
  title: string;
  headline: string;
  offerings: string[];
  description: string;
  icon?: string;
}

// ── Thinking (Blog / Articles) ─────────────────────────────────────────────
export type ArticleCategory =
  | "Marketing Insights"
  | "Industry"
  | "Case Study"
  | "Creative"
  | "Strategy"
  | "Brand Analysis";

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: ArticleCategory;
  coverImage: string;
  publishedAt: string; // ISO date string
  readTime: number; // minutes
  featured: boolean;
}

// ── Careers ────────────────────────────────────────────────────────────────
export interface JobOpening {
  id: string;
  title: string;
  type: "Full-time" | "Part-time" | "Freelance" | "Internship";
  location: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  applyEmail: string;
}

// ── Contact Form ───────────────────────────────────────────────────────────
export type ServiceInterest =
  | "Branding"
  | "Social Media"
  | "Content Production"
  | "Performance Marketing"
  | "Lead Generation"
  | "Website Development"
  | "Event Marketing"
  | "Marketing Consultation"
  | "Something Else";

export type BudgetRange =
  | "₹25K – ₹50K"
  | "₹50K – ₹1L"
  | "₹1L – ₹3L"
  | "₹3L+"
  | "Let's Discuss";

export interface ContactFormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  services: ServiceInterest[];
  goal: string;
  budget: BudgetRange | "";
}

// ── Site Stats ─────────────────────────────────────────────────────────────
export interface StatItem {
  value: string;
  suffix?: string;
  label: string;
}

// ── Process Steps ──────────────────────────────────────────────────────────
export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

// ── Client ─────────────────────────────────────────────────────────────────
export interface Client {
  id: string;
  name: string;
  logo: string; // path to logo
  logoLight?: string; // light version
}
