import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Avatar from "@/components/Avatar";
import ClientVideo from "@/components/ClientVideo";
import SectionHead from "@/components/SectionHead";
import CallToAction from "@/components/CallToAction";
import { syne } from "@/lib/fonts";
import { stories, storiesReel } from "@/lib/content";
import { storySlug } from "@/lib/slug";

export const metadata: Metadata = {
  title: "Client Stories",
  description: "What changed for our clients after we shipped: the problem, what we built and the result, in their own words.",
};

export default function StoriesPage() {
  return (
    <main className="flex-1 w-full flex flex-col">
      <PageHero
        lines={["Results,", "not reviews"]}
       
        intro="Every story starts with a real problem and ends with a number. Here's what changed for the teams we worked with, told by them."
      />

      {/* Reel */}
      <section className="w-full px-6 pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto">
          <ClientVideo
            src={storiesReel.video}
            title={`${stories.length} clients in ${storiesReel.duration}`}
            person="One Percent reel"
            duration={storiesReel.duration}
            className="w-full aspect-[4/3] md:aspect-[21/9]"
          />
          <ul className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {stories.map((s) => (
              <li key={s.client} className="flex items-baseline gap-3 border-t border-foreground/10 pt-4">
                <span className={`text-2xl md:text-3xl font-extrabold tracking-tight ${syne.className}`}>{s.metric}</span>
                <span className="text-sm text-foreground/50 truncate">{s.client}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Stories */}
      <section className="w-full px-6 py-24 md:py-32 border-t border-foreground/10">
        <div className="max-w-7xl mx-auto">
          <SectionHead title="In their" muted="own words" note="Four teams, four problems. Watch the client explain it, then read what we built." />
          <div className="flex flex-col">
            {stories.map((s) => (
              <article
                key={s.client}
                id={storySlug(s.client)}
                aria-labelledby={`${storySlug(s.client)}-title`}
                className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 py-12 md:py-16 border-t border-foreground/15"
              >
                <ClientVideo
                  src={s.video}
                  title={`${s.person}, ${s.role}`}
                  person={s.person}
                  duration={s.duration}
                  className="lg:col-span-7 w-full aspect-video self-start"
                />

                <div className="lg:col-span-5 flex flex-col gap-8">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <h3 id={`${storySlug(s.client)}-title`} className={`text-2xl md:text-3xl font-bold tracking-tight ${syne.className}`}>
                        {s.client}
                      </h3>
                      <p className="mt-1 text-sm text-foreground/50">Project: {s.project}</p>
                    </div>
                    <p className={`shrink-0 font-extrabold tracking-[-0.03em] leading-none text-[clamp(2.5rem,5vw,4rem)] ${syne.className}`}>
                      {s.metric}
                    </p>
                  </div>
                  <p className="-mt-4 text-foreground/60 md:text-right">{s.metricLabel}</p>

                  <dl className="flex flex-col gap-5 border-t border-foreground/10 pt-6">
                    <div>
                      <dt className="text-sm font-semibold">The problem</dt>
                      <dd className="mt-1.5 text-foreground/60 leading-relaxed">{s.challenge}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-semibold">What we built</dt>
                      <dd className="mt-1.5 text-foreground/60 leading-relaxed">{s.solution}</dd>
                    </div>
                  </dl>

                  <figure className="mt-auto flex flex-col gap-4 border-t border-foreground/10 pt-6">
                    <blockquote className="text-lg leading-relaxed">&ldquo;{s.quote}&rdquo;</blockquote>
                    <figcaption className="flex items-center gap-3">
                      <Avatar name={s.person} className="w-9 h-9" />
                      <p className="text-sm">
                        <span className="font-semibold">{s.person}</span>
                        <span className="text-foreground/50">, {s.role}</span>
                      </p>
                    </figcaption>
                  </figure>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CallToAction title="Want a story like these?" />
    </main>
  );
}
