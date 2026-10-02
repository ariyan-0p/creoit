"use client";

/**
 * GlobeCanvas — an interactive WebGL globe (OGL, one sphere, one draw call).
 *
 * - The map is drawn once into a 2D canvas (real Natural Earth data via
 *   world-atlas) and used as the sphere's texture.
 * - Drag to spin (with inertia); click to drop a pin → lat/long readout.
 * - Pins are HTML elements projected from 3D each frame (crisp, labelled).
 * - Idle auto-rotation, DPR capped at 1.5, renders only while on screen.
 */

import { useEffect, useRef } from "react";
import { Renderer, Camera, Transform, Sphere, Program, Mesh, Texture, Vec3, Mat4 } from "ogl";
import { feature, mesh as topoMesh } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { MultiPolygon, Polygon, FeatureCollection, MultiLineString } from "geojson";
import { gsap } from "@/lib/gsap";
import { useLenis } from "@/providers/SmoothScrollProvider";

export const HQ = { lat: 23.2599, lon: 77.4126 };
export type Pin = { lat: number; lon: number };

const FOV = 28;
const CAM_Z = 5.4;

const vertex = /* glsl */ `
  attribute vec3 position;
  attribute vec3 normal;
  attribute vec2 uv;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform mat3 normalMatrix;
  varying vec2 vUv;
  varying vec3 vN;
  void main() {
    vUv = uv;
    vN = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const fragment = /* glsl */ `
  precision highp float;
  uniform sampler2D tMap;
  varying vec2 vUv;
  varying vec3 vN;
  void main() {
    vec3 c = texture2D(tMap, vUv).rgb;
    float d = clamp(vN.z, 0.0, 1.0);
    c *= mix(0.55, 1.0, pow(d, 0.7));
    float rim = pow(1.0 - d, 2.6);
    c += vec3(0.42, 0.24, 1.0) * rim * 0.75;
    gl_FragColor = vec4(c, 1.0);
  }
