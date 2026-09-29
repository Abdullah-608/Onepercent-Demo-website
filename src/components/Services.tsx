"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { syne } from "@/lib/fonts";


type Kind = "ml" | "flow" | "agent" | "web" | "cloud" | "devops";

const services: { num: string; title: [string, string]; text: string; tags: string[]; kind: Kind }[] = [
  { num: "01", title: ["AI Product", "Development"], kind: "ml", tags: ["LLMs", "RAG", "Python", "OpenAI", "Pinecone"], text: "End-to-end AI applications. We integrate LLMs and build retrieval-augmented systems that put your data to work." },
  { num: "02", title: ["AI Automation", "& Workflows"], kind: "flow", tags: ["n8n", "Make", "Zapier", "APIs"], text: "Custom workflows that connect your apps and take repetitive tasks off your team's plate." },
  { num: "03", title: ["Customized", "AI Agents"], kind: "agent", tags: ["LangChain", "Tool use", "Voice", "Support bots"], text: "Autonomous agents tailored to your business, from customer support to complex reasoning engines." },
  { num: "04", title: ["Full Stack", "Web Apps"], kind: "web", tags: ["Next.js", "React", "TypeScript", "Postgres"], text: "Fast, scalable web applications with polished front ends and robust backends." },
  { num: "05", title: ["Cloud", "Infrastructure"], kind: "cloud", tags: ["AWS", "GCP", "Azure", "Terraform"], text: "Secure, highly available cloud architectures that stay cost-effective as you grow." },
  { num: "06", title: ["DevOps", ""], kind: "devops", tags: ["CI/CD", "Docker", "Kubernetes", "GitHub Actions"], text: "Automated pipelines and deployments so you ship faster and with more confidence." },
];

/* ---------- canvas illustrations (monochrome, follow theme) ---------- */
type Ctx = { c: CanvasRenderingContext2D; w: number; h: number; t: number; fg: string; bg: string };

const TAU = Math.PI * 2;
const rr = (c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  c.beginPath();
  c.roundRect(x, y, w, h, r);
};
const dot = (c: CanvasRenderingContext2D, x: number, y: number, r: number, a = 1) => {
  c.globalAlpha = a;
  c.beginPath();
  c.arc(x, y, Math.max(0.1, r), 0, TAU);
  c.fill();
};
const glow = (c: CanvasRenderingContext2D, fg: string, b: number) => {
  c.shadowColor = fg;
  c.shadowBlur = b;
};
const noGlow = (c: CanvasRenderingContext2D) => {
  c.shadowBlur = 0;
};
const bez = (a: number[], k: number[], b: number[], p: number) => {
  const q = 1 - p;
  return [q * q * a[0] + 2 * q * p * k[0] + p * p * b[0], q * q * a[1] + 2 * q * p * k[1] + p * p * b[1]];
};
const ripple = (c: CanvasRenderingContext2D, x: number, y: number, r: number, p: number, fg: string) => {
  c.strokeStyle = fg;
  c.lineWidth = 1.5;
  c.globalAlpha = (1 - p) * 0.5;
  c.beginPath();
  c.arc(x, y, r * (0.3 + p * 1.7), 0, TAU);
  c.stroke();
};

