import { assertNoLeak } from "./leak.ts";
import type { BrandPack, DoorCard, InspectRow, PackSource, TalkMode } from "./types.ts";

export type PackMeta = {
  id: string;
  productName: string;
  talkName: string;
  places?: Partial<BrandPack["places"]>;
  pwa?: Partial<BrandPack["pwa"]>;
  modules?: Partial<BrandPack["modules"]>;
  copy?: Partial<BrandPack["copy"]>;
  units: { id: string; label: string }[];
  statusToUnit?: Record<string, string | null>;
  who: string;
  starters: string[];
  help: { title: string; body: string }[];
};

function sections(md: string): { title: string; body: string }[] {
  return md
    .replace(/\r\n/g, "\n")
    .split(/^## /m)
    .slice(1)
    .map((chunk) => {
      const nl = chunk.indexOf("\n");
      return {
        title: (nl === -1 ? chunk : chunk.slice(0, nl)).trim(),
        body: (nl === -1 ? "" : chunk.slice(nl + 1)).trim(),
      };
    });
}

function slug(title: string, i: number): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `item-${i + 1}`;
}

function splitCard(body: string): { hook: string; reason: string; question: string } {
  const paras = body.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  return {
    hook: paras[0] ?? body,
    reason: paras[1] ?? "",
    question: paras[2] ?? paras.at(-1) ?? "",
  };
}

export function compileMeta(meta: PackMeta, md: Omit<PackSource, "yaml">): BrandPack {
  const cards: DoorCard[] = sections(md.cards).map((s, i) => ({
    id: slug(s.title, i),
    title: s.title,
    ...splitCard(s.body),
  }));
  const inspect: InspectRow[] = sections(md.inspect).map((s, i) => ({
    id: slug(s.title, i),
    title: s.title,
    body: s.body,
  }));
  const briefs: Record<TalkMode, string> = { live: "", roleplay: "", mindset: "" };
  for (const s of sections(md.briefs)) {
    const k = s.title.toLowerCase() as TalkMode;
    if (k in briefs) briefs[k] = s.body;
  }
  if (!briefs.live || !briefs.roleplay || !briefs.mindset) {
    throw new Error(`pack ${meta.id} is missing a brief`);
  }
  const units = meta.units.length ? meta.units : [{ id: "doors", label: "Doors" }];
  const pack: BrandPack = {
    id: meta.id,
    productName: meta.productName,
    talkName: meta.talkName,
    places: {
      today: "Today",
      door: "Door",
      inspect: "Inspect",
      plan: "Plan",
      ...meta.places,
    },
    pwa: {
      name: meta.pwa?.name ?? meta.productName,
      shortName: meta.pwa?.shortName ?? meta.id,
    },
    modules: {
      storms: false,
      claim: false,
      internachi: false,
      packets: false,
      ...meta.modules,
    },
    copy: {
      setup: "Name, company, one county.",
      pin: "Pin this house.",
      start: "Start day",
      end: "End day",
      ...meta.copy,
    },
    labor: {
      units,
      statusToUnit: {
        "no-answer": units[0]?.id ?? null,
        talked: units[1]?.id ?? units[0]?.id ?? null,
        look: units[1]?.id ?? units[0]?.id ?? null,
        set: units[2]?.id ?? units.at(-1)?.id ?? null,
        revisit: null,
        skip: null,
        ...meta.statusToUnit,
      },
    },
    cards,
    inspect,
    briefs,
    who: meta.who,
    starters: meta.starters,
    help: meta.help,
    scenes: cards.map((c) => c.title),
  };
  assertNoLeak(pack);
  return pack;
}

/** YAML is a later CLI. Tests use this to fail a leaky fixture without a parser. */
export function compileLeakyFixture(): never {
  const pack = {
    id: "leaky",
    productName: "Leaky",
    talkName: "Talk",
    places: { today: "Today", door: "Door", inspect: "Inspect", plan: "Plan" },
    pwa: { name: "Leaky", shortName: "Leak" },
    modules: { storms: false, claim: false, internachi: false, packets: false },
    copy: { setup: "", pin: "", start: "", end: "" },
    labor: { units: [{ id: "roof", label: "On the roof" }], statusToUnit: {} },
    cards: [
      {
        id: "bad",
        title: "Knock",
        hook: "After the knock we run i35.",
        reason: "hail",
        question: "adjuster?",
      },
    ],
    inspect: [],
    briefs: { live: "x", roleplay: "x", mindset: "x" },
    who: "",
    starters: [],
    help: [],
    scenes: [],
  } satisfies BrandPack;
  assertNoLeak(pack);
  throw new Error("leaky pack should not compile");
}
