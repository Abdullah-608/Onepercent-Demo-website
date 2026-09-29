"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { syne } from "@/lib/fonts";

export default function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <ul className="border-t border-foreground/10">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <li key={item.q} className="border-b border-foreground/10">
            <h3>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={`faq-${i}`}
                className={`w-full flex items-center justify-between gap-6 py-6 text-left text-lg md:text-2xl font-bold tracking-tight hover:opacity-70 transition-opacity ${syne.className}`}
              >
                {item.q}
                <Plus className={`w-6 h-6 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} />
              </button>
            </h3>
            <div
              id={`faq-${i}`}
              className={`grid transition-[grid-template-rows] duration-500 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden">
                <p className="pb-6 max-w-2xl text-base leading-relaxed text-foreground/60">{item.a}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
