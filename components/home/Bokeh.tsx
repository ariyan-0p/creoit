"use client";

/**
 * Bokeh — a field of out-of-focus light discs (OGL, one draw call).
 * Discs sharpen into crisp rings near the pointer: the lens "finds focus".
 *
 * Perf notes: DPR capped at 1.5, ~64 gl.POINTS, no per-frame allocation,
 * renders only while the hero is on screen and the tab is visible.
 */

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Geometry } from "ogl";
import { gsap } from "@/lib/gsap";
import { pointer } from "@/lib/pointer";

const COUNT = 64;

const vertex = /* glsl */ `
  attribute vec2 position;
  attribute vec4 seed;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uAspect;
  uniform float uDpr;
  uniform float uScale;
  varying float vFocus;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float rise = fract((position.y * 0.5 + 0.5) + uTime * (0.006 + seed.x * 0.012));
    vec2 p = vec2(position.x, rise * 2.4 - 1.2);
    p.x += sin(uTime * 0.25 + seed.y * 6.2831) * 0.05;
    p += uMouse * (seed.z - 0.4) * 0.07;

    float d = distance(vec2(p.x * uAspect, p.y), vec2(uMouse.x * uAspect, uMouse.y));
    float focus = smoothstep(0.62, 0.05, d);

    float base = seed.z * 150.0 + 26.0;
    float size = mix(base, base * 0.34, focus) * uDpr * uScale;
    gl_PointSize = min(size, 320.0);
    gl_Position = vec4(p, 0.0, 1.0);

    vec3 warm = vec3(0.50, 0.30, 1.0);
    vec3 cream = vec3(0.86, 0.80, 1.0);
    vec3 rose = vec3(0.66, 0.54, 1.0);
    vColor = seed.w < 0.45 ? warm : (seed.w < 0.8 ? cream : rose);
    vFocus = focus;
    float edgeFade = smoothstep(1.2, 0.85, abs(p.y)) ;
    vAlpha = mix(0.17, 0.85, focus) * edgeFade * (0.6 + seed.x * 0.6);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  varying float vFocus;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float r = length(gl_PointCoord - 0.5) * 2.0;
    if (r > 1.0) discard;
    float soft = 1.0 - smoothstep(0.0, 1.0, r);
    float hard = 1.0 - smoothstep(0.88, 1.0, r);
    float rim = smoothstep(0.7, 0.93, r) * (1.0 - smoothstep(0.93, 1.0, r));
    float shape = mix(soft * 0.8, hard * 0.55 + rim * 0.9, vFocus);
    float a = shape * vAlpha;
    gl_FragColor = vec4(vColor * a, a);
  }
`;

export function Bokeh({ className }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const renderer = new Renderer({ alpha: true, dpr, antialias: false, premultipliedAlpha: true });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    el.appendChild(gl.canvas);
    gl.canvas.style.cssText = "width:100%;height:100%;display:block";

    const position = new Float32Array(COUNT * 2);
    const seed = new Float32Array(COUNT * 4);
    for (let i = 0; i < COUNT; i++) {
      position[i * 2] = Math.random() * 2.2 - 1.1;
      position[i * 2 + 1] = Math.random() * 2 - 1;
      seed[i * 4] = Math.random();
      seed[i * 4 + 1] = Math.random();
      seed[i * 4 + 2] = Math.pow(Math.random(), 1.6);
      seed[i * 4 + 3] = Math.random();
    }
    const geometry = new Geometry(gl, {
      position: { size: 2, data: position },
      seed: { size: 4, data: seed },
    });

    const program = new Program(gl, {
      vertex,
      fragment,
      transparent: true,
      depthTest: false,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: [0, 0] },
        uAspect: { value: 1 },
        uDpr: { value: dpr },
        uScale: { value: 1 },
      },
    });
    const mesh = new Mesh(gl, { geometry, program, mode: gl.POINTS });

    const resize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      renderer.setSize(w, h);
      program.uniforms.uAspect.value = w / h;
      program.uniforms.uScale.value = Math.min(1.2, Math.max(0.55, w / 1440));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 });
    io.observe(el);

    const mouse = { x: 0, y: 0 };
    const t0 = performance.now();

    const tick = () => {
      if (!visible || document.hidden) return;
      const t = (performance.now() - t0) / 1000;
      // Without a pointer (touch / idle) the lens wanders on its own.
      const tx = pointer.moved ? pointer.nx : Math.sin(t * 0.45) * 0.55;
      const ty = pointer.moved ? -pointer.ny : Math.sin(t * 0.7 + 1.3) * 0.35;
      mouse.x += (tx - mouse.x) * 0.06;
      mouse.y += (ty - mouse.y) * 0.06;
      program.uniforms.uMouse.value = [mouse.x, mouse.y];
      program.uniforms.uTime.value = reduce ? 0 : t;
      renderer.render({ scene: mesh });
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      io.disconnect();
      ro.disconnect();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      gl.canvas.remove();
    };
  }, []);

  return <div ref={host} aria-hidden="true" className={className} />;
}
