import type { Metadata } from "next";
import ScheduleHero from "@/components/pages/ScheduleHero";
import ProcessMorph from "@/components/pages/ProcessMorph";
import Faq from "@/components/pages/Faq";
import CallToAction from "@/components/CallToAction";
import SectionHead from "@/components/SectionHead";
import { syne } from "@/lib/fonts";
import { engagements, faqs } from "@/lib/content";

export const metadata: Metadata = {
  title: "How We Work",
  description: "Our process from the first call to launch, ways to work with us, and answers to common questions.",
};

export default function HowWeWorkPage() {
  return (
    <main className="flex-1 w-full flex flex-col">
      <ScheduleHero />

      <ProcessMorph />

      <section className="w-full px-6 py-24 md:py-32 border-t border-foreground/10">
        <div className="max-w-7xl mx-auto">
          <SectionHead title="Ways to" muted="work together" note="Pick the shape that fits. Every option comes with a fixed price before any work starts." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {engagements.map((e, i) => (
              <article
                key={e.name}
                className={`flex flex-col gap-8 p-8 md:p-10 rounded-[2rem] border ${
                  i === 1 ? "bg-foreground text-background border-foreground" : "border-foreground/20 bg-background"
                }`}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className={`text-3xl md:text-4xl font-extrabold tracking-tight ${syne.className}`}>{e.name}</h3>
                  <span className="text-sm opacity-60">{e.length}</span>
                </div>
                <p className="leading-relaxed opacity-70">{e.text}</p>
                <ul className="flex flex-col gap-3 text-sm">
                  {e.includes.map((x) => (
                    <li key={x} className="flex items-center gap-3">
                      <span className={`w-1.5 h-1.5 rounded-full ${i === 1 ? "bg-background" : "bg-foreground"}`} />
                      {x}
                    </li>
                  ))}
                </ul>
                <p className={`mt-auto pt-6 border-t text-2xl font-bold ${i === 1 ? "border-background/20" : "border-foreground/10"} ${syne.className}`}>{e.price}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full px-6 py-24 md:py-32 border-t border-foreground/10">
        <div className="max-w-7xl mx-auto">
          <SectionHead title="Common" muted="questions" note="Still unsure about something? Ask it on the call. We answer plainly." />
          <Faq items={faqs} />
        </div>
      </section>

      <CallToAction title="Start with a 30-minute call" text="Tell us the problem. We'll tell you honestly whether we're the right team for it." />
    </main>
  );
}
