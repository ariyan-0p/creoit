import { useEffect, useRef, useState } from 'react'
import { Glass } from '../components/Glass'

/* ============================================================
   Hooks
   ============================================================ */
function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            el.classList.add('in-view')
            io.unobserve(el)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}

// Counts a number up when it enters the viewport
function useCountUp(target, duration = 1400) {
  const [value, setValue] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (!e.isIntersecting) return
          io.unobserve(el)
          const start = performance.now()
          const tick = now => {
            const t = Math.min(1, (now - start) / duration)
            const eased = 1 - Math.pow(1 - t, 3)
            setValue(Math.round(target * eased))
            if (t < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        })
      },
      { threshold: 0.4 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [target, duration])
  return [value, ref]
}

// Scroll progress 0..1 for an element being scrolled through the viewport
function useSectionProgress() {
  const [p, setP] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
        const vh = window.innerHeight
        // 0 as top of section reaches middle of viewport, 1 as bottom does
        const total = r.height + vh * 0.4
        const passed = vh - r.top - vh * 0.3
        const v = Math.max(0, Math.min(1, passed / total))
        setP(v)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
  return [p, ref]
}

/* ============================================================
   SERVICES — Bento grid, mixed tile sizes, sticky header
   ============================================================ */
const SERVICES = [
  { num: '01', title: 'SEO & Organic',    blurb: 'Technical, on-page and authority work that compounds traffic month over month.', size: 'wide',   accent: 'orange' },
  { num: '02', title: 'Paid Media',       blurb: 'Google, Meta, TikTok, LinkedIn — performance creative and full-funnel buying.',  size: 'tall',   accent: 'violet' },
  { num: '03', title: 'Social Media',     blurb: 'Always-on strategy, content and community.',                                       size: 'small',  accent: 'orange' },
  { num: '04', title: 'Content',          blurb: 'Editorial, long-form, video, built for distribution.',                             size: 'small',  accent: 'amber'  },
  { num: '05', title: 'Brand & Identity', blurb: 'Positioning, naming and visual systems that scale.',                               size: 'wide',   accent: 'orange' },
  { num: '06', title: 'Web & Product',    blurb: 'High-converting sites, landing pages and headless CMS.',                           size: 'small',  accent: 'violet' },
  { num: '07', title: 'Email & CRM',      blurb: 'Klaviyo, HubSpot — onboarding, nurture and retention.',                            size: 'small',  accent: 'amber'  },
  { num: '08', title: 'Video & Motion',   blurb: 'Ads, explainers, motion graphics — social-native production.',                     size: 'small',  accent: 'orange' },
  { num: '09', title: 'Influencer',       blurb: 'Creator sourcing, briefing and measurement.',                                      size: 'small',  accent: 'violet' },
  { num: '10', title: 'PR & Comms',       blurb: 'Earned media, founder positioning, launches.',                                     size: 'small',  accent: 'amber'  },
  { num: '11', title: 'CRO & Analytics',  blurb: 'A/B tests, funnel teardowns, GA4 and dashboards.',                                 size: 'wide',   accent: 'orange' },
  { num: '12', title: 'AI & Automation',  blurb: 'Generative ops, agent workflows, marketing tooling.',                              size: 'tall',   accent: 'violet' },
]

export function Services() {
  const ref = useReveal()
  return (
    <section id="services" className="section section-services" ref={ref}>
      <div className="bg-orbs" aria-hidden>
        <span className="orb orb-1" />
        <span className="orb orb-2" />
        <span className="orb orb-3" />
      </div>

      <header className="section-head">
        <span className="eyebrow">Services</span>
        <h2 className="section-title">Every marketing channel,<br />under one roof.</h2>
        <p className="section-lede">
          One integrated team across strategy, brand, performance, content and creative.
          No vendor sprawl, no half-owned outcomes.
        </p>
      </header>

      <div className="bento">
        {SERVICES.map(s => (
          <Glass key={s.num} shape="card" className={`svc svc-${s.size} svc-${s.accent}`}>
            <div className="svc-inner">
              <span className="svc-num">{s.num}</span>
              <h3 className="svc-title">{s.title}</h3>
              <p className="svc-blurb">{s.blurb}</p>
              <span className="svc-arrow">→</span>
            </div>
          </Glass>
        ))}
      </div>
    </section>
  )
}

/* ============================================================
   PROCESS — Vertical timeline, animated line that fills on scroll
   ============================================================ */
