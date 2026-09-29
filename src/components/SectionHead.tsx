import { syne } from "@/lib/fonts";

// Shared section opener: a two-line heading with a muted second line, and a short note
export default function SectionHead({ title, muted, note }: { title: string; muted: string; note: string }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
      <h2 className={`font-bold leading-[0.95] tracking-[-0.03em] text-[clamp(2rem,4vw,3.5rem)] ${syne.className}`}>
        {title}
        <br />
        <em className="opacity-60">{muted}</em>
      </h2>
      <p className="max-w-sm text-foreground/60 leading-relaxed">{note}</p>
    </div>
  );
}
