/**
 * CodeCard — a tiny code-editor window, used on a developer's team card.
 * It is decoration for a real person's profile: the snippet comes from content/team.ts
 * (`code`), and the colours follow whatever theme the card sits on.
 */

// strings pick up the accent colour, keywords a softer one; everything else stays plain
const TOKENS = /("[^"]*"|\bconst\b|\bInfinity\b|\btrue\b)/g;

export function CodeCard({
  file,
  lines,
  accent,
  className = "",
}: {
  file: string;
  lines: string[];
  /** a text-colour class for strings, e.g. "text-lilac" */
  accent: string;
  className?: string;
}) {
  return (
    <figure
      className={`min-w-0 max-w-full overflow-hidden rounded-2xl border bg-black/20 backdrop-blur-[2px] ${className}`}
      aria-label={`Code snippet from ${file}`}
    >
      <figcaption className="mono flex items-center gap-2 border-b border-current/15 px-4 py-2.5 opacity-80">
        <span aria-hidden className="flex gap-1.5">
          <i className="block h-2 w-2 rounded-full bg-current opacity-40" />
          <i className="block h-2 w-2 rounded-full bg-current opacity-40" />
          <i className="block h-2 w-2 rounded-full bg-current opacity-40" />
        </span>
        <span className="ml-1">{file}</span>
      </figcaption>
      <pre className="overflow-x-auto px-4 py-3.5 font-[family-name:var(--font-mono,ui-monospace)] text-[0.78rem] leading-[1.65] md:text-[0.84rem]">
        <code>
          {lines.map((line, i) => (
            <span key={i} className="block whitespace-pre">
              {line.split(TOKENS).map((part, k) =>
                k % 2 === 1 ? (
                  <span key={k} className={part.startsWith('"') ? accent : `${accent} opacity-70`}>
                    {part}
                  </span>
                ) : (
                  <span key={k} className="opacity-85">
                    {part}
                  </span>
                )
              )}
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}
