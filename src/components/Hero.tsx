"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Typewriter } from 'react-simple-typewriter';
import { syne } from "@/lib/fonts";
import WebsiteMockup from "./graphics/WebsiteMockup";
import AppMockup from "./graphics/AppMockup";
import ParticlesBackground from "./graphics/ParticlesBackground";

const words = ["STUNNING", "POWERFUL", "IMMERSIVE", "FLAWLESS"];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Text entrance animation
      gsap.from(".hero-line", {
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.2,
      });

      // 2. Floating cards animation
      const cards = gsap.utils.toArray<HTMLElement>(".floating-card");
      
      gsap.from(cards, {
        y: 50,
        opacity: 0,
        scale: 0.8,
        duration: 1,
        stagger: 0.15,
        ease: "back.out(1.5)",
        delay: 0.8,
      });

      cards.forEach((card, i) => {
        gsap.to(card, {
          y: i % 2 === 0 ? "-=20" : "+=20",
          rotation: i % 2 === 0 ? 3 : -3,
          duration: 2.5 + i * 0.2,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          delay: i * 0.1,
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef} 
      className={`relative min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground overflow-hidden px-4 ${syne.className}`}
    >
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-foreground/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Animated Particles Background */}
      <ParticlesBackground />

      {/* Main Typography Block */}
      <div className="relative z-10 text-center flex flex-col items-center justify-center w-full max-w-6xl gap-1 md:gap-3 lg:gap-4 pointer-events-none">
        
        <div className="overflow-hidden">
          <h1 className="hero-line text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight font-bold uppercase opacity-90">
            Crafting
          </h1>
        </div>
        
        {/* Typing Word */}
        <div className="hero-line w-full px-2">
          <h1 
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight font-extrabold uppercase break-words min-h-[1.25em] text-foreground/30"
          >
            <Typewriter
              words={words}
              loop={0}
              cursor={false}
              typeSpeed={80}
              deleteSpeed={50}
              delaySpeed={1500}
            />
          </h1>
        </div>

        <div className="overflow-hidden">
          <h1 className="hero-line text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight font-bold uppercase opacity-90">
            Digital Products
          </h1>
        </div>

      </div>

      {/* Floating Glassmorphism Cards & Graphics */}
      
      {/* 1. 3D Website Mockup */}
      <WebsiteMockup />

      {/* 2. Mobile App Mockup */}
      <AppMockup />

    </section>
  );
}