const draw: Record<Kind, (o: Ctx) => void> = {
  /* rotating 3D neural network with signal pulses */
  ml({ c, w, h, t, fg, bg }) {
    const s = Math.min(w, h), cx = w / 2, cy = h / 2;
    const layers = [4, 6, 6, 3];
    const sp = s * 0.25, D = s * 2.2;
    const a = t * 0.35 + Math.sin(t * 0.4) * 0.3, ca = Math.cos(a), sa = Math.sin(a);
    const proj = (x: number, y: number, z: number) => {
      const xr = x * ca + z * sa, zr = -x * sa + z * ca, k = D / (D - zr);
      return { x: cx + xr * k, y: cy + y * k, z: zr, k };
    };
    const nodes = layers.map((n, li) =>
      Array.from({ length: n }, (_, i) => {
        const ang = (i / n) * TAU + li * 0.6 + t * 0.15;
        const R = s * (0.07 + n * 0.028);
        return proj((li - 1.5) * sp, Math.sin(ang) * R, Math.cos(ang) * R);
      })
    );
    c.strokeStyle = fg; c.fillStyle = fg; c.lineWidth = 1;
    nodes.forEach((L, li) => {
      if (!li) return;
      L.forEach((b, bi) =>
        nodes[li - 1].forEach((n0, ai) => {
          const depth = (n0.z + b.z) / (2 * s * 0.3);
          c.globalAlpha = 0.06 + 0.1 * (0.5 + depth * 0.5);
          c.beginPath(); c.moveTo(n0.x, n0.y); c.lineTo(b.x, b.y); c.stroke();
          const p = (t * 0.45 + ai * 0.21 + bi * 0.37 + li * 0.19) % 1;
          if (p < 0.3) {
            glow(c, fg, 10);
            for (let k = 0; k < 5; k++) {
              const q = Math.max(0, p / 0.3 - k * 0.07);
              dot(c, n0.x + (b.x - n0.x) * q, n0.y + (b.y - n0.y) * q, 2.4 - k * 0.4, 0.95 - k * 0.18);
            }
            noGlow(c);
          }
        })
      );
    });
    const all = nodes.flatMap((L, li) => L.map((n, i) => ({ ...n, li, i }))).sort((p, q) => p.z - q.z);
    all.forEach((n) => {
      const near = 0.55 + (n.z / (s * 0.3)) * 0.45;
      const r = (s * 0.032 + Math.sin(t * 2.2 + n.li * 1.3 + n.i) * 1.2) * n.k;
      const fire = Math.max(0, Math.sin(t * 1.5 - n.li * 1.1 + n.i * 0.4));
      glow(c, fg, 6 + fire * 22);
      c.globalAlpha = Math.min(1, near + 0.2);
      c.fillStyle = fire > 0.6 ? fg : bg; c.strokeStyle = fg; c.lineWidth = 2;
      c.beginPath(); c.arc(n.x, n.y, r, 0, TAU); c.fill(); c.stroke();
      noGlow(c);
    });
  },

  /* automation graph: curved wires, packets with trails, ripple on activation */
  flow({ c, w, h, t, fg, bg }) {
    const s = Math.min(w, h);
    const ph = t * 0.9, stage = Math.floor(ph % 4), fr = ph % 1;
    const b = [
      { x: w * 0.17, y: h * 0.5, n: "Trigger" },
      { x: w * 0.5, y: h * 0.24, n: "AI Agent" },
      { x: w * 0.5, y: h * 0.76, n: "Database" },
      { x: w * 0.83, y: h * 0.5, n: "Action" },
    ];
    const edges: [number, number, number][] = [[0, 1, -0.12], [0, 2, 0.12], [1, 3, 0.12], [2, 3, -0.12]];
    const path = (i: number, j: number, bend: number) => {
      const A = [b[i].x, b[i].y], B = [b[j].x, b[j].y];
      const K = [(A[0] + B[0]) / 2 - (B[1] - A[1]) * bend, (A[1] + B[1]) / 2 + (B[0] - A[0]) * bend];
      return { A, B, K };
    };
    // drifting grid
    c.fillStyle = fg;
    for (let gx = 0; gx < 14; gx++) for (let gy = 0; gy < 9; gy++) {
      const x = ((gx * w) / 13 + t * 6) % (w + 20) - 10, y = (gy * h) / 8;
      dot(c, x, y, 1, 0.07);
    }
    edges.forEach(([i, j, bend], e) => {
      const { A, K, B } = path(i, j, bend);
      c.strokeStyle = fg; c.lineWidth = 1.5; c.globalAlpha = 0.16; c.setLineDash([]);
      c.beginPath(); c.moveTo(A[0], A[1]); c.quadraticCurveTo(K[0], K[1], B[0], B[1]); c.stroke();
      c.globalAlpha = 0.5; c.setLineDash([4, 10]); c.lineDashOffset = -t * 30;
      c.beginPath(); c.moveTo(A[0], A[1]); c.quadraticCurveTo(K[0], K[1], B[0], B[1]); c.stroke();
      c.setLineDash([]);
      glow(c, fg, 14); c.fillStyle = fg;
      for (let k = 0; k < 2; k++) {
        const p0 = (t * 0.32 + e * 0.23 + k * 0.5) % 1;
        for (let q = 0; q < 7; q++) {
          const p = Math.max(0, p0 - q * 0.02), pt = bez(A, K, B, p);
          dot(c, pt[0], pt[1], 3.2 - q * 0.4, 1 - q * 0.15);
        }
      }
      noGlow(c);
    });
    const bw = s * 0.36, bh = s * 0.15;
    b.forEach((n, i) => {
      const on = i === stage;
      if (on) ripple(c, n.x, n.y, bw * 0.55, fr, fg);
      glow(c, fg, on ? 26 : 0);
      c.globalAlpha = 1; c.fillStyle = on ? fg : bg; c.strokeStyle = fg; c.lineWidth = 2;
      rr(c, n.x - bw / 2, n.y - bh / 2, bw, bh, 12); c.fill(); c.stroke();
      noGlow(c);
      c.fillStyle = on ? bg : fg;
      c.font = `600 ${Math.floor(s * 0.05)}px sans-serif`; c.textAlign = "center"; c.textBaseline = "middle";
      c.fillText(n.n, n.x, n.y);
    });
  },

  /* tilted orbital system with comet trails and radiating pulses */
  agent({ c, w, h, t, fg, bg }) {
    const s = Math.min(w, h), cx = w / 2, cy = h / 2;
    c.fillStyle = fg;
    for (let i = 0; i < 40; i++) {
      const a = i * 2.399 + t * (0.03 + (i % 5) * 0.01), r = s * (0.12 + (((i * 37) % 100) / 100) * 0.42);
      dot(c, cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.75, 0.8 + (i % 3) * 0.4, 0.15 + 0.15 * Math.sin(t * 2 + i));
    }
    for (let k = 0; k < 3; k++) ripple(c, cx, cy, s * 0.18, (t * 0.35 + k / 3) % 1, fg);
    const orbits = [
      { r: 0.2, tilt: 0.9, rot: t * 0.1, sp: 0.9, n: 1 },
      { r: 0.32, tilt: 1.15, rot: 1.1 - t * 0.07, sp: -0.65, n: 2 },
      { r: 0.44, tilt: 0.7, rot: 2.3 + t * 0.05, sp: 0.45, n: 3 },
    ];
    const sats: { x: number; y: number; z: number; r: number }[] = [];
    orbits.forEach((o, oi) => {
      const R = s * o.r, ry = R * Math.cos(o.tilt) * 0.9, cr = Math.cos(o.rot), sr = Math.sin(o.rot);
      c.strokeStyle = fg; c.lineWidth = 1.2; c.globalAlpha = 0.16;
      c.beginPath(); c.ellipse(cx, cy, R, Math.max(2, ry), o.rot, 0, TAU); c.stroke();
      const at = (a: number) => {
        const ex = Math.cos(a) * R, ey = Math.sin(a) * ry;
        return { x: cx + ex * cr - ey * sr, y: cy + ex * sr + ey * cr, z: Math.sin(a) * Math.sin(o.tilt) };
      };
      for (let m = 0; m < o.n; m++) {
        const a0 = t * o.sp + oi * 2 + (m * TAU) / o.n;
        glow(c, fg, 12); c.fillStyle = fg;
        for (let k = 14; k >= 1; k--) {
          const p = at(a0 - Math.sign(o.sp) * k * 0.05);
          dot(c, p.x, p.y, s * 0.012 * (1 - k / 16), (1 - k / 15) * 0.5);
        }
        noGlow(c);
        const p = at(a0);
        sats.push({ ...p, r: s * (0.03 + p.z * 0.008) });
      }
    });
    sats.sort((p, q) => p.z - q.z).forEach((p) => {
      glow(c, fg, 14);
      c.globalAlpha = 0.7 + p.z * 0.3; c.fillStyle = bg; c.strokeStyle = fg; c.lineWidth = 2;
      c.beginPath(); c.arc(p.x, p.y, p.r, 0, TAU); c.fill(); c.stroke();
      noGlow(c);
      c.fillStyle = fg; dot(c, p.x, p.y, p.r * 0.35);
    });
    const pulse = 1 + Math.sin(t * 2.2) * 0.06;
    glow(c, fg, 40); c.fillStyle = fg; dot(c, cx, cy, s * 0.095 * pulse); noGlow(c);
    c.fillStyle = bg;
    const look = Math.sin(t * 0.8) * s * 0.012, blink = Math.abs(Math.sin(t * 0.9)) > 0.97 ? 0.15 : 1;
    [-1, 1].forEach((d) => {
      c.globalAlpha = 1;
      c.beginPath(); c.ellipse(cx + d * s * 0.033 + look, cy - s * 0.008, s * 0.012, s * 0.016 * blink, 0, 0, TAU); c.fill();
    });
  },

  /* exploded isometric stack: wireframe, UI, code, breathing apart */
  web({ c, w, h, t, fg, bg }) {
    const s = Math.min(w, h), cx = w / 2, cy = h * 0.52, u = s * 0.34;
    const sep = s * (0.15 + 0.07 * Math.sin(t * 0.8));
    const P = (x: number, y: number, z: number) => [cx + (x - y) * 0.866 * u, cy + (x + y) * 0.5 * u - z] as const;
    const poly = (pts: (readonly number[])[]) => {
      c.beginPath(); c.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]);
      c.closePath();
    };
    const quad = (x0: number, y0: number, x1: number, y1: number, z: number) => poly([P(x0, y0, z), P(x1, y0, z), P(x1, y1, z), P(x0, y1, z)]);
    const L = 0.66;
    const zs = [-sep, 0, sep];
    c.strokeStyle = fg; c.lineWidth = 1; c.setLineDash([3, 5]); c.lineDashOffset = -t * 20;
    [[-L, -L], [L, -L], [L, L], [-L, L]].forEach(([x, y]) => {
      const a = P(x, y, zs[0]), b = P(x, y, zs[2]);
      c.globalAlpha = 0.25; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke();
    });
    c.setLineDash([]);
    zs.forEach((z, li) => {
      const zz = z + Math.sin(t * 1.1 + li * 1.4) * 3;
      c.globalAlpha = 0.92; c.fillStyle = bg; c.strokeStyle = fg; c.lineWidth = 2;
      glow(c, fg, li === 2 ? 22 : 8);
      quad(-L, -L, L, L, zz); c.fill(); c.stroke();
      noGlow(c);
      c.fillStyle = fg; c.strokeStyle = fg;
      if (li === 0) {
        c.lineWidth = 1;
        for (let g = -3; g <= 3; g++) {
          const v = (g / 3) * L * 0.9;
          c.globalAlpha = 0.22;
          let a = P(v, -L * 0.9, zz), b = P(v, L * 0.9, zz); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke();
          a = P(-L * 0.9, v, zz); b = P(L * 0.9, v, zz); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke();
        }
        const sx = ((t * 0.5) % 2) * L * 1.8 - L * 0.9;
        glow(c, fg, 16); c.globalAlpha = 0.9;
        const a = P(sx, -L * 0.9, zz), b = P(sx, L * 0.9, zz);
        c.lineWidth = 2; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke();
        noGlow(c);
      } else if (li === 1) {
        c.globalAlpha = 0.9; quad(-L * 0.85, -L * 0.85, L * 0.85, -L * 0.62, zz); c.fill();
        for (let k = 0; k < 3; k++) {
          const rv = Math.min(1, Math.max(0, ((t * 0.5 + k * 0.25) % 2.4) * 1.6 - 0.2));
          c.globalAlpha = 0.5 + 0.2 * k;
          const x0 = -L * 0.85 + k * L * 0.6;
          quad(x0, -L * 0.42, x0 + L * 0.5 * rv, L * 0.05, zz); c.fill();
        }
        for (let k = 0; k < 3; k++) {
          const rv = Math.min(1, Math.max(0, ((t * 0.6 + k * 0.2) % 2.4) * 1.4 - 0.3));
          c.globalAlpha = 0.35;
          quad(-L * 0.85, L * 0.25 + k * L * 0.2, -L * 0.85 + L * (1.7 - k * 0.4) * rv, L * 0.33 + k * L * 0.2, zz); c.fill();
        }
      } else {
        const lens = [0.9, 0.55, 0.75, 0.4, 0.65];
        glow(c, fg, 10);
        lens.forEach((ln, k) => {
          const rv = Math.min(1, Math.max(0, ((t * 0.7 + k * 0.15) % 2.6) * 1.5 - 0.2));
          c.globalAlpha = 0.9;
          const ind = k % 2 ? 0.2 : 0;
          quad(-L * 0.8 + ind, -L * 0.7 + k * L * 0.3, -L * 0.8 + ind + L * ln * rv, -L * 0.6 + k * L * 0.3, zz); c.fill();
        });
        noGlow(c);
        if (Math.sin(t * 6) > 0) { c.globalAlpha = 1; quad(L * 0.55, L * 0.5, L * 0.63, L * 0.62, zz); c.fill(); }
      }
    });
  },

  /* cloud pushing/pulling packets to racks, with sonar pulses */
  cloud({ c, w, h, t, fg, bg }) {
    const s = Math.min(w, h), cx = w / 2, cy = h * 0.27;
    for (let k = 0; k < 3; k++) ripple(c, cx, cy, s * 0.14, (t * 0.3 + k / 3) % 1, fg);
    const racks = [-0.3, 0, 0.3].map((dx) => ({ x: cx + dx * s * 1.05, y: h * 0.68, rw: s * 0.2, rh: s * 0.32 }));
    racks.forEach((r, i) => {
      const A = [cx, cy + s * 0.1], B = [r.x, r.y - r.rh / 2], K = [(A[0] + B[0]) / 2 + (i - 1) * s * 0.1, (A[1] + B[1]) / 2 - s * 0.05];
      c.strokeStyle = fg; c.lineWidth = 1.5; c.globalAlpha = 0.2;
      c.beginPath(); c.moveTo(A[0], A[1]); c.quadraticCurveTo(K[0], K[1], B[0], B[1]); c.stroke();
      glow(c, fg, 12); c.fillStyle = fg;
      for (let dir = 0; dir < 2; dir++) {
        const p0 = dir ? 1 - ((t * 0.5 + i * 0.3 + 0.5) % 1) : (t * 0.6 + i * 0.3) % 1;
        for (let q = 0; q < 6; q++) {
          const p = Math.min(1, Math.max(0, p0 - (dir ? -1 : 1) * q * 0.025)), pt = bez(A, K, B, p);
          dot(c, pt[0], pt[1], (dir ? 2.2 : 3) - q * 0.3, 1 - q * 0.16);
        }
      }
      noGlow(c);
      c.globalAlpha = 1; c.fillStyle = bg; c.strokeStyle = fg; c.lineWidth = 2;
      rr(c, r.x - r.rw / 2, r.y - r.rh / 2, r.rw, r.rh, 9); c.fill(); c.stroke();
      for (let k = 0; k < 3; k++) {
        const y = r.y - r.rh * 0.3 + k * r.rh * 0.3;
        c.globalAlpha = 0.25; c.strokeStyle = fg; c.lineWidth = 1;
        rr(c, r.x - r.rw * 0.4, y - r.rh * 0.1, r.rw * 0.8, r.rh * 0.2, 4); c.stroke();
        const on = Math.sin(t * 3 + i * 1.7 + k * 2.1) > 0;
        c.fillStyle = fg;
        if (on) glow(c, fg, 8);
        dot(c, r.x - r.rw * 0.24, y, 2.6, on ? 1 : 0.25);
        noGlow(c);
        c.globalAlpha = 0.3; c.fillRect(r.x - r.rw * 0.08, y - 1.5, r.rw * 0.4 * (0.4 + 0.6 * Math.abs(Math.sin(t + i + k))), 3);
      }
    });
    for (let k = 0; k < 5; k++) {
      const a = t * 0.5 + (k * TAU) / 5;
      c.fillStyle = fg; dot(c, cx + Math.cos(a) * s * 0.24, cy + Math.sin(a) * s * 0.07, 2, 0.5);
    }
    c.save(); c.translate(0, Math.sin(t * 1.4) * 3);
    glow(c, fg, 30);
    c.globalAlpha = 1; c.fillStyle = bg; c.strokeStyle = fg; c.lineWidth = 2.5;
    c.beginPath();
    c.arc(cx - s * 0.12, cy + s * 0.02, s * 0.09, Math.PI * 0.5, Math.PI * 1.5);
    c.arc(cx - s * 0.02, cy - s * 0.06, s * 0.11, Math.PI, Math.PI * 2);
    c.arc(cx + s * 0.12, cy + s * 0.02, s * 0.09, Math.PI * 1.5, Math.PI * 0.5);
    c.closePath(); c.fill(); c.stroke();
    noGlow(c); c.restore();
  },

  /* CI/CD infinity loop: comet head lights each stage */
  devops({ c, w, h, t, fg, bg }) {
    const s = Math.min(w, h), names = ["Commit", "Build", "Test", "Deploy"];
    const a = Math.min(w * 0.4, s * 0.62), cy = h * 0.47;
    const pt = (u: number) => {
      const d = 1 + Math.sin(u) ** 2;
      return [w / 2 + (a * Math.cos(u)) / d, cy + (a * 0.95 * Math.sin(u) * Math.cos(u)) / d];
    };
    c.strokeStyle = fg; c.lineWidth = 2; c.globalAlpha = 0.16;
    c.beginPath();
    for (let i = 0; i <= 120; i++) { const p = pt((i / 120) * TAU); if (i) c.lineTo(p[0], p[1]); else c.moveTo(p[0], p[1]); }
    c.stroke();
    const phi = (t * 0.75) % TAU;
    const thr = names.map((_, i) => Math.PI / 4 + (i * Math.PI) / 2);
    glow(c, fg, 16); c.fillStyle = fg;
    for (let k = 0; k < 46; k++) {
      const p = pt(phi - k * 0.035);
      dot(c, p[0], p[1], s * 0.022 * (1 - k / 50), (1 - k / 46) ** 1.5);
    }
    noGlow(c);
    thr.forEach((u, i) => {
      const [x, y] = pt(u), done = phi >= u, age = phi - u;
      if (done && age < 1) ripple(c, x, y, s * 0.075, age, fg);
      glow(c, fg, done ? 22 : 0);
      c.globalAlpha = 1; c.fillStyle = done ? fg : bg; c.strokeStyle = fg; c.lineWidth = 2.5;
      c.beginPath(); c.arc(x, y, s * 0.075, 0, TAU); c.fill(); c.stroke();
      noGlow(c);
      c.fillStyle = done ? bg : fg; c.font = `700 ${Math.floor(s * 0.055)}px sans-serif`; c.textAlign = "center"; c.textBaseline = "middle";
      c.fillText(done ? "✓" : String(i + 1), x, y);
      c.fillStyle = fg; c.globalAlpha = done ? 1 : 0.6; c.font = `500 ${Math.floor(s * 0.042)}px sans-serif`;
      c.fillText(names[i], x, y + s * 0.14); c.globalAlpha = 1;
    });
    const hp = pt(phi);
    glow(c, fg, 30); c.fillStyle = fg; dot(c, hp[0], hp[1], s * 0.02); noGlow(c);
  },
};

