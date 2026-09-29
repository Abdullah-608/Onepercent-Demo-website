import type { Metadata } from "next";
import Manifesto from "@/components/pages/Manifesto";
import AboutMark from "@/components/pages/AboutMark";
import Stats from "@/components/Stats";
import Avatar from "@/components/Avatar";
import CallToAction from "@/components/CallToAction";
import SectionHead from "@/components/SectionHead";
import { syne } from "@/lib/fonts";
import { manifesto, principles, team } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: "A small senior team designing, building and running AI products, automations and web platforms.",
};

export default function AboutPage() {
  return (
    <main className="flex-1 w-full flex flex-col">

      <AboutMark />

      <Manifesto text={manifesto} />

      <Stats />

      {/* Principles */}
      <section className="w-full px-6 py-24 md:py-32">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          <h2 className={`lg:col-span-4 font-bold leading-[0.95] tracking-[-0.03em] text-[clamp(2rem,4vw,3.5rem)] lg:sticky lg:top-32 self-start ${syne.className}`}>
            How we<br /><em className="opacity-60">think</em>
          </h2>
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 border-t border-foreground/10">
            {principles.map((p, i) => (
              <div
                key={p.title}
                className={`py-10 md:py-12 border-b border-foreground/10 ${i % 2 === 0 ? "md:pr-10 md:border-r" : "md:pl-10"}`}
              >
                <h3 className={`text-2xl md:text-3xl font-bold tracking-tight ${syne.className}`}>{p.title}</h3>
                <p className="mt-4 max-w-sm leading-relaxed text-foreground/60">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="w-full px-6 pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto">
          <SectionHead title="The people" muted="behind it" note="Six specialists, no account managers. You talk directly to whoever is building your product." />
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-12">
            {team.map((m) => (
              <li key={m.name} className="group flex flex-col gap-5">
                <div className="relative aspect-square rounded-[2rem] border border-foreground/15 bg-foreground/[0.03] flex items-center justify-center overflow-hidden transition-colors duration-500 group-hover:border-foreground/40 group-hover:bg-foreground/[0.06]">
                  <Avatar name={m.name} className="w-3/5 aspect-square transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div>
                  <p className={`text-lg md:text-xl font-bold ${syne.className}`}>{m.name}</p>
                  <p className="text-sm text-foreground/50">{m.role}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CallToAction />
    </main>
  );
}
