import { useEffect, useRef, useState } from 'react'
import './App.css'

const VERT = `
attribute vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }
`

// Next-level fluid metal:
// - 2-stage domain-warped FBM
// - Purple base (#140021) with warm orange/amber highlights
// - Mouse-reactive heat halo
// - Per-channel offset sampling for a chromatic-aberration vibe
// - Subtle film grain + vignette
const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;

float hash(vec2 p){
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  float a = hash(i);
  float b = hash(i+vec2(1.,0.));
  float c = hash(i+vec2(0.,1.));
  float d = hash(i+vec2(1.,1.));
  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for(int i=0;i<6;i++){
    v += a * noise(p);
    p = rot * p * 2.02;
    a *= 0.5;
  }
  return v;
}

// Returns the scalar field value at uv. Sampled per-channel with tiny offsets
// to fake chromatic aberration on the highlights.
float field(vec2 uv, float t){
  // Stage 1 warp
  vec2 q = vec2(
    fbm(uv + vec2(0.0, 0.0) + t*0.10),
    fbm(uv + vec2(5.2, 1.3) - t*0.08)
  );
  // Stage 2 warp (bigger, slower)
  vec2 r = vec2(
    fbm(uv + 3.5*q + vec2(1.7, 9.2) + t*0.15),
    fbm(uv + 3.5*q + vec2(8.3, 2.8) - t*0.12)
  );
  return fbm(uv + 2.4*r);
}

