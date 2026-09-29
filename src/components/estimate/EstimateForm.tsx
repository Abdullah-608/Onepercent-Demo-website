"use client";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { syne } from "@/lib/fonts";
import { CONTACT_EMAIL } from "@/lib/content";
import { buttonPrimary } from "@/lib/ui";
import {
  SCREENS,
  aiFeatures,
  designOptions,
  estimate,
  initialAnswers,
  integrations,
  money,
  platforms,
  projectTypes,
  timelines,
  type Answers,
  type Option,
} from "@/lib/estimate";

const DRAFT_KEY = "estimate-draft";

const screenPresets = [
  { label: "Landing page", value: 6 },
  { label: "Small app", value: 15 },
  { label: "Full product", value: 40 },
  { label: "Platform", value: 90 },
];

export default function EstimateForm() {
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [sent, setSent] = useState(false);
  const result = estimate(answers);

  // Keep a draft in this browser so a reload doesn't lose the answers
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restoring from storage after hydration
      if (saved) setAnswers({ ...initialAnswers, ...JSON.parse(saved) });
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(answers));
    } catch {}
  }, [answers]);

  const pick = (key: "type" | "design" | "timeline", id: string) => setAnswers((a) => ({ ...a, [key]: id }));
  const toggle = (key: "platforms" | "integrations" | "ai", id: string) =>
    setAnswers((a) => ({ ...a, [key]: a[key].includes(id) ? a[key].filter((x) => x !== id) : [...a[key], id] }));

  const label = (list: Option[], id: string | null) => list.find((o) => o.id === id)?.label;
  const labels = (list: Option[], ids: string[]) => ids.map((id) => label(list, id)).filter(Boolean).join(", ");
  const screens = answers.screens >= SCREENS.max ? `${SCREENS.max}+` : String(answers.screens);

  const summary: { key: string; value: string | undefined }[] = [
    { key: "Project", value: label(projectTypes, answers.type) },
    { key: "Platforms", value: labels(platforms, answers.platforms) },
    { key: "Screens", value: screens },
    { key: "Design", value: label(designOptions, answers.design) },
    { key: "Integrations", value: labels(integrations, answers.integrations) || "None" },
    { key: "AI", value: labels(aiFeatures, answers.ai) || "None" },
    { key: "Timeline", value: label(timelines, answers.timeline) },
  ];
  const range = result ? `${money(result.low)} to ${money(result.high)}` : null;
  const weeks = result ? `About ${result.weeksLow} to ${result.weeksHigh} weeks` : null;
  const ready = !!answers.type && answers.platforms.length > 0 && !!answers.design;

  const send = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = [
      `Name: ${f.get("name")}`,
      `Email: ${f.get("email")}`,
      f.get("company") ? `Company: ${f.get("company")}` : null,
      "",
      ...summary.map((s) => `${s.key}: ${s.value ?? "Not chosen"}`),
      `Estimate: ${range}, ${weeks?.toLowerCase()}`,
      f.get("notes") ? `\n${f.get("notes")}` : null,
    ]
      .filter((l) => l !== null)
      .join("\n");
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Project estimate: ${range}`)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <section className="w-full px-6 pb-32 lg:pb-32">
      <form onSubmit={send} className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        <ol className="lg:col-span-7 flex flex-col">
          <Question n={1} title="What are we building?" note="Pick the one that fits best.">
            <Choices options={projectTypes} selected={[answers.type]} onSelect={(id) => pick("type", id)} cols={3} />
          </Question>

          <Question n={2} title="Where will it run?" note="Choose everything that applies.">
            <Choices multi options={platforms} selected={answers.platforms} onSelect={(id) => toggle("platforms", id)} cols={3} />
          </Question>

          <Question n={3} title="How many screens?" note="A screen is one distinct page or view, like a dashboard, settings or checkout.">
            <div className="flex flex-col gap-6">
              <p className={`text-6xl md:text-7xl font-extrabold tracking-tight tabular-nums ${syne.className}`}>{screens}</p>
              <input
                type="range"
                min={SCREENS.min}
                max={SCREENS.max}
                value={answers.screens}
                onChange={(e) => setAnswers((a) => ({ ...a, screens: Number(e.target.value) }))}
                aria-label="Number of screens"
                className="w-full accent-foreground"
              />
              <div className="flex flex-wrap gap-2">
                {screenPresets.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setAnswers((a) => ({ ...a, screens: p.value }))}
                    aria-pressed={answers.screens === p.value}
                    className={`px-4 py-2 rounded-full border text-sm transition-colors ${
                      answers.screens === p.value ? "border-foreground" : "border-foreground/20 text-foreground/60 hover:text-foreground"
                    }`}
                  >
                    {p.label}, {p.value}
                  </button>
                ))}
              </div>
            </div>
          </Question>

          <Question n={4} title="Do you need design?" note="Designing each screen costs more than building from finished designs.">
            <Choices options={designOptions} selected={[answers.design]} onSelect={(id) => pick("design", id)} cols={2} priceSuffix=" per screen" />
          </Question>

          <Question n={5} title="What does it connect to?" note="Choose any that apply, or skip this one.">
            <Choices multi options={integrations} selected={answers.integrations} onSelect={(id) => toggle("integrations", id)} cols={2} />
          </Question>

          <Question n={6} title="Any AI features?" note="Choose any that apply, or skip this one.">
            <Choices multi options={aiFeatures} selected={answers.ai} onSelect={(id) => toggle("ai", id)} cols={2} />
          </Question>

          <Question n={7} title="How soon do you need it?" note="Rush adds people to the project, not hours to anyone's week.">
            <Choices options={timelines} selected={[answers.timeline]} onSelect={(id) => pick("timeline", id)} cols={2} />
          </Question>

          <Question n={8} title="Where should we send it?" note="We review every estimate and reply within one working day with a fixed quote.">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field name="name" label="Name" required autoComplete="name" />
              <Field name="email" label="Email" type="email" required autoComplete="email" />
              <Field name="company" label="Company (optional)" autoComplete="organization" className="sm:col-span-2" />
              <label className="sm:col-span-2 flex flex-col gap-2 text-sm">
                Anything else we should know? (optional)
                <textarea
                  name="notes"
                  rows={4}
                  className="rounded-2xl border border-foreground/20 bg-transparent px-4 py-3 text-base focus:outline-none focus:border-foreground transition-colors"
                />
              </label>
            </div>
          </Question>
        </ol>

        {/* Live estimate */}
        <aside id="estimate-summary" className="lg:col-span-5 scroll-mt-28">
          <div className="lg:sticky lg:top-28 rounded-[2rem] border border-foreground/20 p-6 md:p-8 flex flex-col gap-8">
            <div>
              <p className="text-sm text-foreground/50">Your estimate</p>
              <p aria-live="polite" className={`mt-2 text-4xl md:text-5xl font-extrabold tracking-tight tabular-nums ${syne.className}`}>
                {range ?? "Start with question 1"}
              </p>
              {weeks && <p className="mt-2 text-foreground/60">{weeks}</p>}
            </div>

            <dl className="flex flex-col border-t border-foreground/10 text-sm">
              {summary.map((s) => (
                <div key={s.key} className="flex justify-between gap-6 py-3 border-b border-foreground/10">
                  <dt className="text-foreground/50">{s.key}</dt>
                  <dd className={`text-right ${s.value ? "" : "text-foreground/30"}`}>{s.value || "Not chosen"}</dd>
                </div>
              ))}
            </dl>

            {sent ? (
              <p className="text-sm leading-relaxed text-foreground/70">
                Your email app opened with this estimate filled in. Send it and we&apos;ll reply within one working day. If nothing opened, write to{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-4">
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                <button type="submit" disabled={!ready} className={`w-full py-4 text-sm disabled:opacity-30 disabled:cursor-not-allowed ${buttonPrimary}`}>
                  Send my estimate
                </button>
                <p className="text-xs text-foreground/50 leading-relaxed">
                  {ready ? "Opens your email app with the full scope filled in." : "Answer questions 1, 2 and 4 to send your estimate."}
                </p>
              </div>
            )}
          </div>
        </aside>
      </form>

      {/* Running total on small screens, where the summary sits below the questions */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 border-t border-foreground/15 bg-background px-6 py-4 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className={`text-xl font-extrabold tracking-tight tabular-nums truncate ${syne.className}`}>{range ?? "No estimate yet"}</p>
          {weeks && <p className="text-xs text-foreground/50">{weeks}</p>}
        </div>
        <a href="#estimate-summary" className="text-sm font-semibold underline underline-offset-4 shrink-0">
          Review
        </a>
      </div>
    </section>
  );
}

function Question({ n, title, note, children }: { n: number; title: string; note: string; children: React.ReactNode }) {
  return (
    <li className="grid grid-cols-[2.5rem_1fr] md:grid-cols-[3.5rem_1fr] gap-x-4 py-10 md:py-12 border-t border-foreground/15 first:border-t-0 first:pt-0">
      <span className={`text-sm md:text-base font-bold tabular-nums text-foreground/40 pt-1.5 md:pt-2 ${syne.className}`}>{String(n).padStart(2, "0")}</span>
      <div className="min-w-0">
        <h2 className={`text-2xl md:text-3xl font-bold tracking-tight ${syne.className}`}>{title}</h2>
        <p className="mt-2 text-foreground/60 leading-relaxed">{note}</p>
        <div className="mt-6 md:mt-8">{children}</div>
      </div>
    </li>
  );
}

function Choices({
  options,
  selected,
  onSelect,
  multi = false,
  cols,
  priceSuffix = "",
}: {
  options: Option[];
  selected: (string | null)[];
  onSelect: (id: string) => void;
  multi?: boolean;
  cols: 2 | 3;
  priceSuffix?: string;
}) {
  return (
    <div role="group" className={`grid grid-cols-1 gap-3 ${cols === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
      {options.map((o) => {
        const on = selected.includes(o.id);
        return (
          <button
            key={o.id}
            type="button"
            role={multi ? "checkbox" : "radio"}
            aria-checked={on}
            onClick={() => onSelect(o.id)}
            className={`flex flex-col gap-3 rounded-2xl border p-4 md:p-5 text-left transition-colors ${
              on ? "border-foreground bg-foreground/[0.04]" : "border-foreground/15 hover:border-foreground/40"
            }`}
          >
            <span className="flex items-center justify-between gap-3">
              <span
                aria-hidden
                className={`w-5 h-5 shrink-0 flex items-center justify-center border transition-colors ${multi ? "rounded-md" : "rounded-full"} ${
                  on ? "bg-foreground border-foreground text-background" : "border-foreground/30"
                }`}
              >
                {on && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
              </span>
              {o.price ? (
                <span className="text-xs tabular-nums text-foreground/50">
                  +{money(o.price)}
                  {priceSuffix}
                </span>
              ) : null}
            </span>
            <span>
              <span className="block font-semibold">{o.label}</span>
              <span className="block mt-1 text-sm text-foreground/60 leading-snug">{o.hint}</span>
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
        className="rounded-full border border-foreground/20 bg-transparent px-5 py-3 text-base focus:outline-none focus:border-foreground transition-colors"
      />
    </label>
  );
}
