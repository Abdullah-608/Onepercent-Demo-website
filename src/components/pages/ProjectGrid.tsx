"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { syne } from "@/lib/fonts";
import { projects, stories } from "@/lib/content";
import ProjectPreview from "@/components/pages/ProjectPreview";
import { storySlug } from "@/lib/slug";

export default function ProjectGrid() {
  const types = useMemo(() => ["All", ...Array.from(new Set(projects.map((p) => p.type)))], []);
  const [filter, setFilter] = useState("All");
  const visible = projects.filter((p) => filter === "All" || p.type === filter);

  return (
    <section className="w-full px-6 pb-24 md:pb-32">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-2 mb-8 md:mb-10" role="group" aria-label="Filter projects by type">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              aria-pressed={filter === t}
              className={`px-4 py-2 rounded-full border text-sm transition-colors ${
                filter === t ? "bg-foreground text-background border-foreground" : "border-foreground/20 text-foreground/60 hover:text-foreground hover:border-foreground/50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visible.map((p, i) => {
            const story = stories.find((s) => s.project === p.title);
            const wide = filter === "All" && i === 0;
            return (
              <li
                key={p.title}
                className={`flex flex-col gap-8 p-4 pb-8 md:p-5 md:pb-10 rounded-[2rem] border border-foreground/20 ${wide ? "md:col-span-2" : ""}`}
              >
                <ProjectPreview type={p.type} className={`w-full ${wide ? "aspect-[16/10] md:aspect-[21/8]" : "aspect-[16/10]"}`} />

                <div className={`px-3 md:px-5 flex flex-col gap-6 ${wide ? "md:flex-row md:items-end md:justify-between md:gap-12" : ""}`}>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-baseline justify-between gap-4">
                      <h2 className={`text-3xl md:text-4xl font-extrabold tracking-tight ${syne.className}`}>{p.title}</h2>
                      <span className={`text-sm text-foreground/50 tabular-nums shrink-0 ${wide ? "md:hidden" : ""}`}>{p.year}</span>
                    </div>
                    <p className="max-w-lg leading-relaxed text-foreground/70">{p.text}</p>
                    <p className="text-sm text-foreground/50">
                      {p.type}, built with {p.tags.join(", ")}
                    </p>
                  </div>

                  {story ? (
                    <Link
                      href={`/stories#${storySlug(story.client)}`}
                      className={`group flex items-end justify-between gap-6 pt-6 border-t border-foreground/10 hover:opacity-70 transition-opacity ${
                        wide ? "md:border-t-0 md:pt-0 md:flex-col md:items-end md:text-right shrink-0" : ""
                      }`}
                    >
                      <span>
                        <span className={`block text-3xl md:text-4xl font-extrabold tracking-tight ${syne.className}`}>{story.metric}</span>
                        <span className="block mt-1 text-sm text-foreground/60 max-w-[16rem]">{story.metricLabel}</span>
                      </span>
                      <span className="text-sm font-semibold underline underline-offset-4 decoration-foreground/30 shrink-0">Read the story</span>
                    </Link>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
