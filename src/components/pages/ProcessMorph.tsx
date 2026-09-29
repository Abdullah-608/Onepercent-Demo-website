"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { syne } from "@/lib/fonts";
import { processSteps } from "@/lib/content";
import { createRenderer, dotFragment, foregroundColor, onThemeChange, pointScale, prefersReducedMotion } from "@/components/graphics/particles";
import { processShapes } from "@/components/graphics/processShapes";

// One particle cloud that reshapes itself for each process step: ripples for the discovery
// call, a lattice for scoping, screens for design, a loop for weekly builds, a rocket for
// launch and a tree for growth. Scrolling morphs from one to the next.

const FOV = 50;
const COUNT = 22000;
const n = processSteps.length;

const morphVertex = /* glsl */ `
  uniform float uMix;
  uniform float uTime;
  uniform float uScale;
  uniform float uMotion;
  uniform float uIntro;
  attribute vec3 aFrom;
  attribute vec3 aTo;
  attribute vec3 aRandom;
  varying float vAlpha;

  void main() {
    // Staggered per particle, so shapes dissolve and rebuild rather than slide
    float t = clamp(uMix * 1.5 - aRandom.x * 0.5, 0.0, 1.0);
    t = t * t * (3.0 - 2.0 * t);
    vec3 pos = mix(aFrom, aTo, t);
    pos += (aRandom - 0.5) * 12.0 * sin(t * 3.14159);
    pos += sin(uTime * 0.9 + aRandom * 6.2831) * 0.05 * uMotion;
    // On entry the shape condenses out of a wide cloud
    pos = mix(pos, (aRandom - 0.5) * vec3(60.0, 40.0, 40.0), uIntro);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (0.05 + aRandom.y * 0.06) * uScale / -mv.z;
    // Nearer particles read brighter, which gives the shapes depth
    vAlpha = (0.25 + aRandom.z * 0.45) * clamp(1.4 - (-mv.z - 12.0) / 20.0, 0.35, 1.0) * (1.0 - uIntro * 0.7);
  }
`;

export default function ProcessMorph() {
  const section = useRef<HTMLElement>(null);
  const mount = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const host = mount.current;
    const root = section.current;
    if (!host || !root) return;
    const renderer = createRenderer(host);
    if (!renderer) return; // No WebGL: the step copy still renders over an empty stage

    const motion = prefersReducedMotion() ? 0 : 1;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 200);
    const color = new THREE.Color(foregroundColor());

    const shapes = processShapes(n, COUNT);
    const randoms = new Float32Array(COUNT * 3);
    for (let i = 0; i < randoms.length; i++) randoms[i] = Math.random();
    const from = new THREE.BufferAttribute(shapes[0].slice(), 3);
    const to = new THREE.BufferAttribute(shapes[Math.min(1, n - 1)].slice(), 3);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(COUNT * 3), 3));
    geometry.setAttribute("aFrom", from);
    geometry.setAttribute("aTo", to);
    geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 3));
    const material = new THREE.ShaderMaterial({
      vertexShader: morphVertex,
      fragmentShader: dotFragment,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uMix: { value: 0 },
        uTime: { value: 0 },
        uScale: { value: 1 },
        uMotion: { value: motion },
        uIntro: { value: 1 },
        uColor: { value: color },
        uOpacity: { value: 1 },
      },
    });
    const points = new THREE.Points(geometry, material);
    points.frustumCulled = false;
    scene.add(points);

    // Wide screens: shape on the right of the copy. Narrow: shape above it.
    const resize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      const tan = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
      const wide = camera.aspect > 1.1;
      const dist = wide ? 22 : Math.max(24, 10 / (tan * camera.aspect));
      camera.position.set(0, 0, dist);
      points.position.set(wide ? dist * tan * camera.aspect * 0.36 : 0, wide ? 0 : dist * tan * 0.35, 0);
      points.scale.setScalar(wide ? 1 : 0.85);
      camera.updateProjectionMatrix();
      material.uniforms.uScale.value = pointScale(renderer, h, FOV);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const offTheme = onThemeChange(() => color.set(foregroundColor()));

    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), { rootMargin: "100px" });
    io.observe(root);

    // Holds on each step, then morphs quickly to the next
    const dwell = (s: number) => {
      const i = Math.floor(s);
      const e = THREE.MathUtils.smoothstep(s - i, 0.25, 0.75);
      return Math.min(i + e, n - 1);
    };

    const timer = new THREE.Timer();
    let smooth = 0;
    let intro = 1;
    let pair = 0; // index of the shape currently loaded into aFrom
    let lastActive = -1;
    let raf = 0;

    const loop = () => {
      raf = requestAnimationFrame(loop);
      timer.update();
      const dt = Math.min(timer.getDelta(), 0.05);
      if (!visible) return;
      const time = timer.getElapsed();

      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight;
      const raw = THREE.MathUtils.clamp(-rect.top / Math.max(rect.height - vh, 1), 0, 1);
      const entering = THREE.MathUtils.clamp(rect.top / vh, 0, 1);

      smooth += (dwell(raw * (n - 1) * 0.999) - smooth) * (1 - Math.exp(-dt * 5));
      intro += (entering - intro) * (1 - Math.exp(-dt * 4));

      // Load the two shapes on either side of the scroll position
      const i = Math.min(Math.floor(smooth), n - 2);
      if (n > 1 && i !== pair) {
        pair = i;
        (from.array as Float32Array).set(shapes[i]);
        (to.array as Float32Array).set(shapes[i + 1]);
        from.needsUpdate = true;
        to.needsUpdate = true;
      }
      material.uniforms.uMix.value = n > 1 ? smooth - pair : 0;
      material.uniforms.uTime.value = time;
      material.uniforms.uIntro.value = motion ? intro : 0;

      const idx = Math.round(smooth);
      if (idx !== lastActive) {
        lastActive = idx;
        setActive(idx);
      }

      // Slow turn so the shapes read as 3D, plus a twist while morphing
      points.rotation.y = time * 0.18 * motion + smooth * 0.9;
      points.rotation.x = Math.sin(time * 0.3) * 0.08 * motion;
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      timer.dispose();
      ro.disconnect();
      io.disconnect();
      offTheme();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);


  const s = processSteps[active];

  return (
    <section ref={section} aria-label="Our process" className="relative w-full border-t border-foreground/10" style={{ height: `${n * 100 + 50}vh` }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div ref={mount} aria-hidden className="absolute inset-0" />

        <div className="pointer-events-none relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-end md:justify-center pb-16 md:pb-0">
          <h2 className={`mb-10 md:mb-14 font-bold leading-[0.95] tracking-[-0.03em] text-[clamp(2rem,4vw,3.5rem)] ${syne.className}`}>
            From call <em className="opacity-60">to launch</em>
          </h2>
          <div key={active} className="max-w-md animate-[projectIn_0.7s_cubic-bezier(0.22,1,0.36,1)_both]">
            <p className="text-sm text-foreground/50 tabular-nums mb-4">
              {s.duration}
            </p>
            <h3 className={`font-extrabold uppercase leading-[0.9] tracking-[-0.03em] text-[clamp(2rem,5vw,4.5rem)] ${syne.className}`}>{s.title}</h3>
            <p className="mt-5 text-foreground/70 leading-relaxed text-sm md:text-base">{s.text}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {s.outputs.map((o) => (
                <span key={o} className="px-3 py-1 rounded-full border border-foreground/20 bg-background/40 backdrop-blur-sm text-xs text-foreground/70">
                  {o}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
