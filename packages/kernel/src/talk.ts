import { HONESTY } from "./honesty.ts";
import type { Book } from "./book.ts";
import type { BrandPack, TalkContext, TalkMode } from "./types.ts";

export function modelFor(mode: TalkMode, via: "xai" | "openrouter"): string {
  const dear = mode === "roleplay";
  if (via === "openrouter") return dear ? "x-ai/grok-4.5" : "x-ai/grok-4-fast";
  return dear ? "grok-4.5" : "grok-4-fast";
}

export function buildTalkContext(input: {
  mode: TalkMode;
  pack: BrandPack;
  book: Book;
  openPinId?: string | null;
  via?: "xai" | "openrouter";
}): TalkContext {
  const owner = input.book.owner();
  const day = input.book.openDay();
  const counts = day
    ? input.pack.labor.units.map((u) => `${u.label}: ${day.counts[u.id] ?? 0}`).join(", ")
    : "no open day";
  const pin = input.openPinId ? input.book.pin(input.openPinId) : null;
  const mind = input.book.mindset();
  const mem = input.book
    .memories()
    .slice(0, 8)
    .map((m) => `${m.title}: ${m.body}`)
    .join("\n");

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
      today: day
        ? `Open day started ${day.startedAt}. Counts ${counts}. Notes: ${day.notes || "none"}.`
        : "No labor window is open.",
      pin: pinLine,
      mindset: Object.entries(mind)
        .map(([k, v]) => `${k}: ${v}`)
        .join("; ") || "blank",
      memory: mem || "none",
      who: input.pack.who,
    },
  };
}

export function talkPayload(ctx: TalkContext, userText: string): {
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
