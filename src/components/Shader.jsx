import { useEffect, useRef } from 'react'

const VERT = `
attribute vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }
`

// Cinematic orange light-ribbons over near-black.
// Strategy: domain-warped FBM raised to a high power so most pixels are
// effectively black and only narrow "ridges" survive — those become the silky
// glowing orange streaks. Multi-layered bloom (core / mid / wide halo) sells
// the volumetric feel. Strong vignette + subtle grain.
const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uScroll;

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
  float v = 0.0, a = 0.55;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for(int i=0;i<6;i++){
    v += a * noise(p);
    p = rot * p * 2.03;
    a *= 0.5;
  }
  return v;
}

// Ridged field — returns a value where peaks form narrow bright ribbons.
// 1 - |fbm - 0.5|*2 squared makes the "spine" thin and bright.
float ridged(vec2 p){
  float n = fbm(p);
  float r = 1.0 - abs(n - 0.5) * 2.0; // bright where n ≈ 0.5
  return r * r;                        // sharpen
}

float ribbons(vec2 uv, float t){
  // Stage 1 warp — slow, low-freq
  vec2 q = vec2(
    fbm(uv * 0.7 + vec2(0.0, t * 0.10)),
    fbm(uv * 0.7 + vec2(5.2, -t * 0.08))
  );
  // Stage 2 warp — bigger sweep, biased horizontally to feel like flowing light
  vec2 r = vec2(
    fbm(uv * 0.5 + 2.6 * q + vec2(t * 0.06, 0.0)),
    fbm(uv * 0.5 + 2.6 * q + vec2(0.0,      t * 0.05))
  );
  // Final ridged sample — anisotropic stretch so streaks feel elongated
  vec2 warped = uv * vec2(1.6, 0.9) + 3.2 * (r - 0.5);
  return ridged(warped);
}

void main(){
  vec2 res = uRes;
  vec2 uv = (gl_FragCoord.xy - 0.5*res) / min(res.x, res.y);
  vec2 m  = (uMouse        - 0.5*res) / min(res.x, res.y);

  float t = uTime * 0.10 + uScroll * 0.6;

  // Sample the ribbon field once + a tiny chromatic split for richness
  vec2 ca = normalize(uv - m*0.5 + 1e-5) * 0.006;
  float r1 = ribbons(uv + ca, t);
  float r2 = ribbons(uv,       t);
  float r3 = ribbons(uv - ca, t);

  // High-contrast: most of the screen is black; only the spines survive
  float core = pow(r2, 4.0);          // tight bright spine
  float mid  = pow(r2, 1.8) * 0.55;   // surrounding glow
  float wide = pow(r2, 0.9) * 0.18;   // broad halo

  // Palette — pure warm, no purple
  vec3 cBlack  = vec3(0.008, 0.005, 0.012);
  vec3 cOrange = vec3(1.00, 0.42, 0.12);
  vec3 cAmber  = vec3(1.00, 0.72, 0.32);
  vec3 cWhite  = vec3(1.00, 0.92, 0.78);
  vec3 cDeep   = vec3(0.22, 0.05, 0.02);

  vec3 col = cBlack;
  col += cDeep   * wide * 1.4;
  col += cOrange * mid  * 1.6;
  col += cAmber  * core * 2.2;
  col += cWhite  * pow(core, 2.5) * 1.6;          // hot pearlescent peaks

  // Chromatic split on the peaks (R/B sampled with offset → fringe)
  vec3 chrom = vec3(
    pow(r1, 4.0),
    pow(r2, 4.0),
    pow(r3, 4.0)
  );
  col += chrom * vec3(0.6, 0.25, 0.10) * 0.4;

  // Mouse heat — small additive amber pool that follows the cursor
  float md = exp(-2.0 * length(uv - m*0.85));
  col += vec3(1.0, 0.55, 0.18) * md * 0.20;

  // Aggressive vignette — pulls the edges to black so streaks sit in space
  float vign = smoothstep(1.45, 0.20, length(uv * vec2(0.95, 1.05)));
  col *= 0.15 + 0.95 * vign;

  // Mild bloom-like lift on the brightest pixels (cheap fake bloom)
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  col += col * smoothstep(0.55, 1.20, lum) * 0.35;

  // Grain
  float g = (hash(gl_FragCoord.xy + t) - 0.5) * 0.035;
  col += g;

  // Reinhard tonemap so highlights roll off instead of clipping
  col = col / (1.0 + col * 0.55);

  gl_FragColor = vec4(col, 1.0);
}
`

export default function Shader() {
  const canvasRef = useRef(null)

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
    const uScroll = gl.getUniformLocation(prog, 'uScroll')

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const mouse = { x: target.x, y: target.y }
    const onMove = e => {
      target.x = e.clientX
      target.y = window.innerHeight - e.clientY
    }
    window.addEventListener('pointermove', onMove)

    let scroll = 0
    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      scroll = window.scrollY / max
    }
    window.addEventListener('scroll', onScroll, { passive: true })

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
      mouse.x += (target.x - mouse.x) * 0.06
      mouse.y += (target.y - mouse.y) * 0.06
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uTime, t)
      gl.uniform1f(uScroll, scroll)
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
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return <canvas ref={canvasRef} className="bg" />
}