`;

const rad = (d: number) => (d * Math.PI) / 180;

/** lat/lon → unit vector in the sphere's object space (matches OGL Sphere uv layout). */
function toVec(lat: number, lon: number, out = new Vec3()) {
  const phi = rad(lon + 180);
  const th = rad(90 - lat);
  return out.set(-Math.cos(phi) * Math.sin(th), Math.cos(th), Math.sin(phi) * Math.sin(th));
}

async function buildMapTexture(): Promise<HTMLCanvasElement> {
  const W = 4096;
  const H = 2048;
  const topo = (await import("world-atlas/countries-110m.json")).default as unknown as Topology;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;
  const X = (lon: number) => ((lon + 180) / 360) * W;
  const Y = (lat: number) => ((90 - lat) / 180) * H;

  // ocean
  ctx.fillStyle = "#12072b";
  ctx.fillRect(0, 0, W, H);

  // graticule
  ctx.strokeStyle = "rgba(164,139,255,0.22)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let lon = -180; lon <= 180; lon += 15) {
    ctx.moveTo(X(lon), 0);
    ctx.lineTo(X(lon), H);
  }
  for (let lat = -90; lat <= 90; lat += 15) {
    ctx.moveTo(0, Y(lat));
    ctx.lineTo(W, Y(lat));
  }
  ctx.stroke();

  // Shapes that cross the antimeridian (Fiji, Chukotka, Antarctica) jump from 180° to
  // -180°. Unwrap the longitudes so each ring is continuous, then draw it shifted by
  // -360/0/+360 so the part that leaves one edge re-enters the other.
  const unwrap = (coords: number[][]) => {
    let prev = coords[0][0];
    let shift = 0;
    return coords.map(([lon, lat]) => {
      const d = lon - prev;
      if (d > 180) shift -= 360;
      else if (d < -180) shift += 360;
      prev = lon;
      return [lon + shift, lat] as [number, number];
    });
  };
  const OFFSETS = [-360, 0, 360];
  const ring = (coords: number[][]) => {
    const pts = unwrap(coords);
    OFFSETS.forEach((o) => {
      pts.forEach(([lon, lat], i) => (i ? ctx.lineTo(X(lon + o), Y(lat)) : ctx.moveTo(X(lon + o), Y(lat))));
      ctx.closePath();
    });
  };

  // land
  const land = feature(topo, topo.objects.land as GeometryCollection) as unknown as FeatureCollection<Polygon | MultiPolygon>;
  const geoms = "features" in land ? land.features.map((f) => f.geometry) : [(land as unknown as { geometry: Polygon | MultiPolygon }).geometry];
  ctx.beginPath();
  geoms.forEach((g) => {
    const polys = g.type === "Polygon" ? [g.coordinates] : g.coordinates;
    polys.forEach((poly) => poly.forEach((r) => ring(r)));
  });
  ctx.fillStyle = "#2b1470";
  ctx.fill("evenodd");
  ctx.strokeStyle = "#b9a6ff";
  ctx.lineWidth = 3;
  ctx.stroke();

  // country borders
  const borders = topoMesh(topo, topo.objects.countries as GeometryCollection, (a, b) => a !== b) as unknown as MultiLineString;
  ctx.beginPath();
  borders.coordinates.forEach((line) => {
    const pts = unwrap(line);
    OFFSETS.forEach((o) => pts.forEach(([lon, lat], i) => (i ? ctx.lineTo(X(lon + o), Y(lat)) : ctx.moveTo(X(lon + o), Y(lat)))));
  });
  ctx.strokeStyle = "rgba(185,166,255,0.55)";
  ctx.lineWidth = 1.6;
  ctx.stroke();

  return c;
}

export function GlobeCanvas({
  onPin,
  hqRef,
  pinRef,
  resetSignal,
}: {
  onPin: (p: Pin | null) => void;
  hqRef: React.RefObject<HTMLDivElement | null>;
  pinRef: React.RefObject<HTMLDivElement | null>;
  resetSignal: number;
}) {
  const host = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const api = useRef<{ focus: (lat: number, lon: number) => void; setPin: (p: Pin | null) => void } | null>(null);
  const lenisRef = useRef(lenis);
  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);

  useEffect(() => {
    if (resetSignal > 0) api.current?.focus(HQ.lat, HQ.lon);
  }, [resetSignal]);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let disposed = false;
    const cleanups: Array<() => void> = [];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new Renderer({ alpha: true, dpr: Math.min(window.devicePixelRatio || 1, 1.5), antialias: true });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    el.appendChild(gl.canvas);
    gl.canvas.style.cssText = "width:100%;height:100%;display:block;touch-action:pan-y;cursor:grab";

    const camera = new Camera(gl, { fov: FOV, near: 0.1, far: 20 });
    camera.position.set(0, 0, CAM_Z);
    const scene = new Transform();

    const resize = () => {
      renderer.setSize(el.clientWidth, el.clientHeight);
      camera.perspective({ aspect: el.clientWidth / el.clientHeight });
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    // view state: rotation about Y (lon) and X (lat tilt)
    const view = { ry: 0, rx: 0, vy: 0, vx: 0 };
    // Euler order is YXZ (tilt about X first, then spin about Y). Tilt partway to the
    // latitude, then solve the spin that brings the point's x to zero.
    const focusAngles = (lat: number, lon: number) => {
      const v = toVec(lat, lon);
      const rx = rad(lat) * 0.6;
      const zp = v.y * Math.sin(rx) + v.z * Math.cos(rx);
      return { ry: Math.atan2(-v.x, zp), rx };
    };
    const start = focusAngles(HQ.lat, HQ.lon);
    view.ry = start.ry + 0.5;
    view.rx = start.rx;

    let pin: Pin | null = null;
    const hq = toVec(HQ.lat, HQ.lon);

    const state = { hover: false, dragging: false, idle: 0 };

    (async () => {
      const canvas = await buildMapTexture();
      if (disposed) return;
      const texture = new Texture(gl, { image: canvas, generateMipmaps: true, minFilter: gl.LINEAR_MIPMAP_LINEAR, anisotropy: 8 });
      const program = new Program(gl, { vertex, fragment, uniforms: { tMap: { value: texture } } });
      const mesh = new Mesh(gl, { geometry: new Sphere(gl, { radius: 1, widthSegments: 96, heightSegments: 64 }), program });
      mesh.setParent(scene);

      const tmp = new Vec3();
      const proj = new Vec3();
      const inv = new Mat4();

      const place = (node: HTMLDivElement | null, v: Vec3) => {
        if (!node) return;
        tmp.copy(v).applyMatrix4(mesh.worldMatrix);
        const facing = tmp.z > 0.12; // front hemisphere only
        proj.copy(tmp);
        camera.project(proj);
        const x = (proj.x * 0.5 + 0.5) * el.clientWidth;
        const y = (1 - (proj.y * 0.5 + 0.5)) * el.clientHeight;
        node.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
        node.dataset.flip = x > el.clientWidth * 0.6 ? "1" : "0"; // keep labels inside the stage
        node.style.opacity = facing ? "1" : "0";
        node.style.visibility = facing ? "visible" : "hidden";
      };

      let visible = true;
      const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 });
      io.observe(el);
      cleanups.push(() => io.disconnect());

      const tick = () => {
        if (!visible || document.hidden) return;
        const lv = lenisRef.current ? lenisRef.current.velocity : 0;
        if (!state.dragging) {
          view.ry += view.vy;
          view.rx += view.vx;
          view.vy *= 0.94;
          view.vx *= 0.94;
          if (!reduce && !state.hover) view.ry += 0.0016 + Math.min(Math.abs(lv), 30) * 0.0006;
        }
        view.rx = Math.max(-1.1, Math.min(1.1, view.rx));
        mesh.rotation.y = view.ry;
        mesh.rotation.x = -view.rx; // engine X-rotation is opposite to screen intuition
        mesh.updateMatrixWorld();
        renderer.render({ scene, camera });
        place(hqRef.current, hq);
        if (pin) place(pinRef.current, toVec(pin.lat, pin.lon, new Vec3()));
      };
      gsap.ticker.add(tick);
      cleanups.push(() => gsap.ticker.remove(tick));

      /** screen px → lat/lon on the sphere (analytic ray/sphere), or null if it misses */
      const pick = (clientX: number, clientY: number): Pin | null => {
        const r = el.getBoundingClientRect();
        const nx = ((clientX - r.left) / r.width) * 2 - 1;
        const ny = -(((clientY - r.top) / r.height) * 2 - 1);
        const t = Math.tan(rad(FOV) / 2);
        const dir = new Vec3(nx * t * (r.width / r.height), ny * t, -1).normalize();
        const o = new Vec3(0, 0, CAM_Z);
        const b = o.dot(dir);
        const c = o.dot(o) - 1;
        const disc = b * b - c;
        if (disc < 0) return null;
        const s = -b - Math.sqrt(disc);
        const hit = new Vec3(o.x + dir.x * s, o.y + dir.y * s, o.z + dir.z * s);
        inv.copy(mesh.worldMatrix).inverse();
        hit.applyMatrix4(inv).normalize();
        const lat = (Math.asin(hit.y) * 180) / Math.PI;
        let lon = (Math.atan2(hit.z, -hit.x) * 180) / Math.PI - 180;
        if (lon < -180) lon += 360;
        return { lat, lon };
      };

      // --- interaction ---
      let sx = 0,
        sy = 0,
        lx = 0,
        ly = 0,
        moved = 0;
      const down = (e: PointerEvent) => {
        state.dragging = true;
        moved = 0;
        sx = lx = e.clientX;
        sy = ly = e.clientY;
        view.vy = view.vx = 0;
        gl.canvas.setPointerCapture(e.pointerId);
        gl.canvas.style.cursor = "grabbing";
      };
      const move = (e: PointerEvent) => {
        if (!state.dragging) return;
        const dx = e.clientX - lx;
        const dy = e.clientY - ly;
        lx = e.clientX;
        ly = e.clientY;
        moved += Math.abs(dx) + Math.abs(dy);
        view.ry += dx * 0.0055;
        view.rx += dy * 0.0055;
        view.vy = dx * 0.0055;
        view.vx = dy * 0.0055;
      };
      const up = (e: PointerEvent) => {
        if (!state.dragging) return;
        state.dragging = false;
        gl.canvas.style.cursor = "grab";
        if (moved < 6 && Math.hypot(e.clientX - sx, e.clientY - sy) < 6) {
          const p = pick(e.clientX, e.clientY);
          if (p) {
            pin = p;
            onPin(p);
          }
        }
      };
      const enter = () => (state.hover = true);
      const leave = () => (state.hover = false);
      gl.canvas.addEventListener("pointerdown", down);
      gl.canvas.addEventListener("pointermove", move);
      gl.canvas.addEventListener("pointerup", up);
      gl.canvas.addEventListener("pointercancel", up);
      gl.canvas.addEventListener("pointerenter", enter);
      gl.canvas.addEventListener("pointerleave", leave);

      api.current = {
        focus: (lat, lon) => {
          const a = focusAngles(lat, lon);
          // shortest way round
          let dy = (a.ry - view.ry) % (Math.PI * 2);
          if (dy > Math.PI) dy -= Math.PI * 2;
          if (dy < -Math.PI) dy += Math.PI * 2;
          view.vy = view.vx = 0;
          gsap.to(view, { ry: view.ry + dy, rx: a.rx, duration: 1.6, ease: "expo.inOut", overwrite: true });
        },
        setPin: (p) => {
          pin = p;
        },
      };
    })();

    return () => {
      disposed = true;
      cleanups.forEach((c) => c());
      ro.disconnect();
      gsap.killTweensOf(view);
      api.current = null;
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      gl.canvas.remove();
    };
    // callbacks/refs are stable by construction in the parent
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={host} className="absolute inset-0" />;
}
