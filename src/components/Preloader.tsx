"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the stairs up
      gsap.to(".stair", {
        y: "-100%",
        duration: 0.8,
        stagger: 0.1,
        ease: "power4.inOut",
        delay: 0.5,
      });

      // Hide the container after animation completes
      gsap.delayedCall(1.8, () => {
        if (containerRef.current) {
          containerRef.current.style.display = "none";
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex pointer-events-none"
    >
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="stair h-full w-1/5 bg-foreground"
        />
      ))}
    </div>
  );
}
