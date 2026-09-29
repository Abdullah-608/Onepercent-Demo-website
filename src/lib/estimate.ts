// Pricing for the estimate wizard. Every number the visitor sees comes from this file, so
// tune rates here. Amounts are USD.

export type Option = { id: string; label: string; hint: string; price?: number };

export const projectTypes: Option[] = [
  { id: "new", label: "New build", hint: "Starting from scratch", price: 4000 },
  { id: "redesign", label: "Redesign", hint: "Rework an existing product", price: 2500 },
  { id: "extend", label: "Add to existing", hint: "New features on a live app", price: 1500 },
];

export const platforms: Option[] = [
  { id: "web", label: "Web app", hint: "Runs in the browser, on any device" },
  { id: "mobile", label: "Mobile app", hint: "iOS and Android, released to the stores", price: 2500 },
  { id: "backend", label: "Backend or API", hint: "Server, database and business logic", price: 3000 },
];

export const SCREENS = { min: 6, max: 130, initial: 15 };

export const designOptions: Option[] = [
  { id: "design", label: "Yes, design it", hint: "UX, UI and a clickable prototype for every screen", price: 450 },
  { id: "spec", label: "No, build to spec", hint: "You bring finished designs", price: 250 },
];

export const integrations: Option[] = [
  { id: "db", label: "Database", hint: "Supabase, Postgres or similar", price: 800 },
  { id: "auth", label: "Auth and accounts", hint: "Sign-up, login, roles", price: 900 },
  { id: "billing", label: "Stripe billing", hint: "Subscriptions and invoices", price: 1400 },
  { id: "connect", label: "Stripe Connect", hint: "Marketplace payouts", price: 2800 },
  { id: "email", label: "Email and notifications", hint: "Transactional email, push", price: 500 },
  { id: "cms", label: "CMS", hint: "Content your team edits", price: 1200 },
  { id: "maps", label: "Maps and location", hint: "Search, routes, geofencing", price: 1000 },
  { id: "realtime", label: "Realtime and chat", hint: "Live updates, messaging", price: 1800 },
  { id: "analytics", label: "Analytics", hint: "Events, funnels, dashboards", price: 400 },
  { id: "api", label: "Other API", hint: "Any third-party service", price: 900 },
];

export const aiFeatures: Option[] = [
  { id: "chat", label: "AI chat or assistant", hint: "Conversational help inside your product", price: 2500 },
  { id: "rag", label: "Knowledge base search", hint: "Answers from your own documents, with sources", price: 4000 },
  { id: "agent", label: "AI agent or automation", hint: "Takes actions across your tools", price: 4500 },
  { id: "vision", label: "Vision and image AI", hint: "Reads, sorts or generates images", price: 3000 },
];

export const timelines: Option[] = [
  { id: "standard", label: "Standard", hint: "Our normal weekly cadence" },
  { id: "rush", label: "Rush, +30%", hint: "Compressed schedule with extra people on it" },
];

const RUSH = 1.3;
const WEEKLY_CAPACITY = 3500; // Roughly what one week of a senior team delivers
// Two front ends (web and mobile) share most logic, so the second adds half again per screen
const SECOND_CLIENT = 0.5;

export type Answers = {
  type: string | null;
  platforms: string[];
  screens: number;
  design: string | null;
  integrations: string[];
  ai: string[];
  timeline: string;
};

export const initialAnswers: Answers = {
  type: null,
  platforms: [],
  screens: SCREENS.initial,
  design: null,
  integrations: [],
  ai: [],
  timeline: "standard",
};

const priceOf = (list: Option[], id: string | null) => list.find((o) => o.id === id)?.price ?? 0;
const sum = (list: Option[], ids: string[]) => ids.reduce((t, id) => t + priceOf(list, id), 0);
const round = (n: number, to: number) => Math.round(n / to) * to;

export function estimate(a: Answers) {
  if (!a.type) return null;
  const clients = a.platforms.filter((p) => p !== "backend").length;
  const perScreen = priceOf(designOptions, a.design ?? "spec");
  const screens = clients ? a.screens * perScreen * (1 + SECOND_CLIENT * (clients - 1)) : 0;
  const rush = a.timeline === "rush";

  const total =
    (priceOf(projectTypes, a.type) + sum(platforms, a.platforms) + screens + sum(integrations, a.integrations) + sum(aiFeatures, a.ai)) *
    (rush ? RUSH : 1);

  const weeks = total / (rush ? RUSH : 1) / WEEKLY_CAPACITY / (rush ? 1.45 : 1);
  return {
    low: round(total * 0.9, 500),
    high: round(total * 1.25, 500),
    weeksLow: Math.max(1, Math.round(weeks * 0.85)),
    weeksHigh: Math.max(2, Math.ceil(weeks * 1.2)),
  };
}

export const money = (n: number) => (n >= 1000 ? `$${(n / 1000).toFixed(n % 1000 ? 1 : 0)}K` : `$${n}`);
