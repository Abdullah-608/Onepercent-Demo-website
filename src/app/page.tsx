import Preloader from "@/components/Preloader";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Trusted from "@/components/Trusted";
import Services from "@/components/Services";
import Projects from "@/components/Projects";

export default function Home() {
  return (
    <main className="flex-1 w-full flex flex-col">
      <Preloader />
      <Hero />
      <Stats />
      <Trusted />
      <Services />
      <Projects />
    </main>
  );
}

