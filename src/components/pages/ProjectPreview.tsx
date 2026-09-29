// Monochrome sketches of what each kind of project looks like in use. They stand in for
// screenshots, and say more about the work than a stock photo would.

const line = "rounded-full bg-foreground/15";

function Chat() {
  return (
    <div className="flex flex-col gap-3 w-[70%]">
      <div className="self-end rounded-2xl rounded-br-md bg-foreground/10 px-4 py-3 w-[55%]">
        <div className={`${line} h-2 w-full`} />
      </div>
      <div className="rounded-2xl rounded-bl-md border border-foreground/15 bg-background px-4 py-3 flex flex-col gap-2">
        <div className={`${line} h-2 w-full`} />
        <div className={`${line} h-2 w-4/5`} />
        <div className="flex gap-1.5 pt-1">
          {["Notion", "Drive", "Slack"].map((s) => (
            <span key={s} className="rounded-full border border-foreground/20 px-2 py-0.5 text-[10px] text-foreground/60">{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Workflow() {
  const node = "rounded-xl border border-foreground/20 bg-background px-3 py-2.5 flex flex-col gap-1.5 w-[24%]";
  return (
    <div className="relative flex items-center justify-between w-[80%]">
      <div aria-hidden className="absolute left-[12%] right-[12%] top-1/2 h-px bg-foreground/25" />
      {["Email", "Parse", "ERP"].map((t, i) => (
        <div key={t} className={`relative ${node} ${i === 1 ? "-translate-y-4" : ""}`}>
          <span className="text-[10px] text-foreground/60">{t}</span>
          <div className={`${line} h-1.5 w-full`} />
        </div>
      ))}
    </div>
  );
}

function Voice() {
  const bars = [3, 6, 10, 7, 12, 16, 9, 13, 18, 11, 7, 14, 10, 5, 8, 12, 6, 4];
  return (
    <div className="flex flex-col items-center gap-5 w-[70%]">
      <div className="flex items-center gap-1 h-20">
        {bars.map((h, i) => (
          <span key={i} className="w-1.5 rounded-full bg-foreground/40" style={{ height: `${h * 4.5}px` }} />
        ))}
      </div>
      <div className="rounded-full border border-foreground/15 bg-background px-4 py-2 flex items-center gap-2 w-[70%]">
        <span className="w-2 h-2 rounded-full bg-foreground/60 shrink-0" />
        <div className={`${line} h-2 w-full`} />
      </div>
    </div>
  );
}

function Dashboard() {
  const bars = [40, 65, 50, 80, 60, 95, 75];
  return (
    <div className="flex w-[80%] h-[62%] rounded-xl border border-foreground/15 bg-background overflow-hidden">
      <div className="w-[22%] border-r border-foreground/10 p-3 flex flex-col gap-2">
        {[1, 0.6, 0.6, 0.6].map((o, i) => (
          <div key={i} className="h-2 rounded-full bg-foreground/15" style={{ opacity: o }} />
        ))}
      </div>
      <div className="flex-1 p-4 flex flex-col gap-3">
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex-1 rounded-lg border border-foreground/10 p-2">
              <div className={`${line} h-2 w-1/2`} />
            </div>
          ))}
        </div>
        <div className="flex-1 flex items-end gap-2">
          {bars.map((h, i) => (
            <div key={i} className="flex-1 rounded-t bg-foreground/20" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Regions() {
  return (
    <div className="grid grid-cols-3 gap-3 w-[80%]">
      {["us-east", "eu-west", "ap-south"].map((r) => (
        <div key={r} className="rounded-xl border border-foreground/15 bg-background p-3 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-foreground/60">{r}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-foreground/60" />
          </div>
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-4 rounded-md border border-foreground/10" />
          ))}
        </div>
      ))}
    </div>
  );
}

const byType: Record<string, () => React.JSX.Element> = {
  "AI Product": Chat,
  Automation: Workflow,
  "AI Agents": Voice,
  "Web Platform": Dashboard,
  Infrastructure: Regions,
};

export default function ProjectPreview({ type, className = "" }: { type: string; className?: string }) {
  const Sketch = byType[type] ?? Dashboard;
  return (
    <div aria-hidden className={`flex items-center justify-center rounded-[1.5rem] bg-foreground/[0.04] border border-foreground/10 overflow-hidden ${className}`}>
      <Sketch />
    </div>
  );
}
