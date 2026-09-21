import type { BrandPack } from "./types.ts";

const BANNED = [/\bknock\b/i, /on the roof/i, /\bi35\b/i, /\bhail\b/i, /\badjuster\b/i];

export function leakSurfaces(pack: BrandPack): string {
  const bits = [
    pack.id,
    pack.productName,
    pack.talkName,
    ...Object.values(pack.places),
    pack.pwa.name,
    pack.pwa.shortName,
    pack.copy.setup,
    pack.copy.pin,
    pack.copy.start,
    pack.copy.end,
    pack.who,
    ...pack.labor.units.map((u) => `${u.id} ${u.label}`),
    ...pack.cards.flatMap((c) => [c.title, c.hook, c.reason, c.question]),
    ...pack.inspect.flatMap((r) => [r.title, r.body]),
    ...Object.values(pack.briefs),
    ...pack.starters,
    ...pack.help.flatMap((h) => [h.title, h.body]),
    ...pack.reference.flatMap((r) => [r.title, r.analog, r.body]),
    ...pack.scenes,
  ];
  return bits.join("\n");
}

export function leakViolations(pack: BrandPack): string[] {
  if (pack.id === "roof") return [];
  const text = leakSurfaces(pack);
  return BANNED.filter((re) => re.test(text)).map((re) => String(re));
}

export function assertNoLeak(pack: BrandPack): void {
  const hits = leakViolations(pack);
  if (hits.length) {
    throw new Error(`pack ${pack.id} leaked banned nouns: ${hits.join(", ")}`);
  }
}
