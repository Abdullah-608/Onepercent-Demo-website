import * as THREE from "three";

// Shared pieces for the Three.js particle scenes (about mark, process morph).

// Soft round dot, tinted with the site's foreground colour
export const dotFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.15, d);
    gl_FragColor = vec4(uColor, a * vAlpha * uOpacity);
  }
`;

export function foregroundColor() {
  return getComputedStyle(document.documentElement).getPropertyValue("--foreground").trim() || "#ffffff";
}

// next-themes toggles the .dark class on <html>. Returns an unsubscribe function.
export function onThemeChange(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style"] });
  return () => mo.disconnect();
}

export function createRenderer(host: HTMLElement) {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.style.display = "block";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  host.appendChild(renderer.domElement);
  return renderer;
}

// Multiplier that turns a world-unit point size into pixels, divided by view depth in the shader
export function pointScale(renderer: THREE.WebGLRenderer, height: number, fov: number) {
  return (height * renderer.getPixelRatio()) / (2 * Math.tan(THREE.MathUtils.degToRad(fov / 2)));
}

export const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
