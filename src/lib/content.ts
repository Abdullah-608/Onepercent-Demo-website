// Site copy and data shared between pages. Replace placeholders with real content.
// Note: keep Tailwind classes out of this file — src/lib isn't in the Tailwind content globs.

export const CONTACT_EMAIL = "hello@onepercent.com";
export const BOOK_CALL_URL = `mailto:${CONTACT_EMAIL}?subject=Book%20a%20call`;

export const navLinks = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/how-we-work", label: "How We Work" },
  { href: "/stories", label: "Client Stories" },
  { href: "/playbook", label: "Playbook" },
];

// Swap `image` for your own project screenshots (e.g. "/projects/atlas.jpg" in /public).
export const projects = [
  { title: "Atlas AI", type: "AI Product", year: "2026", image: "https://picsum.photos/id/1015/1600/1000", text: "A retrieval-powered research assistant that turns scattered company docs into answers.", tags: ["LLMs", "RAG", "Next.js"] },
  { title: "Flowstate", type: "Automation", year: "2025", image: "https://picsum.photos/id/1043/1600/1000", text: "Workflow engine that removed 40 hours a week of manual ops for a logistics team.", tags: ["n8n", "APIs", "Postgres"] },
  { title: "Nova Support", type: "AI Agents", year: "2025", image: "https://picsum.photos/id/1067/1600/1000", text: "Voice and chat agents resolving most tier-one tickets without a human in the loop.", tags: ["LangChain", "Voice", "Tool use"] },
  { title: "Meridian", type: "Web Platform", year: "2025", image: "https://picsum.photos/id/1039/1600/1000", text: "A multi-tenant SaaS dashboard with real-time analytics and role-based access.", tags: ["React", "TypeScript", "Postgres"] },
  { title: "Skyline Cloud", type: "Infrastructure", year: "2024", image: "https://picsum.photos/id/1018/1600/1000", text: "Zero-downtime migration to a multi-region, cost-optimised cloud architecture.", tags: ["AWS", "Terraform", "Kubernetes"] },
  { title: "Pulse Voice", type: "AI Agents", year: "2026", image: "https://picsum.photos/id/1025/1600/1000", text: "Real-time voice assistant that books, reschedules and follows up for a clinic network.", tags: ["Voice", "Realtime", "Tool use"] },
];

export type Project = (typeof projects)[number];

export const manifesto =
  "Most software gets shipped. Very little of it gets finished. We are a small senior team that designs, builds and runs AI products, automations and web platforms for companies that care about the last one percent: the edge case nobody tested, the loading state nobody designed, the workflow that quietly saves a team forty hours a week.";

export const principles = [
  { title: "Senior hands only", text: "The people you meet on the first call are the people writing your code. No hand-offs to a junior bench." },
  { title: "Ship weekly", text: "You see working software every week, on a real URL, not a slide deck about progress." },
  { title: "Own the outcome", text: "We measure success in hours saved, tickets resolved and revenue moved, and we report on it." },
  { title: "Leave it better", text: "Clean code, written docs and a proper handover, so your team can run it without us." },
];

export const team = [
  { name: "Zain Rashid", role: "Founder, engineering" },
  { name: "Aisha Khan", role: "Product design" },
  { name: "Omar Siddiqui", role: "AI & automation" },
  { name: "Hira Malik", role: "Full stack" },
  { name: "Bilal Ahmed", role: "Cloud & DevOps" },
  { name: "Sara Iqbal", role: "Delivery lead" },
];

export const processSteps = [
  { title: "Discovery call", duration: "Day 1", text: "A 30-minute call to understand the problem, the people it affects and what success looks like in numbers.", outputs: ["Problem statement", "Success metrics"] },
  { title: "Scope & estimate", duration: "Days 2–4", text: "We map the system, flag the risky parts early and send a fixed-scope proposal with a clear price and timeline.", outputs: ["Technical plan", "Fixed quote", "Timeline"] },
  { title: "Design", duration: "Week 1–2", text: "Flows and interfaces designed in the open. You comment directly on the work, and nothing moves forward until it feels right.", outputs: ["User flows", "UI design", "Clickable prototype"] },
  { title: "Build in weekly cycles", duration: "Week 2 onward", text: "Every week ends with a demo on a live preview URL. You always know what shipped, what's next and what's blocked.", outputs: ["Weekly demo", "Preview deploys", "Progress notes"] },
  { title: "Launch", duration: "Launch week", text: "Load testing, monitoring and a staged rollout. We stay on call through launch so nothing surprises you in production.", outputs: ["Production release", "Monitoring", "Runbook"] },
  { title: "Support & grow", duration: "Ongoing", text: "Optional retainer for improvements, new features and on-call support, or a clean handover to your own team.", outputs: ["Handover docs", "Retainer option"] },
];

export const engagements = [
  { name: "Sprint", price: "From $3K", length: "1–2 weeks", text: "A focused build for one clear problem: an automation, an AI prototype or a landing page.", includes: ["Fixed scope", "One senior engineer", "Handover call"] },
  { name: "Build", price: "From $12K", length: "4–10 weeks", text: "A complete product from design to launch, with weekly demos and a production-ready release.", includes: ["Design + engineering", "Weekly demos", "Launch support"] },
  { name: "Partner", price: "Monthly", length: "Ongoing", text: "An embedded team that ships continuously alongside yours, with a guaranteed number of hours each month.", includes: ["Dedicated team", "Priority support", "Quarterly roadmap"] },
];

