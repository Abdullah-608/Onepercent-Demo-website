import { syne } from "@/lib/fonts";
import { BOOK_CALL_URL } from "@/lib/content";
import EstimateButton from "@/components/estimate/EstimateButton";

// Inverted section, so buttons and focus rings use the background colour
const button = "px-8 py-4 rounded-full text-sm font-semibold uppercase tracking-wide text-center focus-visible:outline-background";

export default function CallToAction({ title = "Have something in mind?", text = "Tell us what you're building. We reply within one working day." }: { title?: string; text?: string }) {
  return (
    <section className="w-full bg-foreground text-background px-6 py-24 md:py-32">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
        <div>
          <h2 className={`font-extrabold uppercase leading-[0.92] tracking-[-0.03em] text-[clamp(1.875rem,6.5vw,6rem)] max-w-4xl ${syne.className}`}>{title}</h2>
          <p className="mt-6 max-w-md text-base md:text-lg text-background/60 leading-relaxed">{text}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <a href={BOOK_CALL_URL} className={`${button} bg-background text-foreground hover:opacity-80 transition-opacity`}>
            Book a call
          </a>
          <EstimateButton className={`${button} border border-background/30 hover:bg-background hover:text-foreground transition-colors`} />
        </div>
      </div>
    </section>
  );
}
