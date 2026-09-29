import React from "react";

export default function AppMockup() {
  return (
    <div
      className="floating-card absolute hidden md:flex flex-col bottom-[15%] right-[5%] xl:right-[12%] w-[240px] rounded-[2rem] overflow-hidden border-[3px] border-foreground/20 bg-background/30 backdrop-blur-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] dark:shadow-[0_0_50px_-15px_rgba(255,255,255,0.1)] z-0"
      style={{
        transform: "perspective(1000px) rotateX(15deg) rotateY(-20deg) rotateZ(10deg)",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Glossy overlay reflection */}
      <div className="absolute inset-0 bg-gradient-to-bl from-white/20 via-white/5 to-transparent pointer-events-none" />
      
      {/* Internal ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-40 h-40 bg-primary/20 blur-[60px] rounded-full pointer-events-none" />

      {/* Notch / Dynamic Island */}
      <div className="w-full flex justify-center pt-2 relative z-10 pb-4">
        <div className="w-20 h-5 rounded-full bg-foreground/10 border border-foreground/5 shadow-inner" />
      </div>

      {/* Website Body / App Content */}
      <div className="px-4 pb-6 flex flex-col gap-4 relative z-10">
        
        {/* Header Mockup */}
        <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1 w-1/2">
                <div className="w-full h-2 rounded-full bg-foreground/30" />
                <div className="w-2/3 h-2 rounded-full bg-foreground/10" />
            </div>
            <div className="w-8 h-8 rounded-full border border-foreground/10 bg-foreground/5" />
        </div>

        {/* Hero Chart Mockup */}
        <div className="w-full h-32 rounded-2xl bg-gradient-to-br from-foreground/10 to-transparent border border-foreground/10 relative overflow-hidden flex items-end justify-between px-3 pt-4 pb-3 shadow-inner">
          <div className="w-1/5 h-[40%] rounded-t-md bg-foreground/20" />
          <div className="w-1/5 h-[70%] rounded-t-md bg-foreground/30" />
          <div className="w-1/5 h-[50%] rounded-t-md bg-foreground/20" />
          <div className="w-1/5 h-[60%] rounded-t-md bg-foreground/30" />
        </div>

        {/* List Items */}
        <div className="flex flex-col gap-2">
            <div className="w-full h-12 rounded-xl border border-foreground/10 bg-foreground/5 flex items-center px-3 gap-3">
                <div className="w-6 h-6 rounded-full bg-foreground/20" />
                <div className="flex flex-col gap-1 w-full">
                    <div className="w-3/4 h-1.5 rounded-full bg-foreground/20" />
                    <div className="w-1/2 h-1.5 rounded-full bg-foreground/10" />
                </div>
            </div>
            <div className="w-full h-12 rounded-xl border border-foreground/10 bg-foreground/5 flex items-center px-3 gap-3">
                <div className="w-6 h-6 rounded-full bg-foreground/20" />
                <div className="flex flex-col gap-1 w-full">
                    <div className="w-2/3 h-1.5 rounded-full bg-foreground/20" />
                    <div className="w-1/3 h-1.5 rounded-full bg-foreground/10" />
                </div>
            </div>
        </div>
        
        {/* Bottom Nav Bar */}
        <div className="mt-2 w-full h-12 rounded-2xl border border-foreground/10 bg-foreground/5 flex items-center justify-around px-2 shadow-[0_-5px_15px_rgba(0,0,0,0.1)]">
            <div className="w-5 h-5 rounded-full bg-foreground/30" />
            <div className="w-5 h-5 rounded-full bg-foreground/20" />
            <div className="w-5 h-5 rounded-full bg-foreground/20" />
        </div>

      </div>
    </div>
  );
}
