"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { syne } from "@/lib/fonts";
import Link from "next/link";
import Avatar from "@/components/Avatar";
import SectionHead from "@/components/SectionHead";
import { stories } from "@/lib/content";


// Same clients and quotes as the stories page
const testimonials = stories.map((s) => ({ name: s.person, role: `${s.role}, ${s.client}`, content: s.quote, metric: s.metric, metricLabel: s.metricLabel }));

// Two passes of the data so the loop wraps seamlessly and the ring is wide enough.
const items = [...testimonials, ...testimonials];

export default function Trusted() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current!;
    const cards = Array.from(stage.querySelectorAll<HTMLElement>("[data-card]"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let step = 300;
    let maxAngle = 45;
    let depth = 200;
    const measure = () => {
      const mobile = window.innerWidth < 768;
      const w = cards[0].offsetWidth;
      step = w * (mobile ? 0.7 : 0.86);
      maxAngle = mobile ? 38 : 45;
      depth = mobile ? 140 : 200;
    };
    measure();
    window.addEventListener("resize", measure);

    let offset = 0;
    const speed = 1;
    let visible = false;
    const total = () => cards.length * step;

    const render = () => {
      const T = total();
      cards.forEach((card, i) => {
        // signed distance from the centre in "card slots", wrapped into [-N/2, N/2)
        const x = (((i * step - offset) % T) + T + T / 2) % T - T / 2;
        const d = x / step;
        const a = Math.min(Math.abs(d), 1);
        const far = Math.min(Math.abs(d), 3);
        const angle = -Math.max(-1, Math.min(1, d)) * maxAngle;
        const z = -a * depth - Math.max(0, far - 1) * depth * 0.6;
        const scale = 1 - far * 0.06;
        card.style.transform = `translate3d(${x}px,0,${z}px) rotateY(${angle}deg) scale(${scale})`;
        card.style.opacity = String(Math.max(0, 1 - Math.max(0, far - 1.6) * 0.7));
        card.style.zIndex = String(100 - Math.round(Math.abs(d) * 10));
        card.style.visibility = far > 2.9 ? "hidden" : "visible";
      });
    };

    const tick = () => {
      if (!visible) return;
      const dt = Math.min(gsap.ticker.deltaRatio(60), 3) / 60;
      if (!reduce) offset += step * 0.28 * speed * dt;
      render();
    };
    gsap.ticker.add(tick);

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(sectionRef.current!);

    render();

    return () => {
      gsap.ticker.remove(tick);
      io.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`w-full relative overflow-hidden bg-background text-foreground py-24 md:py-32 border-t border-foreground/10`}
    >
      <div className="max-w-7xl mx-auto px-6 relative z-20">
        <SectionHead title="Trusted by" muted="the teams we build for" note="Every quote comes with a number. Read the full stories to see what changed." />
      </div>

      {/* perspective wrapper (no overflow here, or preserve-3d would be flattened) */}
      <div className="relative mt-10 md:mt-14 h-[380px] md:h-[440px] [perspective:1200px] md:[perspective:1400px]">
        <div ref={stageRef} className="absolute inset-0 [transform-style:preserve-3d]">
          {items.map((item, i) => {
            return (
              <div
                key={i}
                data-card
                className="absolute left-1/2 top-1/2 -ml-[130px] md:-ml-[190px] -mt-[150px] md:-mt-[165px] w-[260px] md:w-[380px] h-[300px] md:h-[330px] [transform-style:preserve-3d] will-change-transform"
              >
                <div className="relative h-full flex flex-col justify-between gap-4 p-6 md:p-8 rounded-[1.75rem] border border-foreground/30 bg-background overflow-hidden">
                  <div className="absolute inset-0 bg-foreground/[0.04] pointer-events-none" />
                  <div className="relative flex flex-col gap-2">
                    <span className={`text-4xl md:text-5xl font-extrabold tracking-tight ${syne.className}`}>{item.metric}</span>
                    <span className="text-xs md:text-sm text-foreground/50 leading-snug">{item.metricLabel}</span>
                  </div>
                  <p className="relative text-sm md:text-lg text-foreground/90 leading-relaxed">&ldquo;{item.content}&rdquo;</p>
                  <div className="relative flex items-center gap-3 pt-4 border-t border-foreground/10">
                    <Avatar name={item.name} className="w-10 h-10 md:w-12 md:h-12" />
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-sm md:text-base truncate">{item.name}</span>
                      <span className="text-xs md:text-sm text-foreground/50 truncate">{item.role}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-10 md:mt-14">
        <Link href="/stories" className="text-sm font-semibold underline underline-offset-4 decoration-foreground/30 hover:opacity-70 transition-opacity">
          Read the client stories
        </Link>
      </div>
    </section>
  );
}
