import { HONESTY } from "./honesty.ts";
import type { Book } from "./book.ts";
import type { BrandPack, TalkContext, TalkMode } from "./types.ts";

export const POSTED_BUDGET = {
  today: 400,
  pin: 280,
  mindset: 280,
  memory: 720,
} as const;

export function modelFor(mode: TalkMode, via: "xai" | "openrouter"): string {
  const dear = mode === "roleplay";
  if (via === "openrouter") return dear ? "x-ai/grok-4.5" : "x-ai/grok-4-fast";
  return dear ? "grok-4.5" : "grok-4-fast";
}

export function stripGps(s: string): string {
  return s.replace(/-?\d{1,3}\.\d{3,}/g, "[fix omitted]");
}

function fit(s: string, n: number): string {
  const t = stripGps(s).trim();
  if (t.length <= n) return t;
  return `${t.slice(0, Math.max(0, n - 1)).trimEnd()}…`;
}

export function buildTalkContext(input: {
  mode: TalkMode;
  pack: BrandPack;
  book: Book;
  openPinId?: string | null;
  via?: "xai" | "openrouter";
  query?: string;
}): TalkContext {
  const owner = input.book.owner();
  const day = input.book.openDay();
  const query = input.query ?? "";
  const counts = day
    ? input.pack.labor.units.map((u) => `${u.label}: ${day.counts[u.id] ?? 0}`).join(", ")
    : "no open day";
  const pin = input.openPinId ? input.book.pin(input.openPinId) : null;
  const mind = input.book.mindset();
  const hits: string[] = [];

  const today = day
    ? `Open day started ${day.startedAt}. Counts ${counts}. Notes: ${day.notes || "none"}.`
    : "No labor window is open.";
  if (day) hits.push("today");

  const pinLine = pin
    ? [
        pin.address && `address ${pin.address}`,
        pin.status && `status ${pin.status}`,
        pin.note && `note ${pin.note}`,
        pin.year && `year they stated ${pin.year}`,
      ]
        .filter(Boolean)
        .join("; ")
    : "no open pin";
  if (pin) hits.push(pin.address || "open pin");

  const mindText =
    Object.entries(mind)
      .filter(([, v]) => String(v).trim())
      .map(([k, v]) => `${k}: ${v}`)
      .join("; ") || "blank";
  if (mindText !== "blank") hits.push("mindset");

  const found = input.book.retrieve(query, 4);
  for (const m of found) hits.push(m.title);
  const mem = found.map((m) => `${m.title}: ${m.body}`).join("\n") || "none";

  return {
    mode: input.mode,
    model: modelFor(input.mode, input.via ?? "xai"),
    system: [
      HONESTY,
      `Pack: ${input.pack.id}. ${input.pack.who}`,
      input.pack.briefs[input.mode],
      `Hire: ${owner.name || "unnamed"} at ${owner.company || "this shop"} in ${owner.county || "no county yet"}.`,
    ].join("\n\n"),
    posted: {
      today: fit(today, POSTED_BUDGET.today),
      pin: fit(pinLine, POSTED_BUDGET.pin),
      mindset: fit(mindText, POSTED_BUDGET.mindset),
      memory: fit(mem, POSTED_BUDGET.memory),
      who: input.pack.who,
      hits,
    },
  };
}

export function talkPayload(
  ctx: TalkContext,
  userText: string,
): {
  model: string;
  messages: { role: "system" | "user"; content: string }[];
} {
  return {
    model: ctx.model,
    messages: [
      { role: "system", content: ctx.system },
      {
        role: "user",
        content: [
          `Today: ${ctx.posted.today}`,
          `Pin: ${ctx.posted.pin}`,
          `Mindset: ${ctx.posted.mindset}`,
          `Shop memory: ${ctx.posted.memory}`,
          "",
          userText,
        ].join("\n"),
      },
    ],
  };
}
