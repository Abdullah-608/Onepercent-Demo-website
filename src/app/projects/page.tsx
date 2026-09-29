import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ProjectGrid from "@/components/pages/ProjectGrid";
import CallToAction from "@/components/CallToAction";
import { projects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description: "AI products, automations, agents and web platforms we've designed and shipped.",
};

export default function ProjectsPage() {
  return (
    <main className="flex-1 w-full flex flex-col">
      <PageHero lines={["Selected", "work"]} intro="AI products, automations and platforms built for teams who needed them to work on day one, and keep working after.">
        <p className="text-sm text-foreground/50 tabular-nums">{projects.length} projects, 2024 to 2026</p>
      </PageHero>
      <ProjectGrid />
      <CallToAction title="Your project could be next" />
    </main>
  );
}