export const faqs = [
  { q: "How fast can you start?", a: "Usually within one to two weeks of signing. Small sprints can often start the following Monday." },
  { q: "Do you work with early-stage startups?", a: "Yes. About half our clients are pre-seed to Series A. We help decide what not to build as much as what to build." },
  { q: "Who owns the code?", a: "You do, from the first commit. Everything lives in your repositories and your cloud accounts." },
  { q: "What if the scope changes mid-project?", a: "It often does. We re-estimate the change openly before building it, so the price never surprises you." },
  { q: "Can you work with our in-house team?", a: "Yes. We regularly pair with internal engineers, follow your conventions and review each other's pull requests." },
];

// Client videos: drop files in /public/videos and set `video` to their path, e.g.
// "/videos/techflow.mp4". Until then each video shows a placeholder poster.
export const storiesReel = { video: undefined as string | undefined, duration: "1:30" };

export const stories = [
  {
    client: "TechFlow",
    person: "Sarah Jenkins",
    role: "CEO",
    project: "Atlas AI",
    metric: "70%",
    metricLabel: "less time spent searching internal docs",
    challenge: "Answers were buried across Notion, Drive and Slack. New hires took weeks to get productive.",
    solution: "A retrieval-powered assistant with source citations, permission-aware search and Slack integration.",
    quote: "The level of design and engineering is simply unmatched. It feels like magic.",
    video: undefined as string | undefined,
    duration: "2:14",
  },
  {
    client: "Northline Logistics",
    person: "David Chen",
    role: "Head of Operations",
    project: "Flowstate",
    metric: "40h",
    metricLabel: "of manual work removed every week",
    challenge: "Order updates were copied by hand between the carrier portal, the ERP and customer emails.",
    solution: "An n8n workflow engine with AI parsing for carrier emails and automatic exception alerts.",
    quote: "They don't just build software, they understand how our team actually works.",
    video: undefined as string | undefined,
    duration: "1:48",
  },
  {
    client: "Quantum Health",
    person: "Elena Rodriguez",
    role: "CTO",
    project: "Nova Support",
    metric: "62%",
    metricLabel: "of tier-one tickets resolved without a human",
    challenge: "Support volume tripled after launch, and response times had slipped to over a day.",
    solution: "Chat and voice agents with tool access to bookings and billing, escalating cleanly to humans.",
    quote: "We've seen our response times drop from a day to minutes. Outstanding work.",
    video: undefined as string | undefined,
    duration: "2:31",
  },
  {
    client: "Stoic AI",
    person: "Marcus Aurelius",
    role: "Founder",
    project: "Meridian",
    metric: "2×",
    metricLabel: "trial-to-paid conversion after the redesign",
    challenge: "A powerful product hidden behind a confusing dashboard that trial users abandoned.",
    solution: "A redesigned analytics dashboard with guided onboarding and real-time data.",
    quote: "An absolute game-changer for our product. Clean, fast and incredibly beautiful.",
    video: undefined as string | undefined,
    duration: "1:36",
  },
];

export const playbookCategories = ["All", "Strategy", "AI", "Engineering", "Design"] as const;
export type PlaybookCategory = (typeof playbookCategories)[number];

export const playbook: { title: string; category: Exclude<PlaybookCategory, "All">; read: string; summary: string; points: string[] }[] = [
  {
    title: "Start with the boring workflow",
    category: "Strategy",
    read: "4 min",
    summary: "The best first AI project is rarely the flashy one. It's the repetitive task your team complains about every Friday.",
    points: ["List every task that's done more than 20 times a week.", "Rank by hours spent, not by how exciting it sounds.", "Automate one end to end before starting the next."],
  },
  {
    title: "Retrieval before fine-tuning",
    category: "AI",
    read: "6 min",
    summary: "Nine times out of ten, a model that can look things up beats a model that was trained on your data.",
    points: ["Clean and chunk your documents before choosing a model.", "Always return sources so people can check the answer.", "Measure answer quality on real questions from your team."],
  },
  {
    title: "Design the failure states first",
    category: "Design",
    read: "3 min",
    summary: "Empty screens, errors and slow loads are where users decide whether to trust your product.",
    points: ["Every error says what happened and how to fix it.", "Every empty state points to the next action.", "Loading states show structure, not a spinner."],
  },
  {
    title: "Agents need guardrails, not freedom",
    category: "AI",
    read: "5 min",
    summary: "Useful agents do a few things reliably. Give them narrow tools, clear limits and an easy way to hand off to a human.",
    points: ["Give each tool one job and validate its inputs.", "Log every action the agent takes.", "Escalate to a person when confidence is low."],
  },
  {
    title: "Ship on a preview URL every week",
    category: "Engineering",
    read: "4 min",
    summary: "Weekly demos on real infrastructure catch misunderstandings while they're still cheap to fix.",
    points: ["Every pull request gets its own preview deploy.", "Demo working software, not screenshots.", "Write down what shipped and what's next."],
  },
  {
    title: "Price the risk, not the hours",
    category: "Strategy",
    read: "5 min",
    summary: "Fixed quotes only work when the unknowns are named up front. We spend the first days hunting for them.",
    points: ["Spike the riskiest integration before quoting.", "Split scope into must-have and nice-to-have.", "Re-estimate changes openly before building them."],
  },
  {
    title: "Observability from day one",
    category: "Engineering",
    read: "4 min",
    summary: "If you can't see it in production, you can't fix it. Logs, traces and alerts go in with the first deploy.",
    points: ["Structured logs with a request ID on every line.", "Alert on user-facing symptoms, not CPU.", "Keep a runbook next to every alert."],
  },
  {
    title: "Typography does the heavy lifting",
    category: "Design",
    read: "3 min",
    summary: "Before adding colour or illustration, get the type scale right. Most interfaces need fewer styles than they use.",
    points: ["Use one or two typefaces, not four.", "Set a clear scale and stick to it.", "Keep body lines under 80 characters."],
  },
];
