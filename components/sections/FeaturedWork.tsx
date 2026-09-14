"use client";

/**
 * FeaturedWork — components/sections/FeaturedWork.tsx
 *
 * Displays featured projects in a card grid.
 * Cards have hover reveal overlay with project details.
 */

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { featuredProjects } from "@/content/work";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { cn } from "@/lib/cn";

export function FeaturedWork() {
  return (
    <section
      className={cn("section bg-[var(--creoit-dark)]")}
      aria-labelledby="featured-work-heading"
    >
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
          <div>
            <p className="section-label">Selected Work</p>
            <AnimatedText
              text="SOME THINGS WE'VE BEEN BUSY MAKING."
              as="h2"
              id="featured-work-heading"
              splitBy="word"
              delay={0}
              stagger={0.04}
              className="font-display font-bold text-[var(--creoit-off-white)] max-w-2xl"
            />
          </div>

          <Link
            href="/work"
            className={cn(
              "font-display font-semibold text-xs uppercase tracking-widest",
              "text-[var(--creoit-grey-light)] hover:text-[var(--creoit-accent)]",
              "transition-colors duration-300 whitespace-nowrap",
              "flex items-center gap-2 group"
            )}
          >
            View All Work
            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </Link>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {featuredProjects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.7,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Link
                href={`/work/${project.slug}`}
                className="block group relative overflow-hidden"
                aria-label={`${project.client} — ${project.projectName}`}
              >
                {/* Image Container */}
                <div
                  className={cn(
                    "relative overflow-hidden",
                    i === 0 ? "aspect-[4/3]" : "aspect-square"
                  )}
                  style={{ backgroundColor: "var(--creoit-dark-2)" }}
                >
                  <Image
                    src={project.thumbnail}
                    alt={`${project.client} project thumbnail`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />

                  {/* Overlay */}
                  <div
                    className={cn(
                      "absolute inset-0",
                      "bg-gradient-to-t from-[rgba(10,10,10,0.9)] via-transparent to-transparent",
                      "opacity-70 group-hover:opacity-90",
                      "transition-opacity duration-500"
                    )}
                  />

                  {/* "View Project" reveal */}
                  <div
                    className={cn(
                      "absolute inset-0 flex items-center justify-center",
                      "opacity-0 group-hover:opacity-100",
                      "transition-opacity duration-300"
                    )}
                  >
                    <span className={cn(
                      "font-display font-semibold text-xs uppercase tracking-widest",
                      "px-6 py-3 border border-white text-white"
                    )}>
                      View Project →
                    </span>
                  </div>
                </div>

                {/* Card Info */}
                <div className="pt-5 pb-2">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {project.categories.map((cat) => (
                      <span
                        key={cat}
                        className="font-display text-[10px] uppercase tracking-widest text-[var(--creoit-accent)]"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-display font-bold text-xl md:text-2xl text-[var(--creoit-off-white)] mb-1">
                    {project.client}
                  </h3>
                  <p className="font-body text-sm text-[var(--creoit-grey-light)]">
                    {project.tagline}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedWork;
