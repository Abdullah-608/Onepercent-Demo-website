"use client";
import { Blobatar } from "blobatar/react";
import { twMerge } from "tailwind-merge";

export default function Avatar({ name, className = "" }: { name: string; className?: string }) {
  return (
    <div className={twMerge("rounded-full overflow-hidden bg-foreground/10 border border-foreground/20 shrink-0", className)}>
      <Blobatar name={name} />
    </div>
  );
}
