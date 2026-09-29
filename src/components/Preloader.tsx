"use client";
import { useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

// Set to false to run the staircase in the same direction on every page
const ALTERNATE = true;

// Staircase that covers the page on first load and on every page change, then reveals it.
// The first load lifts the stairs up from the left; after that, each navigation flips
// `reverse`, so the next one drops them down from the right.
export default function Preloader() {
  const pathname = usePathname();
  const root = useRef<HTMLDivElement>(null);
  const [nav, setNav] = useState({ path: pathname, count: 0 });
  if (nav.path !== pathname) setNav({ path: pathname, count: nav.count + 1 });

  const reverse = ALTERNATE && nav.count % 2 === 1;
  const first = nav.count === 0;

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      gsap.set(el, { display: "flex", opacity: 1 });
      const tl = gsap.timeline({ onComplete: () => gsap.set(el, { display: "none" }) });

      if (reduce) {
        tl.to(el, { opacity: 0, duration: 0.3, delay: 0.1 });
      } else {
        tl.fromTo(
          "[data-stair]",
          { yPercent: 0 },
          {
            yPercent: reverse ? 100 : -100,
            duration: 0.8,
            stagger: { each: 0.1, from: reverse ? "end" : "start" },
            ease: "power4.inOut",
            delay: first ? 0.5 : 0.15,
          }
        );
      }
    }, el);

    return () => ctx.revert();
  }, [nav.count, reverse, first]);

  return (
    <div ref={root} aria-hidden className="fixed inset-0 z-[70] flex pointer-events-none">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} data-stair className="h-full w-1/5 bg-foreground" />
      ))}
    </div>
  );
}
