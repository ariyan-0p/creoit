"use client";

import { useState } from "react";
import { PageTransition } from "@/components/layout/PageTransition";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { cn } from "@/lib/cn";
import type { ServiceInterest, BudgetRange } from "@/types";

const serviceOptions: ServiceInterest[] = [
  "Branding",
  "Social Media",
  "Content Production",
  "Performance Marketing",
  "Lead Generation",
  "Website Development",
  "Event Marketing",
  "Marketing Consultation",
  "Something Else",
];

const budgetOptions: BudgetRange[] = [
  "₹25K – ₹50K",
  "₹50K – ₹1L",
  "₹1L – ₹3L",
  "₹3L+",
  "Let's Discuss",
];

export default function ContactPageClient() {
  const [selectedServices, setSelectedServices] = useState<ServiceInterest[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<BudgetRange | "">("");

  const toggleService = (service: ServiceInterest) => {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  };

  return (
    <PageTransition>
      <section
        className={cn("section min-h-screen pt-32 bg-[var(--creoit-black)]")}
        aria-labelledby="contact-heading"
      >
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Left: Heading */}
            <div>
              <p className="section-label">Contact</p>
              <AnimatedText
                text="LET'S TALK ABOUT WHAT'S NEXT."
                as="h1"
                id="contact-heading"
                splitBy="word"
                delay={0.1}
                stagger={0.06}
                className="font-display font-bold text-[var(--creoit-off-white)] mb-8"
              />
              <p className="font-body text-[var(--creoit-grey-light)] leading-relaxed max-w-sm">
                Tell us what you&apos;re trying to build. We&apos;ll tell you
                how we can help.
              </p>
            </div>

            {/* Right: Form */}
            <form
              className="flex flex-col gap-6"
              onSubmit={(e) => {
                e.preventDefault();
                // TODO: Wire up form submission (email/API)
                alert("Form submitted! (Submission logic not yet wired up)");
              }}
            >
              {/* Name */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="contact-name"
                  className="font-display text-xs uppercase tracking-widest text-[var(--creoit-grey-light)]"
                >
                  Your Name *
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  placeholder="Full name"
                  className={cn(
                    "bg-[var(--creoit-dark)] border border-[var(--border)]",
                    "px-4 py-4 font-body text-sm text-[var(--creoit-off-white)]",
                    "placeholder:text-[var(--creoit-grey-mid)]",
                    "focus:border-[var(--creoit-accent)] focus:outline-none",
                    "transition-colors duration-300"
                  )}
                />
              </div>

              {/* Company */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="contact-company"
                  className="font-display text-xs uppercase tracking-widest text-[var(--creoit-grey-light)]"
                >
                  Your Company / Brand *
                </label>
                <input
                  id="contact-company"
                  type="text"
                  required
                  placeholder="Company or brand name"
                  className={cn(
                    "bg-[var(--creoit-dark)] border border-[var(--border)]",
                    "px-4 py-4 font-body text-sm text-[var(--creoit-off-white)]",
                    "placeholder:text-[var(--creoit-grey-mid)]",
                    "focus:border-[var(--creoit-accent)] focus:outline-none",
                    "transition-colors duration-300"
                  )}
                />
              </div>

              {/* Email + Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="contact-email"
                    className="font-display text-xs uppercase tracking-widest text-[var(--creoit-grey-light)]"
                  >
                    Email *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="hello@company.com"
                    className={cn(
                      "bg-[var(--creoit-dark)] border border-[var(--border)]",
                      "px-4 py-4 font-body text-sm text-[var(--creoit-off-white)]",
                      "placeholder:text-[var(--creoit-grey-mid)]",
                      "focus:border-[var(--creoit-accent)] focus:outline-none",
                      "transition-colors duration-300"
                    )}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="contact-phone"
                    className="font-display text-xs uppercase tracking-widest text-[var(--creoit-grey-light)]"
                  >
                    Phone
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    className={cn(
                      "bg-[var(--creoit-dark)] border border-[var(--border)]",
                      "px-4 py-4 font-body text-sm text-[var(--creoit-off-white)]",
                      "placeholder:text-[var(--creoit-grey-mid)]",
                      "focus:border-[var(--creoit-accent)] focus:outline-none",
                      "transition-colors duration-300"
                    )}
                  />
                </div>
              </div>

              {/* Services */}
              <div className="flex flex-col gap-3">
                <p className="font-display text-xs uppercase tracking-widest text-[var(--creoit-grey-light)]">
                  What Are You Looking For?
                </p>
                <div className="flex flex-wrap gap-2">
                  {serviceOptions.map((service) => (
                    <button
                      key={service}
                      type="button"
                      onClick={() => toggleService(service)}
                      className={cn(
                        "font-display text-[10px] uppercase tracking-widest",
                        "px-4 py-2 border transition-all duration-200",
                        selectedServices.includes(service)
                          ? "border-[var(--creoit-accent)] text-[var(--creoit-accent)] bg-[var(--creoit-accent-dim)]"
                          : "border-[var(--border)] text-[var(--creoit-grey-mid)] hover:border-[var(--creoit-grey)]"
                      )}
                    >
                      {service}
                    </button>
                  ))}
                </div>
              </div>

              {/* Goal */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="contact-goal"
                  className="font-display text-xs uppercase tracking-widest text-[var(--creoit-grey-light)]"
                >
                  Business Goal
                </label>
                <textarea
                  id="contact-goal"
                  rows={4}
                  placeholder="Tell us what you're trying to build or achieve."
                  className={cn(
                    "bg-[var(--creoit-dark)] border border-[var(--border)]",
                    "px-4 py-4 font-body text-sm text-[var(--creoit-off-white)]",
                    "placeholder:text-[var(--creoit-grey-mid)]",
                    "focus:border-[var(--creoit-accent)] focus:outline-none",
                    "transition-colors duration-300 resize-none"
                  )}
                />
              </div>

              {/* Budget */}
              <div className="flex flex-col gap-3">
                <p className="font-display text-xs uppercase tracking-widest text-[var(--creoit-grey-light)]">
                  Budget Range
                </p>
                <div className="flex flex-wrap gap-2">
                  {budgetOptions.map((budget) => (
                    <button
                      key={budget}
                      type="button"
                      onClick={() =>
                        setSelectedBudget(budget === selectedBudget ? "" : budget)
                      }
                      className={cn(
                        "font-display text-[10px] uppercase tracking-widest",
                        "px-4 py-2 border transition-all duration-200",
                        selectedBudget === budget
                          ? "border-[var(--creoit-accent)] text-[var(--creoit-accent)] bg-[var(--creoit-accent-dim)]"
                          : "border-[var(--border)] text-[var(--creoit-grey-mid)] hover:border-[var(--creoit-grey)]"
                      )}
                    >
                      {budget}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className={cn(
                  "font-display font-bold text-sm uppercase tracking-widest",
                  "px-8 py-5 mt-2",
                  "bg-[var(--creoit-accent)] text-white border border-[var(--creoit-accent)]",
                  "hover:bg-transparent hover:text-[var(--creoit-accent)]",
                  "transition-all duration-300"
                )}
              >
                Start The Conversation
              </button>
            </form>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
