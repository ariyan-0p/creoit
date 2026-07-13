import { useEffect, useRef, useState } from 'react'
import { Glass } from '../components/Glass'

/* ============================================================
   Reveal-on-scroll helper — adds .in-view when intersected
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

/* ============================================================
   NAV
   ============================================================ */
export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className={`nav-wrap${scrolled ? ' is-scrolled' : ''}`}>
      <Glass shape="pill" className="nav">
        <a href="#top" className="brand">creoit<span>.</span></a>
        <nav className="nav-links" aria-label="Primary">
          <a href="#services">Services</a>
          <a href="#process">Process</a>
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
        <a href="#contact" className="nav-cta">Get started →</a>
      </Glass>
    </div>
  )
}

/* ============================================================
   HERO
   ============================================================ */
export function Hero() {
  return (
    <section id="top" className="hero-section">
      <Glass shape="pill" className="hero-pill">
        <span className="dot" /> <span>Now booking Q3 partnerships</span>
      </Glass>

      <h1 className="hero-title">
        Marketing that
        <br />
        <em>actually compounds.</em>
      </h1>

      <p className="hero-sub">
        We're a full-service digital marketing studio building brands, channels and
        revenue engines for ambitious companies. SEO to social, brand to performance —
        one team, one playbook.
      </p>

      <div className="hero-ctas">
        <a href="#contact" className="btn btn-primary">Start a project</a>
        <a href="#services" className="btn btn-ghost">See services →</a>
      </div>

      <div className="hero-stats">
        <div><strong>+340%</strong><span>avg. organic growth</span></div>
        <div><strong>2.4×</strong><span>blended ROAS</span></div>
        <div><strong>60+</strong><span>brands scaled</span></div>
      </div>
    </section>
  )
}

/* ============================================================
   SERVICES — 12 cards, every type of marketing
   ============================================================ */
const SERVICES = [
  { num: '01', title: 'SEO',                  blurb: 'Technical, on-page and authority work that compounds traffic month over month.' },
  { num: '02', title: 'Paid Media',           blurb: 'Google, Meta, TikTok, LinkedIn — performance creative and full-funnel buying.' },
  { num: '03', title: 'Social Media',         blurb: 'Always-on social: strategy, content production, community and engagement.' },
  { num: '04', title: 'Content Marketing',    blurb: 'Editorial calendars, long-form, video, repurposing — built for distribution.' },
  { num: '05', title: 'Brand & Identity',     blurb: 'Positioning, naming, visual systems and brand books that scale.' },
  { num: '06', title: 'Web Design & Dev',     blurb: 'High-converting marketing sites, landing pages and headless CMS builds.' },
  { num: '07', title: 'Email & Lifecycle',    blurb: 'Klaviyo, HubSpot, Customer.io — onboarding, nurture and retention flows.' },
  { num: '08', title: 'Video & Motion',       blurb: 'Ads, explainers, motion graphics and short-form social-native production.' },
  { num: '09', title: 'Influencer & Creator', blurb: 'Sourcing, briefing, contracting and measuring creator-led campaigns.' },
  { num: '10', title: 'PR & Comms',           blurb: 'Earned media, founder positioning and product launches that get covered.' },
  { num: '11', title: 'CRO & Analytics',      blurb: 'A/B testing, funnel teardowns, GA4 / dbt pipelines and dashboards.' },
  { num: '12', title: 'AI & Automation',      blurb: 'Generative content ops, agent workflows and marketing tooling glue-code.' },
]

export function Services() {
  const ref = useReveal()
  return (
    <section id="services" className="section section-services" ref={ref}>
      <header className="section-head">
        <span className="eyebrow">Services</span>
        <h2 className="section-title">Every marketing channel,<br />under one roof.</h2>
        <p className="section-lede">
          Most agencies do one thing well and the rest is duct tape. We staff every
          channel deeply so your strategy is actually integrated — not stitched
          together from four different vendors.
        </p>
      </header>

      <div className="services-grid">
        {SERVICES.map(s => (
          <Glass key={s.num} shape="card" className="svc">
            <span className="svc-num">{s.num}</span>
            <h3 className="svc-title">{s.title}</h3>
            <p className="svc-blurb">{s.blurb}</p>
            <span className="svc-arrow">→</span>
          </Glass>
        ))}
      </div>
    </section>
  )
}

/* ============================================================
   PROCESS — 4 steps
   ============================================================ */
const STEPS = [
  { n: '01', t: 'Discover',  d: 'Audits across brand, channels, analytics and competitive landscape. We surface the actual bottleneck.' },
  { n: '02', t: 'Strategy',  d: 'A 90-day plan with channel mix, KPIs and creative direction. One source of truth — no vendor sprawl.' },
  { n: '03', t: 'Execute',   d: 'Embedded pod: strategist, creative, paid, SEO and analyst. Weekly shipping cadence, not monthly decks.' },
  { n: '04', t: 'Optimize',  d: 'Compounding wins via testing, lifecycle and channel expansion as performance unlocks new ceilings.' },
]

