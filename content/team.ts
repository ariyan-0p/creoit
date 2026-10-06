/**
 * Team Members Content — content/team.ts
 *
 * Order matters: everyone appears in the home-page deck and on /team.
 * Photos are cropped 4:5 portraits in public/images/people/. `quote` is optional —
 * add a real line from the person when they have one.
 */

import type { TeamMember } from "@/types";

export const team: TeamMember[] = [
  {
    id: "sujal-sharma",
    name: "Sujal Sharma",
    role: "Co-Founder",
    bio: "Sets the direction at CREOIT and stays close to every brand we take on, from the first conversation to the final frame.",
    photo: "/images/people/sujal-sharma.jpg",
    craft: ["Vision & Direction", "Brand Strategy", "Client Partnerships"],
  },
  {
    id: "rohit-prajapati",
    name: "Rohit Prajapati",
    role: "Co-Founder",
    bio: "Leads growth and strategy at CREOIT, turning ambitious ideas into work that holds up in the real world.",
    photo: "/images/people/rohit-prajapati.jpg",
    craft: ["Growth", "Marketing Strategy", "Leadership"],
  },
  {
    id: "vaishali-mankar",
    name: "Vaishali Mankar",
    role: "Operations Manager",
    bio: "Keeps every project moving: schedules, shoots, teams and deliveries, so the creative work reaches the client on time.",
    photo: "/images/people/vaishali-mankar.jpg",
    craft: ["Project Management", "Production Planning", "Client Coordination"],
  },
  {
    id: "aman-kumar",
    name: "Aman Kumar",
    role: "Performance Marketer",
    bio: "Turns ad budgets into measurable business results, testing, learning and scaling what works.",
    photo: "/images/people/aman-kumar.jpg",
    craft: ["Meta Ads", "Google Ads", "Lead Generation"],
  },
  {
    id: "aditiya-meena",
    name: "Aditiya Meena",
    role: "Content Director & DOP",
    bio: "Leads everything we put in front of a camera, and lights, frames and shoots it too. Content that earns attention and keeps it.",
    photo: "/images/people/aditiya-meena.jpg",
    craft: ["Cinematography", "Photography", "Reels & Films", "Creative Campaigns"],
  },
  {
    id: "akshay-upadhyay",
    name: "Akshay Upadhyay",
    role: "Social Media Executive",
    bio: "Runs the day-to-day of our clients' social channels: planning, posting and showing up where their audience is.",
    photo: "/images/people/akshay-upadhyay.jpg",
    craft: ["Social Media", "Content Calendars", "Community"],
  },
  {
    id: "sushant-mehnlode",
    name: "Sushant Balveersingh Mehnlode",
    role: "Video Editor",
    bio: "Cuts raw footage into films and reels with rhythm: the edit that makes people stop scrolling and watch.",
    photo: "/images/people/sushant-mehnlode.jpg",
    craft: ["Video Editing", "Reels & Films", "Motion"],
  },
];
