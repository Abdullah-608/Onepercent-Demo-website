"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { syne } from "@/lib/fonts";
import { processSteps } from "@/lib/content";

// A typical 10-week build drawn as a schedule. On load a playhead runs from day one to
// launch, filling each phase and each weekly demo as it passes, so the whole project is
// visible before you've read a word of it.

const WEEKS = 10;

// Where each process step sits on the schedule, in weeks
const spans = [
  { start: 0, end: 0.2 },
  { start: 0.2, end: 0.7 },
  { start: 0.7, end: 2.6 },
  { start: 2, end: 8.4, demos: [3, 4, 5, 6, 7, 8] },
  { start: 8.4, end: 9.3 },
  { start: 9.3, end: WEEKS, open: true },
];

export default function ScheduleHero() {
  const root = useRef<HTMLElement>(null);
  const week = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const set = (p: number) => {
        el.style.setProperty("--p", String(p));
        if (week.current) week.current.textContent = p >= 9.3 ? "Live" : `Week ${Math.min(Math.floor(p) + 1, WEEKS)}`;
      };
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const state = { p: 0 };
        set(0);
        gsap.from("[data-fade]", { opacity: 0, y: 20, duration: 0.9, ease: "power3.out", stagger: 0.08 });
        gsap.to(state, { p: WEEKS, duration: 4.2, delay: 0.5, ease: "power1.inOut", onUpdate: () => set(state.p) });
      });
      mm.add("(prefers-reduced-motion: reduce)", () => set(WEEKS));
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      aria-labelledby="hww-title"
      className="relative w-full bg-background text-foreground px-6 pt-36 md:pt-44 pb-24 md:pb-32"
      style={{ "--p": WEEKS } as React.CSSProperties}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14 md:mb-20">
          <h1
            id="hww-title"
            data-fade
            className={`font-extrabold leading-[0.92] tracking-[-0.03em] text-[clamp(2.5rem,7vw,6.5rem)] ${syne.className}`}
          >
            Watch it
            <br />
            <em className="opacity-60">get built</em>
          </h1>
          <p data-fade className="max-w-md text-base md:text-lg leading-relaxed text-foreground/60">
            Fixed scope, a demo on a live URL every week and one senior team from the first call to launch. This is how a
            typical ten-week build runs.
          </p>
        </div>

        <figure data-fade aria-label="A typical ten-week project schedule" className="relative">
          {/* Week ruler */}
          <div className="grid grid-cols-[1fr] md:grid-cols-[13rem_1fr] text-xs text-foreground/40 tabular-nums">
            <span className="hidden md:block" />
            <div className="grid" style={{ gridTemplateColumns: `repeat(${WEEKS}, minmax(0, 1fr))` }}>
              {Array.from({ length: WEEKS }, (_, i) => (
                <span key={i} className="pb-3 pl-1.5 border-l border-foreground/10">
                  <span className="hidden sm:inline">Wk </span>
                  {i + 1}
                </span>
              ))}
            </div>
          </div>

          <ol className="relative border-t border-foreground/15">
            {processSteps.map((step, i) => {
              const s = spans[i];
              const left = (s.start / WEEKS) * 100;
              const width = ((s.end - s.start) / WEEKS) * 100;
              const len = s.end - s.start;
              return (
                <li
                  key={step.title}
                  className="grid grid-cols-[1fr] md:grid-cols-[13rem_1fr] items-center border-b border-foreground/10 py-3 md:py-0"
                >
                  <span
                    className="text-sm md:pr-6 md:py-4 mb-2 md:mb-0 transition-opacity"
                    style={{ opacity: `clamp(0.4, calc((var(--p) - ${s.start}) * 4 + 0.4), 1)` }}
                  >
                    {step.title}
                  </span>
                  <div className="relative h-7 md:h-8">
                    {/* Scheduled span */}
                    <div
                      className={`absolute inset-y-0 rounded-full border border-foreground/25 ${s.open ? "border-r-0 rounded-r-none" : ""}`}
                      style={{ left: `${left}%`, width: `${width}%`, minWidth: "0.5rem" }}
                    >
                      {/* Completed portion */}
                      <div
                        className={`absolute inset-y-[-1px] left-[-1px] bg-foreground ${s.open ? "rounded-l-full" : "rounded-full"}`}
                        style={{ width: `clamp(0%, calc((var(--p) - ${s.start}) / ${len} * 100% + 2px), calc(100% + 2px))`, minWidth: 0 }}
                      />
                    </div>
                    {s.demos?.map((d) => (
                      <span
                        key={d}
                        title={`Demo, end of week ${d}`}
                        className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-background"
                        style={{ left: `${(d / WEEKS) * 100}%`, opacity: `clamp(0, calc((var(--p) - ${d}) * 6), 1)` }}
                      />
                    ))}
                  </div>
                </li>
              );
            })}

            {/* Playhead */}
            <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 right-0 md:left-[13rem]">
              <div
                className="absolute -top-9 bottom-0 w-px bg-foreground"
                style={{ left: `calc(var(--p) / ${WEEKS} * 100%)` }}
              >
                <span
                  ref={week}
                  className="absolute top-0 whitespace-nowrap rounded-full bg-foreground text-background text-xs font-semibold px-2.5 py-1 tabular-nums"
                  style={{ transform: `translateX(calc(var(--p) / ${WEEKS} * -100%))` }}
                >
                  Live
                </span>
              </div>
            </div>
          </ol>

          <figcaption className="mt-5 flex items-center gap-2 text-xs text-foreground/50">
            <span className="inline-block w-2 h-2 rounded-full border border-foreground/60" />
            Each dot is a Friday demo on a live preview URL.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
