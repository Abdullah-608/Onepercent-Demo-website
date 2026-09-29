"use client";
import { useEffect, useRef } from "react";
import { syne } from "@/lib/fonts";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}


export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);
  
  const stats = [
    { prefix: "$", value: 40, suffix: "K+", label: "Combined earned" },
    { prefix: "", value: 38, suffix: "", label: "Upwork jobs" },
    { prefix: "", value: 832, suffix: "", label: "Tracked hours" },
    { prefix: "", value: 100, suffix: "%", label: "Job Success" },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered fade and slide up for the entire block
      gsap.from(".stat-block", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 90%", // Trigger when section comes into view
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.2)",
      });

      // Number counting animation
      const numberElements = gsap.utils.toArray<HTMLElement>(".stat-number");
      numberElements.forEach((el) => {
        const targetValue = parseFloat(el.getAttribute("data-target") || "0");
        
        gsap.to(el, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 90%",
          },
          innerHTML: targetValue,
          duration: 2.5,
          ease: "power3.out",
          snap: { innerHTML: 1 }, // Snap to whole numbers while counting
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className={`w-full border-y border-foreground/10 bg-foreground/[0.02] backdrop-blur-sm relative z-10 ${syne.className}`}
    >
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              className="stat-block flex flex-col items-center justify-center space-y-2"
            >
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight flex items-center">
                <span>{stat.prefix}</span>
                <span className="stat-number" data-target={stat.value}>0</span>
                <span>{stat.suffix}</span>
              </h3>
              <p className="text-xs md:text-sm font-semibold uppercase tracking-widest text-foreground/60">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