function Illustration({ kind }: { kind: Kind }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current!;
    const c = cv.getContext("2d")!;
    let w = 0, h = 0, raf = 0, visible = false;
    const size = () => {
      const r = cv.parentElement!.getBoundingClientRect();
      const d = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      cv.width = w * d; cv.height = h * d;
      c.setTransform(d, 0, 0, d, 0, 0);
    };
    size();
    const start = performance.now();
    const loop = () => {
      if (!visible) return;
      const cs = getComputedStyle(cv);
      c.clearRect(0, 0, w, h);
      c.globalAlpha = 1;
      draw[kind]({ c, w, h, t: (performance.now() - start) / 1000, fg: cs.color, bg: cs.getPropertyValue("--background").trim() || "#000" });
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) loop();
    });
    io.observe(cv);
    const ro = new ResizeObserver(size);
    ro.observe(cv.parentElement!);
    return () => { io.disconnect(); ro.disconnect(); cancelAnimationFrame(raf); };
  }, [kind]);
  return <canvas ref={ref} className="block w-full h-full text-foreground" />;
}

/* ---------- section ---------- */
export default function Services() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const t = track.current!;
      const distance = () => Math.max(0, t.scrollWidth - document.documentElement.clientWidth);

      const scrollTween = gsap.to(t, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      gsap.utils.toArray<HTMLElement>("[data-panel]").forEach((panel) => {
        gsap.fromTo(
          panel.querySelectorAll("[data-animate]"),
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 1, stagger: 0.25, ease: "power3.out",
            scrollTrigger: { trigger: panel, containerAnimation: scrollTween, start: "left 75%", toggleActions: "play none none reverse" },
          }
        );
        const line = panel.querySelector("[data-line]");
        if (line)
          gsap.fromTo(line, { scaleY: 0 }, {
            scaleY: 1, duration: 0.8, ease: "power2.out",
            scrollTrigger: { trigger: panel, containerAnimation: scrollTween, start: "left 85%", toggleActions: "play none none reverse" },
          });
      });


      const refresh = () => ScrollTrigger.refresh();
      document.fonts?.ready.then(refresh);
      window.addEventListener("load", refresh);
      return () => window.removeEventListener("load", refresh);
    },
    { scope: root }
  );

  return (
    <section id="services" ref={root} className="relative z-20 w-full h-screen overflow-hidden bg-background text-foreground">
      <div ref={track} className="flex h-full w-max will-change-transform">
        {/* intro */}
        <div className="relative shrink-0 w-screen h-full flex flex-col justify-center px-6 md:px-[8vw]">
          <h2 className={`font-bold leading-[0.95] tracking-[-0.03em] text-[clamp(3rem,10vw,10rem)] ${syne.className}`}>
            What we<br /><em className="opacity-60">build</em>
          </h2>
          <p className="mt-8 max-w-[460px] leading-relaxed opacity-40 text-[clamp(0.9rem,1.5vw,1.25rem)]">
            From AI products to the infrastructure that runs them, everything you need to ship, under one roof.
          </p>
        </div>

        {services.map((s) => (
          <div key={s.num} data-panel className="relative shrink-0 w-screen h-full flex items-center justify-center px-6 md:px-[6vw] pt-20 pb-28 md:py-20">
            <div className="w-full max-w-[1300px] h-full flex flex-col md:flex-row items-center justify-between md:justify-center gap-6 md:gap-[6vw] text-center md:text-left">
              <div data-animate className="flex-1 flex flex-col justify-center gap-4 md:gap-6 items-center md:items-start">
                <span className="text-sm tracking-[0.12em] opacity-30">{s.num}</span>
                <h3 className={`font-bold leading-none tracking-[-0.02em] text-[clamp(2rem,5vw,4.5rem)] ${syne.className}`}>
                  {s.title[0]}{s.title[1] && <><br />{s.title[1]}</>}
                </h3>
                <p className="max-w-[380px] leading-[1.8] opacity-50 text-sm md:text-lg">{s.text}</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {s.tags.map((tag) => (
                    <span key={tag} className="text-[0.72rem] tracking-[0.04em] px-3.5 py-1.5 rounded-full border border-foreground/20 opacity-50 hover:opacity-90 transition-opacity whitespace-nowrap">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div data-animate className="flex-1 w-full flex items-center justify-center max-h-[38vh] md:max-h-none">
                <div className="w-full max-w-[320px] md:max-w-[440px] aspect-[4/3]">
                  <Illustration kind={s.kind} />
                </div>
              </div>
            </div>
            <div data-line className="hidden md:block absolute left-0 top-[15%] h-[70%] w-px bg-foreground/15 origin-center" />
          </div>
        ))}
      </div>
    </section>
  );
}