const STEPS = [
  { n: '01', t: 'Discover',  d: 'Audits across brand, channels, analytics and competitors. We surface the actual bottleneck.' },
  { n: '02', t: 'Strategy',  d: 'A 90-day plan with channel mix, KPIs and creative direction. One source of truth, no vendor sprawl.' },
  { n: '03', t: 'Execute',   d: 'Embedded pod: strategist, creative, paid, SEO and analyst. Weekly shipping cadence, not monthly decks.' },
  { n: '04', t: 'Optimize',  d: 'Compounding wins via testing, lifecycle and channel expansion as performance unlocks new ceilings.' },
]

export function Process() {
  const [progress, progRef] = useSectionProgress()
  const ref = useReveal()
  return (
    <section id="process" className="section section-process" ref={ref}>
      <div className="bg-blueprint" aria-hidden />

      <header className="section-head">
        <span className="eyebrow">Process</span>
        <h2 className="section-title">How we work.</h2>
        <p className="section-lede">
          A repeatable system, not a black box. Same operating model from your first
          audit to your tenth quarterly review.
        </p>
      </header>

      <div className="timeline" ref={progRef}>
        <div className="rail">
          <div className="rail-fill" style={{ height: `${progress * 100}%` }} />
        </div>

        {STEPS.map((s, i) => (
          <div key={s.n} className={`t-row t-row-${i % 2 === 0 ? 'l' : 'r'}`}>
            <div className="t-marker">
              <span className="t-marker-dot" />
              <span className="t-marker-ring" />
            </div>
            <Glass shape="card" className="t-card">
              <div className="t-card-inner">
                <span className="step-n">{s.n}</span>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            </Glass>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ============================================================
   WORK — Big-metric case study cards with animated counters
   ============================================================ */
const CASES = [
  { tag: 'B2B SaaS',    value: 412, suffix: '%', label: 'Pipeline growth',      title: 'From Series A to category leader',   blurb: 'Built the inbound engine, organic + lifecycle, that took a vertical SaaS from 50 to 600 demos / month.' },
  { tag: 'DTC Beauty',  value: 3.2, suffix: '×', label: 'Blended ROAS',         title: 'Profitable paid + creator engine',   blurb: 'Rebuilt creative testing, lifecycle flows and creator program — paid scaled 5× without losing margin.', decimals: 1 },
  { tag: 'Fintech',     value: 1,   suffix: '',  label: 'Organic ranking',      title: 'Rank-first content strategy',        blurb: 'Authority + cluster strategy + technical SEO took a regulated category from page 4 to page 1.', prefix: '#' },
  { tag: 'Marketplace', value: 38,  suffix: '%', label: 'CAC reduction',        title: 'Full-funnel media overhaul',         blurb: 'Killed the bottom-funnel-only mindset. Upper-funnel YouTube + creator drove a step-change in efficiency.', prefix: '−' },
]

function MetricCard({ c }) {
  const [n, ref] = useCountUp(c.value * (c.decimals ? 10 : 1))
  const display = c.decimals ? (n / 10).toFixed(c.decimals) : n
  return (
    <Glass shape="card" className="case">
      <div className="case-inner" ref={ref}>
        <div className="case-head">
          <span className="case-tag">{c.tag}</span>
          <span className="case-label">{c.label}</span>
        </div>
        <div className="case-metric">
          <span className="metric-prefix">{c.prefix ?? ''}</span>
          <span className="metric-num">{display}</span>
          <span className="metric-suffix">{c.suffix}</span>
        </div>
        <h3 className="case-title">{c.title}</h3>
        <p className="case-blurb">{c.blurb}</p>
        <a href="#contact" className="case-link">Read the story →</a>
      </div>
    </Glass>
  )
}

export function Work() {
  const ref = useReveal()
  return (
    <section id="work" className="section section-work" ref={ref}>
      <div className="bg-warm" aria-hidden />

      <header className="section-head">
        <span className="eyebrow">Selected work</span>
        <h2 className="section-title">Results, not decks.</h2>
        <p className="section-lede">
          A few of the engagements we're proud of. Industries change; the operating
          model doesn't.
        </p>
      </header>

      <div className="cases">
        {CASES.map((c, i) => <MetricCard key={i} c={c} />)}
      </div>
    </section>
  )
}

/* ============================================================
   TESTIMONIALS — Big rotating hero quote + client logo ticker
   ============================================================ */
const QUOTES = [
  { q: 'They operate like an embedded team, not a vendor. We tripled paid output without adding heads.',       a: 'Maya Iyer',      r: 'VP Marketing, Lumen' },
  { q: "Best agency relationship we've had. They actually own outcomes instead of hiding behind dashboards.",   a: 'Daniel Cho',     r: 'Founder, Northpath' },
  { q: 'The team rebuilt our entire funnel in 90 days. Our pipeline math finally makes sense.',                a: 'Priya Shankar',  r: 'CMO, Verda' },
]
const CLIENTS = ['Lumen', 'Northpath', 'Verda', 'Arclight', 'Kavan', 'Meridian', 'Suno', 'Halcyn']

export function Testimonials() {
  const ref = useReveal()
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI(p => (p + 1) % QUOTES.length), 5200)
    return () => clearInterval(id)
  }, [])
  const q = QUOTES[i]
  return (
    <section id="about" className="section section-quotes" ref={ref}>
      <div className="bg-intimate" aria-hidden />
      <div className="quote-mark" aria-hidden>"</div>

      <header className="section-head">
        <span className="eyebrow">Clients</span>
        <h2 className="section-title">Operators trust us<br />with their growth.</h2>
      </header>

      <div className="quote-hero" key={i}>
        <p className="quote-hero-text">"{q.q}"</p>
        <div className="quote-hero-attrib">
          <div className="quote-avatar" aria-hidden>{q.a[0]}</div>
          <div>
            <strong>{q.a}</strong>
            <span>{q.r}</span>
          </div>
        </div>
        <div className="quote-dots" role="tablist">
          {QUOTES.map((_, ix) => (
            <button
              key={ix}
              className={`qd${ix === i ? ' is-on' : ''}`}
              onClick={() => setI(ix)}
              aria-label={`Show quote ${ix + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="client-ticker" aria-label="Selected clients">
        <div className="client-track">
          {[...CLIENTS, ...CLIENTS].map((c, ix) => (
            <span key={`${c}-${ix}`} className="client-item">{c}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   CTA — Full-bleed dramatic, beacon pulse, oversize typography
   ============================================================ */
export function ContactCTA() {
  const ref = useReveal()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const onSubmit = e => {
    e.preventDefault()
    if (!email) return
    setSent(true)
    setEmail('')
  }
  return (
    <section id="contact" className="section section-cta" ref={ref}>
      <div className="cta-beacon" aria-hidden>
        <span className="pulse pulse-1" />
        <span className="pulse pulse-2" />
        <span className="pulse pulse-3" />
      </div>

      <span className="eyebrow eyebrow--center">Let's build</span>
      <h2 className="cta-mega">
        Ready to
        <br />
        <em>compound?</em>
      </h2>
      <p className="cta-sub">
        Tell us a bit about your company. We'll come back in 24 hours with a 30-minute
        intro and an honest read on fit.
      </p>

      <Glass shape="pill" className="cta-form-glass">
        <form className="cta-form" onSubmit={onSubmit}>
          <input
            type="email"
            required
            placeholder={sent ? 'Talk soon ✓' : 'you@company.com'}
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={sent}
            aria-label="Email"
          />
          <button type="submit" disabled={sent}>{sent ? 'Sent' : 'Book intro call'}</button>
        </form>
      </Glass>

      <div className="cta-meta">
        <a href="mailto:hello@creoit.studio">hello@creoit.studio</a>
        <span className="dot-sep">•</span>
        <span>Mon–Fri, 9–6 IST</span>
        <span className="dot-sep">•</span>
        <span>Working globally</span>
      </div>
    </section>
  )
}

/* ============================================================
   FOOTER — Giant wordmark + rich columns
   ============================================================ */
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="footer-logo">creoit<span>.</span></div>
          <p>Full-stack marketing for ambitious companies.</p>
          <div className="footer-socials">
            <a href="#" aria-label="X">X</a>
            <a href="#" aria-label="LinkedIn">LI</a>
            <a href="#" aria-label="Instagram">IG</a>
            <a href="#" aria-label="Dribbble">DR</a>
          </div>
        </div>
        <div className="footer-col">
          <h4>Services</h4>
          <a href="#services">SEO</a>
          <a href="#services">Paid Media</a>
          <a href="#services">Social</a>
          <a href="#services">Content</a>
          <a href="#services">Brand</a>
          <a href="#services">Web</a>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <a href="#process">Process</a>
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          <a href="mailto:hello@creoit.studio">hello@creoit.studio</a>
          <a href="#">Bengaluru, IN</a>
          <a href="#">+91 000 000 0000</a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>©2026 creoit. All rights reserved.</span>
        <span>Made in India · Working globally</span>
      </div>

      {/* Giant edge-to-edge wordmark */}
      <div className="footer-mega" aria-hidden>creoit.</div>
    </footer>
  )
}
