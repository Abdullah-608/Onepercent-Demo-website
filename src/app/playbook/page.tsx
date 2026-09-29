import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PlaybookList from "@/components/pages/PlaybookList";
import CallToAction from "@/components/CallToAction";
import { playbook } from "@/lib/content";

export const metadata: Metadata = {
  title: "Playbook",
  description: "The rules we build by: practical lessons on AI, automation, engineering and design.",
};

export default function PlaybookPage() {
  return (
    <main className="flex-1 w-full flex flex-col">
      <PageHero lines={["The rules", "we build by"]} intro="What we've learned from shipping AI products, automations and platforms, written down so you can use it too. Open any chapter for the short version.">
        <p className="text-sm text-foreground/50 tabular-nums">{playbook.length} chapters</p>
      </PageHero>
      <PlaybookList />
      <CallToAction title="Want us to run the playbook for you?" />
    </main>
  );
}
