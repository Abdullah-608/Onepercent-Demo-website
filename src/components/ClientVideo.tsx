"use client";
import { useState } from "react";
import { Play } from "lucide-react";
import Avatar from "@/components/Avatar";

type Props = {
  // Path under /public; without one the card renders as a placeholder
  src?: string;
  poster?: string;
  title: string;
  person: string;
  duration: string;
  className?: string;
};

// A client video that loads only when played. With no src yet, it keeps the same frame and
// shows who the video will feature, so the layout is final before the footage arrives.
export default function ClientVideo({ src, poster, title, person, duration, className = "" }: Props) {
  const [playing, setPlaying] = useState(false);

  if (src && playing) {
    return (
      <div className={`relative overflow-hidden rounded-[1.75rem] bg-foreground ${className}`}>
        <video src={src} poster={poster} controls autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => src && setPlaying(true)}
      disabled={!src}
      aria-label={src ? `Play video: ${title}` : `${title}, video coming soon`}
      className={`group relative overflow-hidden rounded-[1.75rem] border border-foreground/15 bg-foreground/[0.04] text-left disabled:cursor-default ${className}`}
    >
      {poster ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={poster} alt="" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div aria-hidden className="absolute inset-0 flex items-center justify-center">
          <Avatar name={person} className="w-[38%] aspect-square opacity-[0.12] border-0 bg-transparent" />
        </div>
      )}

      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-foreground text-background transition-transform duration-300 group-enabled:group-hover:scale-110">
          <Play className="w-6 h-6 md:w-7 md:h-7 translate-x-[2px] fill-current" />
        </span>
      </span>

      <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-6 text-sm">
        <span className="min-w-0 truncate font-semibold">{title}</span>
        <span className="shrink-0 tabular-nums text-foreground/60">{src ? duration : "Coming soon"}</span>
      </span>
    </button>
  );
}
