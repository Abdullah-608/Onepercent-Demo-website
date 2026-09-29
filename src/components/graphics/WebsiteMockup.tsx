import React from "react";

export default function WebsiteMockup() {
  return (
    <div
      className="floating-card absolute hidden md:flex flex-col top-[12%] left-[5%] xl:left-[10%] w-[340px] rounded-2xl overflow-hidden border border-foreground/20 bg-background/30 backdrop-blur-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] dark:shadow-[0_0_50px_-15px_rgba(255,255,255,0.1)] z-0"
      style={{
        transform: "perspective(1000px) rotateX(15deg) rotateY(15deg) rotateZ(-8deg)",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Glossy overlay reflection */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 pointer-events-none" />
      
      {/* Internal ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-32 h-32 bg-primary/20 blur-[50px] rounded-full pointer-events-none" />

      {/* Browser Chrome (Top bar) */}
      <div className="flex items-center px-4 py-3 border-b border-foreground/10 bg-foreground/5 backdrop-blur-md relative z-10">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80 shadow-[0_0_5px_rgba(244,63,94,0.5)]" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80 shadow-[0_0_5px_rgba(245,158,11,0.5)]" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
        </div>
        
        {/* Mock URL bar */}
        <div className="mx-auto flex gap-1 items-center px-3 py-1 rounded-full bg-foreground/10 border border-foreground/5 w-1/2">
           <div className="w-2 h-2 rounded-full bg-foreground/30" />
           <div className="w-full h-1 rounded-full bg-foreground/20" />
        </div>

        {/* Mock Menu Icon */}
        <div className="flex flex-col gap-0.5">
           <div className="w-3 h-0.5 rounded-full bg-foreground/40" />
           <div className="w-3 h-0.5 rounded-full bg-foreground/40" />
           <div className="w-3 h-0.5 rounded-full bg-foreground/40" />
        </div>
      </div>

      {/* Website Body */}
      <div className="p-4 flex flex-col gap-4 relative z-10">
        
        {/* Hero Section Mockup */}
        <div className="w-full h-28 rounded-xl bg-gradient-to-br from-foreground/10 to-transparent border border-foreground/10 relative overflow-hidden flex items-center justify-center shadow-inner">
          {/* Inner image placeholder */}
          <div className="w-2/3 h-1/2 rounded-lg border border-foreground/20 bg-background/50 flex flex-col items-center justify-center gap-2 shadow-[0_5px_15px_rgba(0,0,0,0.2)]">
            <div className="w-8 h-8 rounded-full bg-foreground/20 mb-1" />
            <div className="w-1/2 h-1.5 rounded-full bg-foreground/30" />
          </div>
        </div>

        {/* Content Layout Mockup */}
        <div className="flex gap-3">
          {/* Left Sidebar */}
          <div className="w-1/3 flex flex-col gap-2">
            <div className="w-full h-2 rounded-full bg-foreground/20" />
            <div className="w-4/5 h-2 rounded-full bg-foreground/10" />
            <div className="w-full h-2 rounded-full bg-foreground/10" />
            <div className="w-2/3 h-2 rounded-full bg-foreground/10" />
          </div>

          {/* Right Cards */}
          <div className="w-2/3 grid grid-cols-2 gap-2">
            <div className="h-12 rounded-lg border border-foreground/10 bg-foreground/5" />
            <div className="h-12 rounded-lg border border-foreground/10 bg-foreground/5" />
          </div>
        </div>
        
        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-foreground/20 to-transparent my-1" />
        
        {/* Bottom Banner Mockup */}
        <div className="w-full h-10 rounded-lg border border-foreground/10 bg-foreground/5 flex items-center px-3 gap-2">
           <div className="w-6 h-6 rounded bg-foreground/20" />
           <div className="flex flex-col gap-1 w-full">
             <div className="w-1/2 h-1.5 rounded-full bg-foreground/20" />
             <div className="w-1/3 h-1.5 rounded-full bg-foreground/10" />
           </div>
           <div className="w-10 h-4 rounded-full bg-foreground/20 ml-auto" />
        </div>
      </div>
    </div>
  );
}
