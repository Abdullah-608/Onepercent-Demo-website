import { syne } from "@/lib/fonts";
import { BOOK_CALL_URL, CONTACT_EMAIL } from "@/lib/content";
import { buttonOutline, buttonPrimary } from "@/lib/ui";
import EstimateButton from "@/components/estimate/EstimateButton";

// Closing panel of the home page's project showcase. It points to the same two actions as
// the rest of the site rather than a separate contact form.
export default function Contact() {
  return (
    <section id="contact" className="relative w-full h-full flex items-center bg-background text-foreground">
      <div className="w-full max-w-7xl mx-auto px-6 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
        <div>
          <h2 className={`font-extrabold uppercase leading-[0.92] tracking-[-0.03em] text-[clamp(2.5rem,7vw,6rem)] ${syne.className}`}>
            Let&apos;s build
            <br />
            <span className="text-foreground/30">something great</span>
          </h2>
          <p className="mt-6 max-w-md text-foreground/60 leading-relaxed">
            Tell us about your project and we&apos;ll reply within one working day. Or write to{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-4">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <a href={BOOK_CALL_URL} className={`px-8 py-4 text-sm ${buttonPrimary}`}>
            Book a call
          </a>
          <EstimateButton className={`px-8 py-4 text-sm ${buttonOutline}`} />
        </div>
      </div>
    </section>
  );
}
