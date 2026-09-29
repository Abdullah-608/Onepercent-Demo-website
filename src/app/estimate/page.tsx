import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import EstimateForm from "@/components/estimate/EstimateForm";

export const metadata: Metadata = {
  title: "Get an Estimate",
  description: "Answer seven quick questions and see a price range and timeline for your project, then send it to us for a fixed quote.",
};

export default function EstimatePage() {
  return (
    <main className="flex-1 w-full flex flex-col">
      <PageHero
        lines={["Get an", "estimate"]}
        intro="Seven quick questions, a live price range and timeline as you answer. Send it over and we'll reply with a fixed quote within one working day."
      />
      <EstimateForm />
    </main>
  );
}
