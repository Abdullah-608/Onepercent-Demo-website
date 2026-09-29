"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { syne } from "@/lib/fonts";
import { createRenderer, dotFragment, foregroundColor, onThemeChange, pointScale, prefersReducedMotion } from "@/components/graphics/particles";

// The studio's name as a particle sculpture: "1%" gathers as the section scrolls in and
// scatters away from the cursor.

const FOV = 45;
const MARK_W = 20; // world width of the mark

const markVertex = /* glsl */ `
  uniform float uTime;
  uniform float uScale;
  uniform float uMotion;
  uniform float uAssemble;
  uniform vec2 uMouse;
  attribute vec3 aRandom;
  varying float vAlpha;

  void main() {
    vec3 pos = position;
    pos.z += (aRandom.z - 0.5) * 1.2;

    vec2 dir = pos.xy - uMouse;
    float force = smoothstep(3.0, 0.0, length(dir));
    pos.xy += normalize(dir + 0.0001) * force * 1.6;
    pos.z += force * 2.5;

    pos += sin(uTime * 0.8 + aRandom * 6.2831) * 0.04 * uMotion;

    float t = clamp(uAssemble * 1.5 - aRandom.x * 0.5, 0.0, 1.0);
    t = t * t * (3.0 - 2.0 * t);
    pos = mix((aRandom - 0.5) * vec3(60.0, 36.0, 40.0), pos, t);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (0.06 + aRandom.y * 0.07) * uScale / -mv.z;
    vAlpha = (0.35 + aRandom.y * 0.65) * (0.25 + t * 0.75);
  }
`;

// Draws the mark to a canvas and returns a particle position for each inked pixel sample
function sampleMark(family: string) {
  const w = 1200;
  const h = 560;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.fillStyle = "#fff";
  ctx.font = `800 520px ${family}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("1%", w / 2, h / 2 + 20, w - 40);
  const data = ctx.getImageData(0, 0, w, h).data;
  const unit = MARK_W / w;
  const pts: number[] = [];
  const stepPx = 4;
  for (let y = 0; y < h; y += stepPx) {
    for (let x = 0; x < w; x += stepPx) {
      if (data[(y * w + x) * 4 + 3] < 128) continue;
      pts.push((x - w / 2 + (Math.random() - 0.5) * stepPx) * unit, (h / 2 - y + (Math.random() - 0.5) * stepPx) * unit, 0);
    }
  }
  return new Float32Array(pts);
}

export default function AboutMark() {
  const section = useRef<HTMLElement>(null);
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = mount.current;
    const root = section.current;
    if (!host || !root) return;
    const renderer = createRenderer(host);
    if (!renderer) return;

    let cancelled = false;
    const cleanups: (() => void)[] = [];

    const start = () => {
      if (cancelled) return;
      const motion = prefersReducedMotion() ? 0 : 1;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 200);
      const color = new THREE.Color(foregroundColor());

      const positions = sampleMark(syne.style.fontFamily);
      const count = positions.length / 3;
      const randoms = new Float32Array(count * 3);
      for (let i = 0; i < randoms.length; i++) randoms[i] = Math.random();
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 3));
      const material = new THREE.ShaderMaterial({
        vertexShader: markVertex,
        fragmentShader: dotFragment,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uScale: { value: 1 },
          uMotion: { value: motion },
          uAssemble: { value: motion ? 0 : 1 },
          uMouse: { value: new THREE.Vector2(999, 999) },
          uColor: { value: color },
          uOpacity: { value: 1 },
        },
      });
      const mark = new THREE.Points(geometry, material);
      mark.frustumCulled = false;
      mark.position.y = 1; // leave room for the caption
      scene.add(mark);

      const resize = () => {
        const w = host.clientWidth;
        const h = host.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        const tan = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
        // Fit the mark's width with some margin, and never let it outgrow the height
        const dist = Math.max((MARK_W * 0.62) / (tan * camera.aspect), 10 / tan);
        camera.position.set(0, 0, dist);
        camera.updateProjectionMatrix();
        material.uniforms.uScale.value = pointScale(renderer, h, FOV);
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(host);

      const offTheme = onThemeChange(() => color.set(foregroundColor()));

      const ndc = new THREE.Vector2();
      const smoothPointer = new THREE.Vector2();
      const origin = new THREE.Vector2();
      let inside = false;
      const onMove = (e: PointerEvent) => {
        const r = host.getBoundingClientRect();
        ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
        inside = true;
      };
      const onLeave = () => (inside = false);
      host.addEventListener("pointermove", onMove);
      host.addEventListener("pointerleave", onLeave);

      let visible = true;
      const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), { rootMargin: "100px" });
      io.observe(root);

      const raycaster = new THREE.Raycaster();
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
      const hit = new THREE.Vector3();
      const timer = new THREE.Timer();
      let assemble = 0;
      let raf = 0;

      const loop = () => {
        raf = requestAnimationFrame(loop);
        timer.update();
        const dt = Math.min(timer.getDelta(), 0.05);
        if (!visible) return;

        // Gathers as the section rises from the bottom of the viewport to its middle
        const rect = root.getBoundingClientRect();
        const vh = window.innerHeight;
        const goal = motion ? THREE.MathUtils.clamp((vh - rect.top) / (vh * 0.7), 0, 1) : 1;
        assemble += (goal - assemble) * (1 - Math.exp(-dt * 3));
        material.uniforms.uAssemble.value = assemble;
        material.uniforms.uTime.value = timer.getElapsed();

        smoothPointer.lerp(inside ? ndc : origin, 1 - Math.exp(-dt * 4));
        mark.rotation.y = smoothPointer.x * 0.25;
        mark.rotation.x = -smoothPointer.y * 0.12;
        mark.updateMatrixWorld();

        if (inside) {
          raycaster.setFromCamera(ndc, camera);
          if (raycaster.ray.intersectPlane(plane, hit)) {
            mark.worldToLocal(hit);
            material.uniforms.uMouse.value.set(hit.x, hit.y);
          }
        } else {
          material.uniforms.uMouse.value.set(999, 999);
        }
        renderer.render(scene, camera);
      };
      loop();

      cleanups.push(() => {
        cancelAnimationFrame(raf);
        timer.dispose();
        ro.disconnect();
        io.disconnect();
        offTheme();
        host.removeEventListener("pointermove", onMove);
        host.removeEventListener("pointerleave", onLeave);
        geometry.dispose();
        material.dispose();
      });
    };

    // Wait for Syne so the mark isn't sampled from a fallback font
    document.fonts.load(`800 100px ${syne.style.fontFamily}`).then(start, start);

    return () => {
      cancelled = true;
      cleanups.forEach((c) => c());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <section ref={section} aria-labelledby="about-title" className="relative w-full h-[100svh] min-h-[600px] overflow-hidden">
      <div ref={mount} aria-hidden className="absolute inset-0" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-6 pb-8 md:pb-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-t border-foreground/10 pt-6">
          <h1 id="about-title" className={`max-w-2xl font-bold leading-[1.05] tracking-[-0.02em] text-[clamp(1.5rem,3vw,2.5rem)] ${syne.className}`}>
            Ninety-nine percent gets it working. <span className="opacity-50">The last one percent makes it worth using.</span>
          </h1>
          <p className="max-w-sm text-sm md:text-base leading-relaxed text-foreground/60">
            One Percent is a product studio for AI, automation and the web. We work with a handful of clients at a time.
          </p>
        </div>
      </div>
    </section>
  );
}
