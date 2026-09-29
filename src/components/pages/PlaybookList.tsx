"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { syne } from "@/lib/fonts";
import { playbook, playbookCategories, type PlaybookCategory } from "@/lib/content";

export default function PlaybookList() {
  const [filter, setFilter] = useState<PlaybookCategory>("All");
  const [open, setOpen] = useState<string | null>(null);

  const entries = playbook.filter((e) => filter === "All" || e.category === filter);
  const count = (c: PlaybookCategory) => (c === "All" ? playbook.length : playbook.filter((e) => e.category === c).length);

  return (
    <section className="w-full px-6 pb-24 md:pb-32">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8">
        <nav className="lg:col-span-3 lg:sticky lg:top-32 self-start" aria-label="Playbook categories">
          <ul className="flex lg:flex-col flex-wrap gap-2 lg:gap-1">
            {playbookCategories.map((c) => (
              <li key={c}>
                <button
                  onClick={() => setFilter(c)}
                  aria-pressed={filter === c}
                  className={`flex items-center gap-3 lg:w-full px-4 py-2 lg:px-0 lg:py-2 rounded-full lg:rounded-none border lg:border-0 text-sm lg:text-2xl lg:font-bold transition-[color,opacity] ${syne.className} ${
                    filter === c ? "border-foreground bg-foreground text-background lg:bg-transparent lg:text-foreground" : "border-foreground/20 text-foreground/50 hover:text-foreground"
                  }`}
                >
                  {c}
                  <span className="text-xs lg:text-sm font-normal opacity-60 tabular-nums">{count(c)}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="lg:col-span-9 border-t border-foreground/10">
          {entries.map((e) => {
            const isOpen = open === e.title;
            const id = `play-${e.title.replace(/\W+/g, "-").toLowerCase()}`;
            return (
              <li key={e.title} className="border-b border-foreground/10">
                <button
                  onClick={() => setOpen(isOpen ? null : e.title)}
                  aria-expanded={isOpen}
                  aria-controls={id}
                  className="group w-full text-left py-8 md:py-10 grid grid-cols-[1fr_auto] gap-x-6 gap-y-3"
                >
                  <span className="flex gap-3 text-sm text-foreground/50">
                    <span>{e.category}</span>
                    <span aria-hidden>/</span>
                    <span>{e.read} read</span>
                  </span>
                  <Plus className={`row-span-2 self-center w-6 h-6 md:w-8 md:h-8 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} />
                  <span className={`text-2xl md:text-4xl font-bold tracking-[-0.02em] leading-tight group-hover:opacity-70 transition-opacity ${syne.className}`}>{e.title}</span>
                </button>
                <div id={id} className={`grid transition-[grid-template-rows] duration-500 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden">
                    <div className="pb-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                      <p className="text-base md:text-lg leading-relaxed text-foreground/70 max-w-lg">{e.summary}</p>
                      <ol className="flex flex-col gap-4">
                        {e.points.map((pt, i) => (
                          <li key={pt} className="flex gap-4 leading-relaxed">
                            <span className={`shrink-0 w-7 h-7 rounded-full border border-foreground/30 flex items-center justify-center text-xs font-bold tabular-nums ${syne.className}`}>{i + 1}</span>
                            <span className="text-foreground/80">{pt}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
