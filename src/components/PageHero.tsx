"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { syne } from "@/lib/fonts";

type Props = {
  lines: string[];
  intro: string;
  children?: React.ReactNode;
};

export default function PageHero({ lines, intro, children }: Props) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-line]", { yPercent: 110, duration: 1.1, stagger: 0.12, ease: "power4.out", delay: 0.1 });
        gsap.from("[data-fade]", { opacity: 0, y: 24, duration: 0.9, ease: "power3.out", delay: 0.55 });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative w-full bg-background text-foreground px-6 pt-40 md:pt-48 pb-16 md:pb-24">
      <div className="max-w-7xl mx-auto">
        <h1 className={`font-extrabold uppercase leading-[0.9] tracking-[-0.03em] text-[clamp(1.75rem,8.2vw,8.5rem)] ${syne.className}`}>
          {lines.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.06em]">
              {/* Lines after the first are the headline's muted second half */}
              <span data-line className={`block ${i > 0 ? "text-foreground/30" : ""}`}>
                {line}
              </span>
            </span>
          ))}
        </h1>
        <div data-fade className="mt-10 md:mt-14 flex flex-col md:flex-row md:items-end md:justify-between gap-8 border-t border-foreground/10 pt-8">
          <p className="max-w-xl text-base md:text-xl leading-relaxed text-foreground/60">{intro}</p>
          {children}
        </div>
      </div>
    </section>
  );
}
