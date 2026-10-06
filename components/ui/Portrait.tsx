/**
 * Portrait — a team member's frame.
 * With a real photo it shows the photo. Until then it shows an honest
 * "portrait coming soon" frame: viewfinder corners, a focus ring and a
 * line-drawn silhouette that can sketch itself on (class `.pt-draw`).
 */

const isReal = (photo?: string) => Boolean(photo) && !photo!.includes("placeholder");

export function Portrait({
  photo,
  label,
  className = "",
}: {
  photo?: string;
  label: string;
  className?: string;
}) {
  if (isReal(photo)) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo} alt={label} className="pt-img absolute inset-0 h-full w-full object-cover object-[50%_22%]" />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`} role="img" aria-label={`${label} — portrait coming soon`}>
      <svg viewBox="0 0 200 250" className="absolute inset-0 h-full w-full" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden>
        {/* focus ring + crosshair */}
        <circle className="pt-draw" pathLength={1} cx="100" cy="118" r="82" strokeDasharray="2 5" opacity="0.5" />
        <circle className="pt-draw" pathLength={1} cx="100" cy="118" r="58" opacity="0.35" />
        <path className="pt-draw" pathLength={1} d="M100 20 V44 M100 192 V216 M4 118 H28 M172 118 H196" opacity="0.6" />
        {/* silhouette */}
        <circle className="pt-draw" pathLength={1} cx="100" cy="98" r="27" />
        <path className="pt-draw" pathLength={1} d="M46 214 C46 160 72 142 100 142 C128 142 154 160 154 214" />
      </svg>
      <div aria-hidden className="pointer-events-none absolute inset-4 opacity-70">
        <i className="vf vf-tl" />
        <i className="vf vf-tr" />
        <i className="vf vf-bl" />
        <i className="vf vf-br" />
      </div>
      <p className="mono absolute inset-x-0 bottom-5 text-center opacity-70">Portrait — developing</p>
    </div>
  );
}
