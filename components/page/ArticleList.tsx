"use client";

/**
 * ArticleList — essays as a typographic index with a category filter.
 * Articles don't have pages yet, so each row is labelled honestly and
 * the row's CTA leads to a conversation instead of a dead link.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { articles } from "@/content/thinking";

const fmt = new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric", timeZone: "UTC" });

export function ArticleList() {
  const cats = useMemo(() => ["All", ...Array.from(new Set(articles.map((a) => a.category)))], []);
  const [cat, setCat] = useState("All");
  const shown = articles.filter((a) => cat === "All" || a.category === cat);

  return (
    <div>
      <div role="group" aria-label="Filter by topic" className="mono mb-10 flex flex-wrap gap-2">
        {cats.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={cat === c}
            onClick={() => setCat(c)}
            className={`rounded-full border px-4 py-2.5 transition-colors duration-500 ${
              cat === c ? "border-signal bg-signal text-paper" : "border-ink/25 text-ink/70 hover:border-ink hover:text-ink"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <ul key={cat} className="border-t border-ink/15">
        {shown.map((a, i) => (
          <li key={a.id} className="rise border-b border-ink/15" style={{ animationDelay: `${i * 60}ms` }}>
            <article className="group relative -mx-[var(--pad)] overflow-hidden px-[var(--pad)]">
              <span aria-hidden className="absolute inset-0 origin-bottom scale-y-0 bg-deep transition-transform duration-[800ms] ease-[var(--ease)] group-hover:scale-y-100" />
              <div className="relative grid gap-4 py-8 transition-colors duration-500 group-hover:text-paper md:grid-cols-[8rem_1fr_16rem] md:items-start md:gap-8 md:py-10">
                <p className="mono text-ink/50 group-hover:text-lilac">
                  {fmt.format(new Date(a.publishedAt))}
                  <br />
                  {a.readTime} min read
                </p>
                <div>
                  <p className="mono mb-3 text-signal group-hover:text-lilac">{a.category}</p>
                  <h3 className="display text-[clamp(1.7rem,3.6vw,3.8rem)] leading-[1] transition-transform duration-700 ease-[var(--ease)] group-hover:translate-x-3">
                    {a.title}
                  </h3>
                </div>
                <div>
                  <p className="text-[0.95rem] leading-relaxed text-ink/70 group-hover:text-paper/80">{a.excerpt}</p>
                  <p className="mono mt-4 flex items-center gap-3">
                    <span className="rounded-full border border-current px-3 py-1 opacity-70">Essay in progress</span>
                    <Link href="/contact" className="u-link">
                      Discuss it →
                    </Link>
                  </p>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