export function Process() {
  const ref = useReveal()
  return (
    <section id="process" className="section section-process" ref={ref}>
      <header className="section-head">
        <span className="eyebrow">Process</span>
        <h2 className="section-title">How we work.</h2>
        <p className="section-lede">
          A repeatable system, not a black box. Same operating model from your first
          audit to your tenth quarterly review.
        </p>
      </header>

      <div className="steps">
        {STEPS.map(s => (
          <Glass key={s.n} shape="card" className="step">
            <span className="step-n">{s.n}</span>
            <h3>{s.t}</h3>
            <p>{s.d}</p>
          </Glass>
        ))}
      </div>
    </section>
  )
}

/* ============================================================
   WORK — case study previews (placeholder content)
   ============================================================ */
const CASES = [
  { tag: 'B2B SaaS',     metric: '+412% pipeline',     title: 'From Series A to category leader',  blurb: 'Built the inbound engine, organic + lifecycle, that took a vertical SaaS from 50 to 600 demos / month.' },
  { tag: 'DTC Beauty',   metric: '3.2× blended ROAS',  title: 'Profitable paid + creator engine',   blurb: 'Rebuilt creative testing, lifecycle flows and creator program — paid scaled 5× without losing margin.' },
  { tag: 'Fintech',      metric: '#1 organic rank',    title: 'Rank-first content strategy',        blurb: 'Authority + cluster strategy + technical SEO took a regulated category from page 4 to page 1.' },
  { tag: 'Marketplace',  metric: '−38% CAC',           title: 'Full-funnel media overhaul',         blurb: 'Killed the bottom-funnel-only mindset. Upper-funnel YouTube + creator drove a step-change in efficiency.' },
]

export function Work() {
  const ref = useReveal()
  return (
    <section id="work" className="section section-work" ref={ref}>
      <header className="section-head">
        <span className="eyebrow">Work</span>
        <h2 className="section-title">Selected results.</h2>
        <p className="section-lede">
          A few of the engagements we're proud of. Industries change; the operating
          model doesn't.
        </p>
      </header>

      <div className="cases">
        {CASES.map((c, i) => (
          <Glass key={i} shape="card" className="case">
            <div className="case-head">
              <span className="case-tag">{c.tag}</span>
              <span className="case-metric">{c.metric}</span>
            </div>
            <h3 className="case-title">{c.title}</h3>
            <p className="case-blurb">{c.blurb}</p>
            <a href="#contact" className="case-link">Read the story →</a>
          </Glass>
        ))}
      </div>
    </section>
  )
}

/* ============================================================
   TESTIMONIALS
   ============================================================ */
const QUOTES = [
  { q: 'They operate like an embedded team, not a vendor. We tripled paid output without adding heads.', a: 'Maya Iyer', r: 'VP Marketing, Lumen' },
  { q: 'Best agency relationship we\'ve had. They actually own outcomes instead of hiding behind dashboards.', a: 'Daniel Cho', r: 'Founder, Northpath' },
  { q: 'The team rebuilt our entire funnel in 90 days. Our pipeline math finally makes sense.', a: 'Priya Shankar', r: 'CMO, Verda' },
]

export function Testimonials() {
  const ref = useReveal()
  return (
    <section id="about" className="section section-quotes" ref={ref}>
      <header className="section-head">
        <span className="eyebrow">Clients</span>
        <h2 className="section-title">Operators trust us<br />with their growth.</h2>
      </header>

      <div className="quotes">
        {QUOTES.map((q, i) => (
          <Glass key={i} shape="card" className="quote">
            <p className="quote-text">"{q.q}"</p>
            <div className="quote-attrib">
              <strong>{q.a}</strong>
              <span>{q.r}</span>
            </div>
          </Glass>
        ))}
      </div>
    </section>
  )
}

/* ============================================================
   CTA + CONTACT
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
      <Glass shape="card" className="cta">
        <span className="eyebrow eyebrow--center">Let's build</span>
        <h2 className="cta-title">Ready to compound?</h2>
        <p className="cta-sub">
          Tell us a bit about your company. We'll come back in 24 hours with a 30-minute
          intro and an honest read on whether we're the right fit.
        </p>
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
        <div className="cta-meta">
          <span>hello@creoit.studio</span>
          <span className="dot-sep">•</span>
          <span>Mon–Fri, 9–6 IST</span>
        </div>
      </Glass>
    </section>
  )
}

/* ============================================================
   FOOTER
   ============================================================ */
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="footer-logo">creoit<span>.</span></div>
          <p>Full-stack marketing for ambitious companies.</p>
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
          <h4>Elsewhere</h4>
          <a href="#">X / Twitter</a>
          <a href="#">LinkedIn</a>
          <a href="#">Instagram</a>
          <a href="#">Dribbble</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>©2026 creoit. All rights reserved.</span>
        <span>Made in India · Working globally</span>
      </div>
      <div className="outline-wordmark" aria-hidden>creoit</div>
    </footer>
  )
}
