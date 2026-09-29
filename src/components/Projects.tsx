"use client";
import { useEffect, useRef, useState } from "react";
import { syne } from "@/lib/fonts";
import Contact from "./Contact";
import { projects, type Project as P } from "@/lib/content";


const ZOOM = 1; // extra screens of scroll for the final zoom

function Face({ p, i, back }: { p: P; i: number; back?: boolean }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden rounded-3xl border border-foreground/20 bg-black [backface-visibility:hidden]"
      style={back ? { transform: "rotateX(180deg)" } : undefined}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={p.image} alt={p.title} className="absolute inset-0 w-full h-full object-cover grayscale" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/30" />
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-6 md:p-10 text-white/80 text-xs md:text-sm tracking-[0.2em] uppercase">
        <span>{p.type}</span>
        <span>{p.year}</span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-6 p-6 md:p-10 text-white">
        <div className="min-w-0">
          <h3 className={`text-4xl md:text-7xl font-extrabold tracking-tight ${syne.className}`}>{p.title}</h3>
          <p className="mt-3 max-w-[520px] text-sm md:text-base opacity-70 leading-relaxed hidden sm:block">{p.text}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {p.tags.map((t) => (
              <span key={t} className="px-3 py-1 rounded-full border border-white/30 text-xs md:text-sm">{t}</span>
            ))}
          </div>
        </div>
        <span className={`text-5xl md:text-8xl font-extrabold opacity-30 leading-none ${syne.className}`}>{String(i + 1).padStart(2, "0")}</span>
      </div>
    </div>
  );
}

export default function Projects() {
  const root = useRef<HTMLElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const lift = useRef<HTMLDivElement>(null);
  const glare = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const form = useRef<HTMLDivElement>(null);
  const [face, setFace] = useState({ front: 0, back: 1 });
  const [active, setActive] = useState(0);

  // Sticky scroll: tall section, sticky stage, scroll progress drives a real 180deg card flip.
  useEffect(() => {
    const n = projects.length;

    const update = () => {
      const el = root.current, c = card.current, l = lift.current;
      if (!el || !c || !l) return;
      const total = el.offsetHeight - window.innerHeight;
      const prog = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / total));
      const F = (n - 1) / (n - 1 + ZOOM); // share of the scroll spent flipping; the rest is the zoom-out
      const p = Math.min(1, prog / F);
      const z = Math.max(0, (prog - F) / (1 - F));
      const pos = p * (n - 1);
      const i = Math.min(n - 2, Math.floor(pos));
      const f = pos - i;
      const k = Math.min(1, Math.max(0, (f - 0.15) / 0.7)); // hold, then toss
      const e = k < 0.5 ? 0.5 - Math.pow(1 - 2 * k, 2.2) / 2 : 0.5 + Math.pow(2 * k - 1, 2.2) / 2; // fast mid-air, soft landing
      const wave = Math.sin(e * Math.PI);

      c.style.transform = `rotateX(${-(i + e) * 180}deg)`;
      l.style.transform = `translateY(${-wave * window.innerHeight * 0.16}px) translateZ(${wave * 260}px) scale(${1 + (1 - Math.pow(1 - z, 2)) * 0.62})`; // grows to fill the screen, then scrolls away
      const o = Math.min(1, Math.max(0, (z - 0.55) / 0.4)); // 0 -> 1 as the card gives way to the form
      l.style.opacity = String(1 - o);
      if (form.current) {
        form.current.style.opacity = String(o);
        form.current.style.transform = `translateY(${(1 - o) * 4}vh) scale(${0.97 + o * 0.03})`;
        form.current.style.pointerEvents = o > 0.9 ? "auto" : "none";
      }
      if (glare.current) {
        glare.current.style.opacity = String(wave * 0.9);
        glare.current.style.transform = `translateY(${(0.5 - e) * 220}%)`;
      }
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;

      const cur = Math.min(n - 1, Math.round(pos));
      setActive((a) => (a === cur ? a : cur));
      // whichever face is hidden gets the next project
      const front = i % 2 === 0 ? i : i + 1;
      const back = i % 2 === 0 ? i + 1 : i;
      setFace((o) => (o.front === front && o.back === back ? o : { front, back }));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section id="projects" ref={root} className="relative z-20 w-full bg-background text-foreground" style={{ height: `${(projects.length + ZOOM) * 100 + 100}vh` }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center [perspective:1600px]">
          <div ref={lift} className="[transform-style:preserve-3d]">
            <div className="relative w-[86vw] h-[62vh] md:w-[68vw] md:h-[72vh] max-w-[1150px] rounded-3xl">
              <div ref={card} className="absolute inset-0 [transform-style:preserve-3d]">
                <Face p={projects[face.front]} i={face.front} />
                <Face p={projects[face.back]} i={face.back} back />
              </div>
              {/* light sweep across the card while it turns */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                <div ref={glare} className="absolute inset-x-0 -top-1/2 h-full opacity-0 bg-gradient-to-b from-transparent via-white/40 to-transparent" />
              </div>
            </div>
          </div>
        </div>

        {/* contact appears in place once the last project has zoomed away */}
        <div ref={form} className="absolute inset-0 z-40 opacity-0 pointer-events-none">
          <Contact />
        </div>

        {/* progress */}
        <div className={`absolute bottom-6 left-6 right-6 md:left-10 md:right-10 z-30 flex items-center gap-4 text-sm tracking-widest ${syne.className}`}>
          <span className="opacity-70 tabular-nums">{String(active + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
          <div className="relative h-px flex-1 bg-foreground/20">
            <div ref={bar} className="absolute inset-0 origin-left bg-foreground" style={{ transform: "scaleX(0)" }} />
          </div>
        </div>
      </div>
      {/* preload every image so flips never show a blank face */}
      <div className="hidden">
        {projects.map((p) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={p.image} src={p.image} alt="" />
        ))}
      </div>
    </section>
  );
}
