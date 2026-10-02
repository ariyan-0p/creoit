"use client";

/**
 * Contact — the brief form. There's no backend yet, so on submit we validate,
 * compose the message and hand it to the visitor's email app (mailto:), then
 * confirm. Swap `send()` for a real endpoint later without touching the UI.
 */

import { useState, type FormEvent } from "react";
import { SOCIALS, EMAIL } from "@/lib/site";
import { PageMotion } from "@/components/ui/PageMotion";
import { PageHero } from "@/components/page/PageHero";

const INTERESTS = [
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
const BUDGETS = ["₹25K – ₹50K", "₹50K – ₹1L", "₹1L – ₹3L", "₹3L+", "Let's Discuss"];

type Errors = Partial<Record<"name" | "company" | "email" | "message", string>>;

const field =
  "w-full border-0 border-b border-ink/25 bg-transparent px-0 py-4 text-[1.05rem] text-ink placeholder:text-ink/35 transition-colors duration-500 focus:border-signal focus:outline-none";

export default function ContactClient() {
  const [interests, setInterests] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const toggle = (v: string) => setInterests((c) => (c.includes(v) ? c.filter((x) => x !== v) : [...c, v]));

  const send = (d: Record<string, string>) => {
    const body = [
      `Name: ${d.name}`,
      `Company / brand: ${d.company}`,
      `Email: ${d.email}`,
      d.phone ? `Phone: ${d.phone}` : "",
      `Interested in: ${interests.join(", ") || "—"}`,
      `Budget: ${budget || "—"}`,
      "",
      d.message,
    ]
      .filter((l) => l !== "")
      .join("\n");
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(`New brief — ${d.company}`)}&body=${encodeURIComponent(body)}`;
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const d = Object.fromEntries(fd.entries()) as Record<string, string>;
    const next: Errors = {};
    if (!d.name?.trim()) next.name = "Tell us who you are.";
    if (!d.company?.trim()) next.company = "Which brand is this for?";
    if (!/^\S+@\S+\.\S+$/.test(d.email ?? "")) next.email = "We need a valid email to reply to.";
    if (!d.message?.trim()) next.message = "A line or two about what you're building.";
    setErrors(next);
    if (Object.keys(next).length) return;
    send(d);
    setSent(true);
  };

  return (
    <PageMotion>
      <PageHero
        index="06"
        label="Contact"
        ring="Let's talk about what's next"
        title={
          <>
            Let&apos;s talk about <span className="serif-i text-lilac">what&apos;s next.</span>
          </>
        }
        lead="Tell us what you're trying to build. We'll tell you how we can help."
      />

      <section data-nav="light" className="relative bg-paper px-[var(--pad)] py-[clamp(4rem,9vw,8rem)] text-ink">
        <div className="grid gap-16 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <div data-reveal>
              <p className="mono mb-3 text-ink/55">Email</p>
              <a href={`mailto:${EMAIL}`} className="serif-i u-link text-[clamp(1.8rem,3vw,2.8rem)]">
                {EMAIL}
              </a>
            </div>
            <div data-reveal className="mt-10">
              <p className="mono mb-3 text-ink/55">Studio</p>
              <p className="text-[1.05rem] leading-relaxed">Bhopal, India — working with brands worldwide.</p>
            </div>
            <ul data-reveal className="mono mt-10 flex flex-col gap-2">
              {SOCIALS.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="u-link">
                    {s.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          <div className="lg:col-span-8">
            {sent ? (
              <div role="status" className="rise rounded-3xl bg-deep p-10 text-paper md:p-16">
                <p className="mono mb-6 flex items-center gap-3 text-lilac">
                  <i className="rec" /> Frame captured
                </p>
                <h2 className="display text-[clamp(2.4rem,5.6vw,5.6rem)] leading-[0.96]">
                  Your email app should be <span className="serif-i text-lilac">open.</span>
                </h2>
                <p className="mt-6 max-w-md text-paper/75">
                  Hit send there and the brief lands with us. If nothing opened, write to{" "}
                  <a href={`mailto:${EMAIL}`} className="u-link text-paper">
                    {EMAIL}
                  </a>{" "}
                  directly.
                </p>
                <button type="button" onClick={() => setSent(false)} className="mono u-link mt-10 text-paper">
                  ← Edit the brief
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="flex flex-col gap-10">
                <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
                  <label data-reveal className="block">
                    <span className="mono text-ink/55">Your name *</span>
                    <input name="name" type="text" autoComplete="name" placeholder="Full name" className={field} aria-invalid={!!errors.name} />
                    {errors.name && <span className="mono mt-2 block text-signal">{errors.name}</span>}
                  </label>
                  <label data-reveal className="block">
                    <span className="mono text-ink/55">Company / brand *</span>
                    <input name="company" type="text" autoComplete="organization" placeholder="Brand name" className={field} aria-invalid={!!errors.company} />
                    {errors.company && <span className="mono mt-2 block text-signal">{errors.company}</span>}
                  </label>
                  <label data-reveal className="block">
                    <span className="mono text-ink/55">Email *</span>
                    <input name="email" type="email" autoComplete="email" placeholder="you@company.com" className={field} aria-invalid={!!errors.email} />
                    {errors.email && <span className="mono mt-2 block text-signal">{errors.email}</span>}
                  </label>
                  <label data-reveal className="block">
                    <span className="mono text-ink/55">Phone</span>
                    <input name="phone" type="tel" autoComplete="tel" placeholder="Optional" className={field} />
                  </label>
                </div>

                <fieldset data-reveal>
                  <legend className="mono mb-4 text-ink/55">I&apos;m interested in</legend>
                  <div className="flex flex-wrap gap-2">
                    {INTERESTS.map((i) => (
                      <button
                        key={i}
                        type="button"
                        aria-pressed={interests.includes(i)}
                        onClick={() => toggle(i)}
                        className={`mono rounded-full border px-4 py-2.5 transition-colors duration-500 ${
                          interests.includes(i) ? "border-signal bg-signal text-paper" : "border-ink/25 text-ink/70 hover:border-ink hover:text-ink"
                        }`}
                      >
                        {i}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <fieldset data-reveal>
                  <legend className="mono mb-4 text-ink/55">Budget range</legend>
                  <div className="flex flex-wrap gap-2">
                    {BUDGETS.map((b) => (
                      <button
                        key={b}
                        type="button"
                        aria-pressed={budget === b}
                        onClick={() => setBudget(budget === b ? "" : b)}
                        className={`mono rounded-full border px-4 py-2.5 transition-colors duration-500 ${
                          budget === b ? "border-ink bg-ink text-paper" : "border-ink/25 text-ink/70 hover:border-ink hover:text-ink"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <label data-reveal className="block">
                  <span className="mono text-ink/55">Tell us about the project *</span>
                  <textarea name="message" rows={4} placeholder="What are you trying to build?" className={`${field} resize-none`} aria-invalid={!!errors.message} />
                  {errors.message && <span className="mono mt-2 block text-signal">{errors.message}</span>}
                </label>

                <div data-reveal className="flex flex-wrap items-center gap-6">
                  <button
                    type="submit"
                    data-cursor="Send"
                    className="mono group relative isolate inline-flex items-center gap-3 overflow-hidden rounded-full bg-signal px-9 py-5 text-paper transition-colors duration-500 before:absolute before:inset-0 before:-z-10 before:translate-y-[101%] before:rounded-[50%] before:bg-ink before:transition-transform before:duration-700 before:ease-[var(--ease)] hover:before:translate-y-0 hover:before:rounded-none"
                  >
                    Send the brief <span aria-hidden>→</span>
                  </button>
                  <p className="mono max-w-[26ch] text-ink/50">Opens your email app with everything filled in.</p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </PageMotion>
  );
}
