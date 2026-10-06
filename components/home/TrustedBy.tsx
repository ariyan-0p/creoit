/**
 * TrustedBy — a quiet, endless strip of the brands we work with.
 * Reads content/clients.ts. Empty list = hidden in production; in development it
 * shows marked placeholders so the layout can be previewed before real clients exist.
 */

import { clients as realClients, type Client } from "@/content/clients";

const PLACEHOLDERS: Client[] = Array.from({ length: 8 }, (_, i) => ({ name: `Client ${i + 1}` }));

function Item({ c, ghost }: { c: Client; ghost: boolean }) {
  const body = c.logo ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={c.logo} alt={c.name} className="h-8 w-auto opacity-60 grayscale transition duration-500 group-hover:opacity-100 group-hover:grayscale-0 md:h-10" />
  ) : (
    <span
      className={`display whitespace-nowrap text-[clamp(1.5rem,2.6vw,2.4rem)] leading-none transition-colors duration-500 ${
        ghost ? "rounded-full border border-dashed border-ink/30 px-6 py-3 text-ink/35" : "text-ink/45 group-hover:text-ink"
      }`}
    >
      {c.name}
    </span>
  );
  const cls = "group flex shrink-0 items-center px-[clamp(1.75rem,4vw,4rem)]";
  return c.href ? (
    <a href={c.href} target="_blank" rel="noopener noreferrer" className={cls}>
      {body}
    </a>
  ) : (
    <div className={cls}>{body}</div>
  );
}

export function TrustedBy() {
  const real = realClients.length > 0;
  if (!real && process.env.NODE_ENV === "production") return null;

  const list = real ? realClients : PLACEHOLDERS;
  // enough items per half that the strip always covers a wide screen, then doubled for a seamless loop
  const half = Array.from({ length: Math.ceil(8 / list.length) }).flatMap(() => list);
  const seconds = Math.max(26, half.length * 4);

  return (
    <section data-nav="light" aria-label="Trusted by" className="relative z-10 overflow-hidden border-t border-ink/10 bg-paper py-[clamp(3.5rem,7vw,6rem)] text-ink">
      <p className="mono mb-8 px-[var(--pad)] text-ink/55 md:mb-10">
        {real ? "Trusted by brands that want to be remembered" : "Trusted by — placeholder strip, add real clients in content/clients.ts (hidden on the live site until then)"}
      </p>

      <div
        className="[mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]"
        style={{ ["--marquee-d" as string]: `${seconds}s` }}
      >
        <div className="marquee items-center">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex items-center" aria-hidden={dup === 1}>
              {half.map((c, i) => (
                <Item key={`${dup}-${i}`} c={c} ghost={!real} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