void main(){
  vec2 res = uRes;
  vec2 uv = (gl_FragCoord.xy - 0.5*res) / min(res.x, res.y);
  vec2 m  = (uMouse        - 0.5*res) / min(res.x, res.y);

  float t = uTime * 0.18;
  vec2 p = uv * 1.25;

  // Chromatic offsets — sample the field 3x with small spatial offsets
  vec2 ca = normalize(uv - m*0.6 + 1e-5) * 0.012;
  float fr = field(p + ca, t);
  float fg = field(p,       t);
  float fb = field(p - ca, t);

  // Map field to color: deep purple base -> magenta -> warm orange -> hot amber
  vec3 cBase   = vec3(0.078, 0.000, 0.129);   // #140021 base
  vec3 cDeep   = vec3(0.21, 0.04, 0.36);      // violet shadow
  vec3 cMag    = vec3(0.58, 0.10, 0.34);      // dusty magenta mid
  vec3 cOrange = vec3(1.00, 0.46, 0.16);      // warm orange highlight
  vec3 cAmber  = vec3(1.00, 0.78, 0.42);      // hot amber peak

  vec3 col;
  // R channel
  {
    float f = fr;
    vec3 c = mix(cBase, cDeep,   smoothstep(0.20, 0.50, f));
    c = mix(c, cMag,    smoothstep(0.45, 0.70, f));
    c = mix(c, cOrange, smoothstep(0.62, 0.82, f));
    c = mix(c, cAmber,  smoothstep(0.82, 0.96, f));
    col.r = c.r;
  }
  {
    float f = fg;
    vec3 c = mix(cBase, cDeep,   smoothstep(0.20, 0.50, f));
    c = mix(c, cMag,    smoothstep(0.45, 0.70, f));
    c = mix(c, cOrange, smoothstep(0.62, 0.82, f));
    c = mix(c, cAmber,  smoothstep(0.82, 0.96, f));
    col.g = c.g;
  }
  {
    float f = fb;
    vec3 c = mix(cBase, cDeep,   smoothstep(0.20, 0.50, f));
    c = mix(c, cMag,    smoothstep(0.45, 0.70, f));
    c = mix(c, cOrange, smoothstep(0.62, 0.82, f));
    c = mix(c, cAmber,  smoothstep(0.82, 0.96, f));
    col.b = c.b;
  }

  // Specular streaks — narrow bright bands on the high field values
  float spec = smoothstep(0.86, 0.99, fg);
  col += vec3(1.0, 0.65, 0.30) * spec * 0.55;

  // Mouse heat halo — orange glow that follows the cursor
  float md = exp(-2.2 * length(uv - m*0.85));
  col += vec3(1.0, 0.45, 0.15) * md * 0.18;

  // Vignette — pull the corners into deep purple so content reads
  float vign = smoothstep(1.4, 0.25, length(uv));
  col = mix(cBase * 0.55, col, 0.4 + 0.6*vign);

  // Subtle filmic grain
  float g = (hash(gl_FragCoord.xy + t) - 0.5) * 0.045;
  col += g;

  // Mild tonemap (Reinhard-ish) to keep highlights from clipping
  col = col / (1.0 + col * 0.65);

  gl_FragColor = vec4(col, 1.0);
}
`

function useShader(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl', { antialias: true, premultipliedAlpha: false })
    if (!gl) return

    const compile = (type, src) => {
      const s = gl.createShader(type)
      gl.shaderSource(s, src); gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s))
      return s
    }
    const prog = gl.createProgram()
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog); gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(prog, 'aPos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(prog, 'uRes')
    const uTime = gl.getUniformLocation(prog, 'uTime')
    const uMouse = gl.getUniformLocation(prog, 'uMouse')

    // Smoothed mouse — start in the center so the halo isn't stuck in a corner
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const mouse = { x: target.x, y: target.y }
    const onMove = e => {
      target.x = e.clientX
      target.y = window.innerHeight - e.clientY
    }
    window.addEventListener('pointermove', onMove)

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    const start = performance.now()
    let raf = 0
    const loop = () => {
      const t = (performance.now() - start) / 1000
      // Easing for buttery cursor follow
      mouse.x += (target.x - mouse.x) * 0.06
      mouse.y += (target.y - mouse.y) * 0.06
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uTime, t)
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      gl.uniform2f(uMouse, mouse.x * dpr, mouse.y * dpr)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      raf = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
    }
  }, [canvasRef])
}

function App() {
  const canvasRef = useRef(null)
  useShader(canvasRef)

  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const onSubmit = e => {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
    setEmail('')
  }

  return (
    <div className="page">
      <canvas ref={canvasRef} className="bg" />
      <div className="grain" aria-hidden />
      <div className="vignette" aria-hidden />

      <main className="center">
        <div className="pill" aria-label="Waitlist badge">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          <span>Waitlist</span>
        </div>

        <h1 className="hero">Coming soon!</h1>

        <form className={`card${submitted ? ' is-submitted' : ''}`} onSubmit={onSubmit}>
          <div className="card-title">Join our waitlist!</div>
          <p className="card-sub">
            Sign up for our newsletter to receive the latest updates<br />
            and insights straight to your inbox.
          </p>
          <div className="form-row">
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={submitted ? "You're on the list ✓" : 'Enter email'}
              className="email-input"
              aria-label="Email address"
              disabled={submitted}
            />
            <button type="submit" className="submit-btn" disabled={submitted}>
              {submitted ? 'Joined' : 'Join Waitlist'}
            </button>
          </div>
        </form>

        <div className="socials" aria-label="Social links">
          <a href="#" aria-label="X" className="soc">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
              <path d="M18.244 2H21.5l-7.59 8.67L23 22h-6.94l-5.43-7.1L4.4 22H1.14l8.12-9.27L1 2h7.1l4.91 6.49L18.24 2Zm-1.22 18h1.86L7.06 4H5.1l11.93 16Z" />
            </svg>
          </a>
          <a href="#" aria-label="Facebook" className="soc">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
              <path d="M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.25-1.5 1.55-1.5H17V4.6c-.28-.04-1.23-.12-2.34-.12-2.31 0-3.9 1.41-3.9 4v2.42H8.1V14h2.66v8h2.74Z" />
            </svg>
          </a>
          <a href="#" aria-label="Instagram" className="soc">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
          </a>
        </div>
      </main>

      <div className="outline-wordmark" aria-hidden>creoit</div>

      <footer className="bottom">
        <span>©2026 creoit</span>
        <span className="dot-sep">•</span>
        <span>Marketing services</span>
        <span className="dot-sep">•</span>
        <span>v0.1</span>
      </footer>
    </div>
  )
}

export default App
