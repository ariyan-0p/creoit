import { useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'
import logo from '../assets/logo.png'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_065045_c44942da-53c6-4804-b734-f9e07fc22e08.mp4'

const LOGOS = ['Vortex', 'Nimbus', 'Prysma', 'Cirrus', 'Kynder', 'Halcyn']

/* ----------------------------------------------------------------
   Video with a custom rAF-driven fade loop:
   - starts at opacity 0
   - 0.5s fade in at the start
   - 0.5s fade out before the end
   - on ended: opacity 0, wait 100ms, restart from 0
   ---------------------------------------------------------------- */
function useVideoFadeLoop(videoRef) {
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.style.opacity = '0'
    v.muted = true
    v.playsInline = true
    v.autoplay = true
    v.loop = false // we manage the loop manually

    const FADE = 0.5
    let raf = 0

    const tick = () => {
      const dur = v.duration
      if (Number.isFinite(dur) && dur > 0) {
        const t = v.currentTime
        let op = 1
        if (t < FADE)        op = t / FADE
        else if (t > dur - FADE) op = Math.max(0, (dur - t) / FADE)
        v.style.opacity = String(Math.max(0, Math.min(1, op)))
      }
      raf = requestAnimationFrame(tick)
    }

    const onEnded = () => {
      v.style.opacity = '0'
      setTimeout(() => {
        v.currentTime = 0
        v.play().catch(() => {})
      }, 100)
    }

    v.addEventListener('ended', onEnded)
    v.play().catch(() => {})
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      v.removeEventListener('ended', onEnded)
    }
  }, [videoRef])
}

/* ----------------------------------------------------------------
   Small helper for the marquee logo tiles
   ---------------------------------------------------------------- */
function LogoTile({ name }) {
  return (
    <div className="flex items-center gap-3 shrink-0">
      <div className="liquid-glass w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-semibold text-foreground">
        {name[0]}
      </div>
      <span className="text-base font-semibold text-foreground whitespace-nowrap">{name}</span>
    </div>
  )
}

export default function HeroVideo() {
  const videoRef = useRef(null)
  useVideoFadeLoop(videoRef)

  return (
    <div className="relative w-full overflow-hidden bg-background">
      {/* Background video */}
      <video
        ref={videoRef}
        src={VIDEO_URL}
        className="absolute inset-0 w-full h-full object-cover transition-none"
        style={{ opacity: 0 }}
        muted
        playsInline
      />

      {/* Hero content wrapper — sits above the video, blur is inside so it isn't clipped */}
      <section className="relative z-10 min-h-screen flex flex-col overflow-visible">
        {/* Blurred dark shape behind the content */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: '984px',
            height: '527px',
            opacity: 0.9,
            background: '#030712', // gray-950
            filter: 'blur(82px)',
          }}
          aria-hidden
        />

        {/* NAVBAR */}
        <header className="relative py-5 px-8 flex items-center justify-between">
          <a href="#top" className="flex items-center">
            <img src={logo} alt="creoit" style={{ height: 32 }} />
          </a>

          <nav className="hidden md:flex items-center gap-8 text-sm">
            <button className="flex items-center gap-1 text-foreground/90 hover:text-foreground transition-colors">
              Features <ChevronDown size={14} />
            </button>
            <button className="text-foreground/90 hover:text-foreground transition-colors">Solutions</button>
            <button className="text-foreground/90 hover:text-foreground transition-colors">Plans</button>
            <button className="flex items-center gap-1 text-foreground/90 hover:text-foreground transition-colors">
              Learning <ChevronDown size={14} />
            </button>
          </nav>

          <button className="liquid-glass rounded-full px-4 py-2 text-sm text-foreground hover:opacity-90 transition-opacity">
            Sign Up
          </button>
        </header>

        {/* Divider line under navbar (mt-[3px] per spec) */}
        <div
          className="relative h-px w-full mt-[3px] bg-gradient-to-r from-transparent via-white/20 to-transparent"
          aria-hidden
        />

        {/* HERO BODY — vertically centered */}
        <div className="relative flex-1 flex items-center justify-center px-8">
          <div className="text-center max-w-5xl mx-auto">
            <h1
              className="font-normal text-foreground"
              style={{
                fontFamily: 'General Sans, Geist Sans, system-ui, sans-serif',
                fontSize: 'clamp(72px, 14vw, 220px)',
                lineHeight: 1.02,
                letterSpacing: '-0.024em',
              }}
            >
              creo
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    'linear-gradient(to left, #6366f1, #a855f7, #fcd34d)',
                }}
              >
                it.
              </span>
            </h1>

            <p
              className="text-hero-sub text-lg leading-8 max-w-md mx-auto opacity-80"
              style={{ marginTop: '9px' }}
            >
              The most powerful AI ever deployed
              <br />
              in talent acquisition
            </p>

            <div style={{ marginTop: 25 }} className="flex justify-center">
              <button
                className="liquid-glass rounded-full text-foreground text-base font-medium hover:opacity-90 transition-opacity"
                style={{ paddingLeft: 29, paddingRight: 29, paddingTop: 24, paddingBottom: 24 }}
              >
                Schedule a Consult
              </button>
            </div>
          </div>
        </div>

        {/* LOGO MARQUEE — pinned bottom */}
        <div className="relative pb-10 px-8">
          <div className="max-w-5xl mx-auto flex items-center gap-12">
            <span className="text-foreground/50 text-sm shrink-0 leading-snug">
              Relied on by brands
              <br />
              across the globe
            </span>

            <div className="relative flex-1 overflow-hidden">
              {/* Edge fades so logos slide in/out softly */}
              <div
                className="pointer-events-none absolute inset-y-0 left-0 w-16 z-10"
                style={{ background: 'linear-gradient(to right, hsl(260 87% 3%) 0%, transparent 100%)' }}
              />
              <div
                className="pointer-events-none absolute inset-y-0 right-0 w-16 z-10"
                style={{ background: 'linear-gradient(to left, hsl(260 87% 3%) 0%, transparent 100%)' }}
              />

              <div className="flex gap-16 animate-marquee w-max">
                {[...LOGOS, ...LOGOS].map((name, i) => (
                  <LogoTile key={`${name}-${i}`} name={name} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
