/**
 * MandalaFrame — a project's hero frame with viewfinder HUD.
 * With no footage it shows procedural festival-lights art. Pass `video`
 * (and optionally `poster`) and the real footage plays over the art instead.
 */
import { FrameVideo } from "./FrameVideo";

const RINGS = [
  { r: 36, dash: "0 11", w: 6, d: 40, dir: 1 },
  { r: 66, dash: "0 14", w: 5, d: 55, dir: -1 },
  { r: 98, dash: "10 10", w: 2.5, d: 70, dir: 1 },
  { r: 128, dash: "0 12", w: 6, d: 85, dir: -1 },
  { r: 160, dash: "22 8", w: 2, d: 110, dir: 1 },
  { r: 190, dash: "0 10", w: 5, d: 130, dir: -1 },
];

export function MandalaFrame({
  title,
  rec,
  left,
  right,
  hud = true,
  video,
  poster,
}: {
  title: string;
  rec: string;
  left?: string;
  right?: string;
  hud?: boolean;
  video?: string;
  poster?: string;
}) {
  return (
    <>
      <div className="wk-art absolute inset-0 origin-center will-change-transform">
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(60% 70% at 50% 50%, #8e63ff 0%, #4a22d9 38%, #1a0640 75%, #0d0420 100%)" }}
        />
        <svg viewBox="-200 -200 400 400" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
          {RINGS.map((ring) => (
            <g key={ring.r} className="wk-ring" style={{ animation: `wk-spin ${ring.d}s linear infinite ${ring.dir < 0 ? "reverse" : ""}` }}>
              <circle r={ring.r} fill="none" stroke="#f1eaff" strokeOpacity="0.85" strokeWidth={ring.w} strokeLinecap="round" strokeDasharray={ring.dash} />
            </g>
          ))}
        </svg>
        {video && <FrameVideo src={video} poster={poster} />}
        <div className="grain absolute inset-0 overflow-hidden" aria-hidden />
      </div>

      {video ? (
        <>
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-ink/25" />
          <span className="sr-only">{title}</span>
        </>
      ) : (
        <div className="absolute inset-0 grid place-items-center">
          <p className="display text-center text-[clamp(3.4rem,15vw,15rem)] leading-[0.82] text-paper">{title}</p>
        </div>
      )}

      {hud && (
        <div className="pointer-events-none absolute inset-[var(--pad)] text-paper/85" aria-hidden>
          <i className="vf vf-tl" />
          <i className="vf vf-tr" />
          <i className="vf vf-bl" />
          <i className="vf vf-br" />
          <span className="mono absolute left-4 top-3 flex items-center gap-2">
            <i className="rec" /> Rec — {rec}
          </span>
          {left && <span className="mono absolute bottom-3 left-4">{left}</span>}
          {right && <span className="mono absolute bottom-3 right-4 hidden sm:block">{right}</span>}
        </div>
      )}
    </>
  );
}
