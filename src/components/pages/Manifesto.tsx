"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { syne } from "@/lib/fonts";

gsap.registerPlugin(ScrollTrigger);

// Words light up one by one as the paragraph scrolls through the viewport.
export default function Manifesto({ text }: { text: string }) {
  const root = useRef<HTMLElement>(null);
  const words = text.split(" ");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-word]",
          { opacity: 0.15 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top 75%", end: "bottom 55%", scrub: true },
          }
        );
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="w-full bg-background text-foreground px-6 py-24 md:py-32">
      <p className={`max-w-6xl mx-auto font-bold leading-[1.15] tracking-[-0.02em] text-[clamp(1.75rem,4.2vw,3.75rem)] ${syne.className}`}>
        {words.map((w, i) => (
          <span key={i} data-word className="inline">
            {w}{" "}
          </span>
        ))}
      </p>
    </section>
  );
}
