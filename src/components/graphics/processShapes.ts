import * as THREE from "three";

// Particle target shapes for each process step, all centred on the origin and roughly
// 16 units tall. Each returns `count` xyz positions sampled from a set of weighted parts.

type V3 = [number, number, number];
type Sampler = () => V3;
type Part = { w: number; s: Sampler };

const R = Math.random;
const J = (a: number) => (R() - 0.5) * a;

function build(parts: Part[], count: number, transform?: (v: THREE.Vector3) => void) {
  const out = new Float32Array(count * 3);
  const total = parts.reduce((a, p) => a + p.w, 0);
  const cum: number[] = [];
  let acc = 0;
  for (const p of parts) cum.push((acc += p.w / total));
  const v = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    const r = R();
    let k = cum.findIndex((c) => r <= c);
    if (k < 0) k = parts.length - 1;
    v.set(...parts[k].s());
    transform?.(v);
    v.toArray(out, i * 3);
  }
  return out;
}

const segment = (a: V3, b: V3, jitter = 0.08): Sampler => () => {
  const t = R();
  return [a[0] + (b[0] - a[0]) * t + J(jitter), a[1] + (b[1] - a[1]) * t + J(jitter), a[2] + (b[2] - a[2]) * t + J(jitter)];
};

const sphereSurface = (c: V3, r: number): Sampler => () => {
  const u = R() * 2 - 1;
  const t = R() * Math.PI * 2;
  const s = Math.sqrt(1 - u * u);
  return [c[0] + s * Math.cos(t) * r, c[1] + u * r, c[2] + s * Math.sin(t) * r];
};

const sphereVolume = (c: V3, r: number): Sampler => () => {
  const [x, y, z] = sphereSurface([0, 0, 0], r * Math.cbrt(R()))();
  return [c[0] + x, c[1] + y, c[2] + z];
};

const rectFill = (cx: number, cy: number, z: number, w: number, h: number): Sampler => () => [cx + J(w), cy + J(h), z + J(0.08)];

function rectOutline(cx: number, cy: number, z: number, w: number, h: number): Part {
  const perim = 2 * (w + h);
  return {
    w: perim * 0.45,
    s: () => {
      let d = R() * perim;
      const j = J(0.06);
      if (d < w) return [cx - w / 2 + d, cy + h / 2 + j, z];
      d -= w;
      if (d < h) return [cx + w / 2 + j, cy + h / 2 - d, z];
      d -= h;
      if (d < w) return [cx + w / 2 - d, cy - h / 2 + j, z];
      d -= w;
      return [cx - w / 2 + j, cy - h / 2 + d, z];
    },
  };
}

// Discovery call: voice ripples spreading out from a core — listening
function ripples(count: number) {
  const parts: Part[] = [{ w: 12, s: sphereVolume([0, 0, 0], 1.2) }];
  for (let k = 1; k <= 5; k++) {
    const r = 1.4 + k * 1.3;
    parts.push({
      w: r * (1.2 - k * 0.12),
      s: () => {
        const t = R() * Math.PI * 2;
        return [Math.cos(t) * r + J(0.12), Math.sin(t) * r + J(0.12), J(0.3)];
      },
    });
  }
  return build(parts, count);
}

// Scope & estimate: a blueprint lattice mapping the system
function lattice(count: number) {
  const h = 4.4;
  const c = [-h, -h / 3, h / 3, h];
  const parts: Part[] = [];
  for (const a of c) {
    for (const b of c) {
      parts.push({ w: 1, s: segment([-h, a, b], [h, a, b], 0.05) });
      parts.push({ w: 1, s: segment([a, -h, b], [a, h, b], 0.05) });
      parts.push({ w: 1, s: segment([a, b, -h], [a, b, h], 0.05) });
      // A node where every line meets
      for (const d of c) parts.push({ w: 0.12, s: sphereVolume([a, b, d], 0.18) });
    }
  }
  const e = new THREE.Euler(0.5, 0.6, 0);
  return build(parts, count, (v) => v.applyEuler(e));
}

// Design: stacked interface screens with layout blocks
function screens(count: number) {
  const W = 9;
  const H = 5.8;
  const parts: Part[] = [];
  const panels: V3[] = [
    [-1.8, 1.6, -2.6],
    [0, 0, 0],
    [1.8, -1.6, 2.6],
  ];
  for (const [cx, cy, z] of panels) {
    parts.push(rectOutline(cx, cy, z, W, H));
    parts.push({ w: 2.2, s: rectFill(cx, cy + H / 2 - 0.55, z, W - 0.6, 0.35) }); // header
    parts.push({ w: 2.4, s: rectFill(cx - W / 2 + 1.1, cy - 0.35, z, 1.3, H - 1.9) }); // sidebar
    for (let i = 0; i < 3; i++) parts.push({ w: 2.2, s: rectFill(cx - 1.35 + i * 2.1, cy + 0.55, z, 1.8, 1.6) }); // cards
    for (let i = 0; i < 3; i++) parts.push({ w: 0.9, s: rectFill(cx + 0.75 - i * 0.5, cy - 1.1 - i * 0.45, z, 5.8 - i, 0.14) }); // text lines
  }
  return build(parts, count);
}

