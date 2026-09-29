"use client";
import { useEffect, useRef, useState } from "react";
import type Lenis from "lenis";
import { ArrowLeft, Check, X } from "lucide-react";
import { syne } from "@/lib/fonts";
import { CONTACT_EMAIL } from "@/lib/content";
import {
  SCREENS,
  aiFeatures,
  designOptions,
  estimate,
  integrations,
  money,
  platforms,
  projectTypes,
  timelines,
  type Answers,
  type Option,
} from "@/lib/estimate";

type Props = {
  open: boolean;
  onClose: () => void;
  answers: Answers;
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
  step: number;
  setStep: (s: number) => void;
  onReset: () => void;
};

type Step = { title: string; note: string; valid: (a: Answers) => boolean };

const steps: Step[] = [
  { title: "What are we building?", note: "Pick the one that fits best.", valid: (a) => !!a.type },
  { title: "Where will it run?", note: "Choose everything that applies.", valid: (a) => a.platforms.length > 0 },
  { title: "How many screens?", note: "A screen is one distinct page or view, like a dashboard, settings or checkout.", valid: () => true },
  { title: "Do you need design?", note: "Designing each screen costs more than building from finished designs.", valid: (a) => !!a.design },
  { title: "What does it connect to?", note: "Choose any that apply, or skip this step.", valid: () => true },
  { title: "Any AI features?", note: "Choose any that apply, or skip this step.", valid: () => true },
  { title: "How soon do you need it?", note: "Rush adds people to the project, not hours to anyone's week.", valid: (a) => !!a.timeline },
  { title: "Where should we send it?", note: "We'll review the scope and reply within one working day with a fixed quote.", valid: () => true },
];

const lenis = () => (window as unknown as { lenis?: Lenis }).lenis;

export default function EstimateDrawer({ open, onClose, answers, setAnswers, step, setStep, onReset }: Props) {
  const panel = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const [sent, setSent] = useState(false);
  const result = estimate(answers);
  const current = steps[step];
  const last = step === steps.length - 1;

  // Page scroll pauses while the drawer is open; focus moves in and returns to the trigger
  useEffect(() => {
    if (!open) return;
    const trigger = document.activeElement as HTMLElement | null;
    lenis()?.stop();
    document.documentElement.style.overflow = "hidden";
    heading.current?.focus();
    return () => {
      lenis()?.start();
      document.documentElement.style.overflow = "";
      trigger?.focus();
    };
  }, [open]);

  // Each new step starts at its question
  useEffect(() => {
    if (open) heading.current?.focus();
  }, [step, open]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") return onClose();
    if (e.key !== "Tab" || !panel.current) return;
    const items = panel.current.querySelectorAll<HTMLElement>("button:not(:disabled), input, textarea, a[href]");
    const first = items[0];
    const lastItem = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      lastItem.focus();
    } else if (!e.shiftKey && document.activeElement === lastItem) {
      e.preventDefault();
      first.focus();
    }
  };

  const pick = (key: "type" | "design" | "timeline", id: string) => setAnswers((a) => ({ ...a, [key]: id }));
  const toggle = (key: "platforms" | "integrations" | "ai", id: string) =>
    setAnswers((a) => ({ ...a, [key]: a[key].includes(id) ? a[key].filter((x) => x !== id) : [...a[key], id] }));

  const labels = (list: Option[], ids: string[]) => ids.map((id) => list.find((o) => o.id === id)?.label).filter(Boolean).join(", ") || "None";
  const label = (list: Option[], id: string | null) => list.find((o) => o.id === id)?.label ?? "Not chosen";

  const summary: [string, string][] = [
    ["Project", label(projectTypes, answers.type)],
    ["Platforms", labels(platforms, answers.platforms)],
    ["Screens", answers.screens >= SCREENS.max ? `${SCREENS.max}+` : String(answers.screens)],
    ["Design", label(designOptions, answers.design)],
    ["Integrations", labels(integrations, answers.integrations)],
    ["AI", labels(aiFeatures, answers.ai)],
    ["Timeline", label(timelines, answers.timeline)],
  ];

  const send = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const range = result ? `${money(result.low)} to ${money(result.high)}, ${result.weeksLow} to ${result.weeksHigh} weeks` : "";
    const body = [
      `Name: ${f.get("name")}`,
      `Email: ${f.get("email")}`,
      f.get("company") ? `Company: ${f.get("company")}` : "",
      "",
      ...summary.map(([k, v]) => `${k}: ${v}`),
      `Estimate: ${range}`,
      "",
      String(f.get("notes") ?? ""),
    ]
      .filter((l, i, all) => l !== "" || all[i - 1] !== "")
      .join("\n");
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Project estimate: ${range}`)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const startOver = () => {
    setSent(false);
    onReset();
  };

  return (
    <div className={`fixed inset-0 z-[60] transition-[visibility] duration-500 ${open ? "visible" : "invisible pointer-events-none"}`} aria-hidden={!open}>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-foreground/30 backdrop-blur-sm transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0"}`}
      />

      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="estimate-question"
        onKeyDown={onKeyDown}
        className={`absolute inset-y-0 right-0 w-full sm:max-w-xl bg-background text-foreground sm:border-l border-foreground/15 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="px-6 sm:px-8 pt-6 pb-5 border-b border-foreground/10">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-semibold">Get an estimate</p>
            <button
              onClick={onClose}
              aria-label="Close estimate"
              className="w-10 h-10 -mr-2 rounded-full flex items-center justify-center hover:bg-foreground/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {!sent && (
            <div className="mt-4 flex items-center gap-3">
              <div className="flex-1 grid gap-1" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
                {steps.map((s, i) => (
                  <span key={s.title} className={`h-1 rounded-full transition-colors duration-300 ${i <= step ? "bg-foreground" : "bg-foreground/15"}`} />
                ))}
              </div>
              <span className="text-xs text-foreground/50 tabular-nums shrink-0">
                Step {step + 1} of {steps.length}
              </span>
            </div>
          )}
        </div>

        {/* Question */}
        <div data-lenis-prevent className="flex-1 overflow-y-auto overscroll-contain px-6 sm:px-8 py-8">
          {sent ? (
            <div className="flex flex-col gap-6">
              <h2 ref={heading} id="estimate-question" tabIndex={-1} className={`text-3xl sm:text-4xl font-bold tracking-tight outline-none ${syne.className}`}>
                Your email is ready to send
              </h2>
              <p className="text-foreground/60 leading-relaxed">
                Your email app opened with the full scope and estimate filled in. Send it and we&apos;ll reply within one working day with a fixed
                quote. If nothing opened, write to{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-4">
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
              <button
                onClick={startOver}
                className="self-start text-sm font-semibold underline underline-offset-4 decoration-foreground/30 hover:opacity-70"
              >
                Start a new estimate
              </button>
            </div>
          ) : (
            <div key={step} className="animate-[projectIn_0.5s_cubic-bezier(0.22,1,0.36,1)_both]">
              <h2
                ref={heading}
                id="estimate-question"
                tabIndex={-1}
                className={`text-3xl sm:text-4xl font-bold leading-[1.05] tracking-tight outline-none ${syne.className}`}
              >
                {current.title}
              </h2>
              <p className="mt-3 text-foreground/60 leading-relaxed">{current.note}</p>

              <div className="mt-8">
                {step === 0 && <Choices options={projectTypes} selected={[answers.type]} onSelect={(id) => pick("type", id)} />}
                {step === 1 && <Choices multi options={platforms} selected={answers.platforms} onSelect={(id) => toggle("platforms", id)} />}
                {step === 2 && (
                  <div className="flex flex-col gap-6">
                    <p className={`text-7xl font-extrabold tracking-tight tabular-nums ${syne.className}`}>
                      {answers.screens}
                      {answers.screens >= SCREENS.max ? "+" : ""}
                    </p>
                    <input
                      type="range"
                      min={SCREENS.min}
                      max={SCREENS.max}
                      value={answers.screens}
                      onChange={(e) => setAnswers((a) => ({ ...a, screens: Number(e.target.value) }))}
                      aria-label="Number of screens"
                      className="w-full accent-foreground"
                    />
                    <div className="flex justify-between text-xs text-foreground/50 tabular-nums">
                      <span>{SCREENS.min}, a landing page and a form</span>
                      <span>{SCREENS.max}+, a full platform</span>
                    </div>
                  </div>
                )}
                {step === 3 && (
                  <Choices options={designOptions} selected={[answers.design]} onSelect={(id) => pick("design", id)} priceSuffix=" per screen" />
                )}
                {step === 4 && <Choices multi columns options={integrations} selected={answers.integrations} onSelect={(id) => toggle("integrations", id)} />}
                {step === 5 && <Choices multi options={aiFeatures} selected={answers.ai} onSelect={(id) => toggle("ai", id)} />}
                {step === 6 && <Choices options={timelines} selected={[answers.timeline]} onSelect={(id) => pick("timeline", id)} />}
                {step === 7 && (
                  <form id="estimate-form" onSubmit={send} className="flex flex-col gap-8">
                    <dl className="flex flex-col border-t border-foreground/10 text-sm">
                      {summary.map(([k, v], i) => (
                        <div key={k} className="flex justify-between gap-6 py-3 border-b border-foreground/10">
                          <dt className="text-foreground/50">{k}</dt>
                          <dd className="text-right">
                            <button type="button" onClick={() => setStep(i)} className="text-right hover:underline underline-offset-4">
                              {v}
                            </button>
                          </dd>
                        </div>
                      ))}
                    </dl>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field name="name" label="Name" required autoComplete="name" />
                      <Field name="email" label="Email" type="email" required autoComplete="email" />
                      <Field name="company" label="Company (optional)" autoComplete="organization" className="sm:col-span-2" />
                      <label className="sm:col-span-2 flex flex-col gap-2 text-sm">
                        Anything else we should know? (optional)
                        <textarea
                          name="notes"
                          rows={3}
                          className="rounded-2xl border border-foreground/20 bg-transparent px-4 py-3 text-base focus:outline-none focus:border-foreground"
                        />
                      </label>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Live estimate and navigation */}
        {!sent && (
          <div className="border-t border-foreground/10 px-6 sm:px-8 py-5 flex items-center justify-between gap-4">
            <div aria-live="polite" className="min-w-0">
              {result ? (
                <>
                  <p className={`text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums ${syne.className}`}>
                    {money(result.low)} to {money(result.high)}
                  </p>
                  <p className="text-xs text-foreground/50">
                    About {result.weeksLow} to {result.weeksHigh} weeks
                  </p>
                </>
              ) : (
                <p className="text-sm text-foreground/50">Your estimate appears here as you answer.</p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {step > 0 && (
                <button
                  onClick={() => setStep(step - 1)}
                  aria-label="Previous step"
                  className="w-12 h-12 rounded-full border border-foreground/20 flex items-center justify-center hover:border-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              {last ? (
                <button
                  type="submit"
                  form="estimate-form"
                  className="h-12 px-6 rounded-full bg-foreground text-background text-sm font-semibold hover:opacity-80 transition-opacity"
                >
                  Send my estimate
                </button>
              ) : (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={!current.valid(answers)}
                  className="h-12 px-6 rounded-full bg-foreground text-background text-sm font-semibold hover:opacity-80 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Choices({
  options,
  selected,
  onSelect,
  multi = false,
  columns = false,
  priceSuffix = "",
}: {
  options: Option[];
  selected: (string | null)[];
  onSelect: (id: string) => void;
  multi?: boolean;
  columns?: boolean;
  priceSuffix?: string;
}) {
  return (
    <div role="group" className={`grid gap-2 ${columns ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
      {options.map((o) => {
        const on = selected.includes(o.id);
        return (
          <button
            key={o.id}
            type="button"
            role={multi ? "checkbox" : "radio"}
            aria-checked={on}
            onClick={() => onSelect(o.id)}
            className={`flex items-start gap-4 rounded-2xl border px-5 py-4 text-left transition-colors ${
              on ? "border-foreground bg-foreground text-background" : "border-foreground/20 hover:border-foreground/50"
            }`}
          >
            <span
              aria-hidden
              className={`mt-0.5 w-5 h-5 shrink-0 flex items-center justify-center border ${multi ? "rounded-md" : "rounded-full"} ${
                on ? "border-background bg-background text-foreground" : "border-foreground/30"
              }`}
            >
              {on && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
            </span>
            <span className="flex-1 min-w-0">
              <span className="flex items-baseline justify-between gap-3">
                <span className="font-semibold">{o.label}</span>
                {o.price ? (
                  <span className={`text-xs tabular-nums shrink-0 ${on ? "text-background/60" : "text-foreground/50"}`}>
                    +{money(o.price)}
                    {priceSuffix}
                  </span>
                ) : null}
              </span>
              <span className={`block mt-0.5 text-sm ${on ? "text-background/70" : "text-foreground/60"}`}>{o.hint}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function Field({ label, className = "", ...props }: { label: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`flex flex-col gap-2 text-sm ${className}`}>
      {label}
      <input
        {...props}
        className="rounded-full border border-foreground/20 bg-transparent px-4 py-3 text-base focus:outline-none focus:border-foreground"
      />
    </label>
  );
}