// Build in weekly cycles: a loop split into weekly segments
function loop(count: number) {
  const R0 = 5.4;
  const r = 0.75;
  const weeks = 7;
  const gap = 0.14;
  const arc = (Math.PI * 2) / weeks;
  const parts: Part[] = [
    {
      w: 10,
      s: () => {
        const u = Math.floor(R() * weeks) * arc + gap / 2 + R() * (arc - gap);
        const v = R() * Math.PI * 2;
        const d = R0 + r * Math.cos(v);
        return [d * Math.cos(u), d * Math.sin(u), r * Math.sin(v)];
      },
    },
    // Travelling marker showing where this week sits in the cycle
    { w: 0.8, s: sphereVolume([R0, 0, 0], 1.3) },
  ];
  const e = new THREE.Euler(1.05, 0, 0.3);
  return build(parts, count, (v) => v.applyEuler(e));
}

// Launch: a rocket with an exhaust trail
function rocket(count: number) {
  const br = 1.4;
  const parts: Part[] = [
    {
      w: 50,
      s: () => {
        const t = R() * Math.PI * 2;
        return [Math.cos(t) * br, -3 + R() * 5.5, Math.sin(t) * br];
      },
    },
    {
      w: 14,
      s: () => {
        const t = R();
        const rr = br * Math.sqrt(1 - t);
        const a = R() * Math.PI * 2;
        return [Math.cos(a) * rr, 2.5 + t * 3.4, Math.sin(a) * rr];
      },
    },
    // Porthole
    {
      w: 3,
      s: () => {
        const a = R() * Math.PI * 2;
        return [Math.cos(a) * 0.5, 1 + Math.sin(a) * 0.5, br + 0.05];
      },
    },
    // Exhaust, widening as it falls away
    {
      w: 34,
      s: () => {
        const t = Math.pow(R(), 0.7);
        const rr = (0.4 + t * 2.4) * Math.sqrt(R());
        const a = R() * Math.PI * 2;
        return [Math.cos(a) * rr, -3.6 - t * 7.5, Math.sin(a) * rr];
      },
    },
  ];
  for (let f = 0; f < 3; f++) {
    const phi = (f / 3) * Math.PI * 2 + Math.PI / 6;
    parts.push({
      w: 7,
      s: () => {
        // Uniform point in the triangle (root top, root bottom, tip)
        let a = R();
        let b = R();
        if (a + b > 1) {
          a = 1 - a;
          b = 1 - b;
        }
        const r = br + b * 1.9;
        const y = -0.8 + a * -2.4 + b * -3.0;
        return [Math.cos(phi) * r, y, Math.sin(phi) * r];
      },
    });
  }
  const e = new THREE.Euler(0, 0, -0.45);
  return build(parts, count, (v) => {
    v.y += 2.4;
    v.multiplyScalar(0.92).applyEuler(e);
  });
}

// Support & grow: a branching tree
function tree(count: number) {
  const segs: { a: THREE.Vector3; b: THREE.Vector3; r: number }[] = [];
  const leaves: THREE.Vector3[] = [];
  const up = new THREE.Vector3(0, 1, 0);
  const grow = (p: THREE.Vector3, dir: THREE.Vector3, len: number, depth: number, r: number) => {
    const end = p.clone().addScaledVector(dir, len);
    segs.push({ a: p, b: end, r });
    if (depth === 0) {
      leaves.push(end);
      return;
    }
    const side = new THREE.Vector3().crossVectors(dir, Math.abs(dir.y) < 0.9 ? up : new THREE.Vector3(1, 0, 0)).normalize();
    const offset = R() * Math.PI * 2;
    for (let k = 0; k < 3; k++) {
      const perp = side.clone().applyAxisAngle(dir, offset + (k / 3) * Math.PI * 2);
      const spread = 0.5 + R() * 0.25;
      const next = dir.clone().multiplyScalar(Math.cos(spread)).addScaledVector(perp, Math.sin(spread)).normalize();
      grow(end, next, len * (0.66 + R() * 0.08), depth - 1, r * 0.62);
    }
  };
  grow(new THREE.Vector3(0, -7.5, 0), up.clone(), 4, 5, 0.45);

  const parts: Part[] = segs.map(({ a, b, r }) => ({
    w: a.distanceTo(b) * (r + 0.05) * 7,
    s: () => {
      const t = R();
      return [a.x + (b.x - a.x) * t + J(r * 2), a.y + (b.y - a.y) * t + J(r * 2), a.z + (b.z - a.z) * t + J(r * 2)];
    },
  }));
  for (const l of leaves) parts.push({ w: 0.75, s: sphereVolume([l.x, l.y, l.z], 0.55) });
  return build(parts, count, (v) => (v.y += 1.2));
}

const generators = [ripples, lattice, screens, loop, rocket, tree];

// One shape per step, cycling if there are more steps than shapes
export function processShapes(steps: number, count: number) {
  return Array.from({ length: steps }, (_, i) => generators[i % generators.length](count));
}
