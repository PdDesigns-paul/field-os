import assert from "node:assert/strict";
import { test } from "node:test";
import { Book, mergeJson } from "./book.ts";
import { compileLeakyFixture, compileMeta } from "./compile.ts";
import { HONESTY, HONESTY_MARKERS } from "./honesty.ts";
import { leakViolations } from "./leak.ts";
import { getPack, PACKS } from "./packs.ts";
import { resolvePack } from "./resolve.ts";
import { buildTalkContext, modelFor, POSTED_BUDGET, stripGps, talkPayload } from "./talk.ts";

test("resolve unknown and grok.me to field", () => {
  assert.equal(resolvePack({}), "field");
  assert.equal(resolvePack({ id: "nope" }), "field");
  assert.equal(resolvePack({ id: "pest" }), "pest");
  assert.equal(resolvePack({ host: "foo.grok.me", id: "roof" }), "field");
});

test("honesty markers present", () => {
  for (const m of HONESTY_MARKERS) {
    assert.match(HONESTY.toLowerCase(), new RegExp(m.toLowerCase().replace(/[()]/g, "\\$&")));
  }
});

test("field pest solar do not leak roof nouns", () => {
  for (const id of ["field", "pest", "solar"] as const) {
    assert.deepEqual(leakViolations(PACKS[id]), []);
  }
});

test("packs ship distilled reference, not a fifth Place", () => {
  assert.ok(PACKS.field.reference.some((r) => /16 CFR 429/.test(r.analog)));
  assert.ok(PACKS.pest.reference.some((r) => /NPMA/.test(r.analog)));
  assert.ok(PACKS.solar.reference.some((r) => /NABCEP/.test(r.analog)));
  assert.ok(PACKS.roof.reference.some((r) => /InterNACHI/.test(r.analog)));
});

test("roof may say knock and i35", () => {
  assert.match(leakSurfacesSafe("roof"), /i35/i);
});

function leakSurfacesSafe(id: string): string {
  const p = getPack(id);
  return JSON.stringify(p);
}

test("leaky fixture fails compile", () => {
  assert.throws(() => compileLeakyFixture());
});

test("invalid pack missing brief fails", () => {
  assert.throws(() =>
    compileMeta(
      {
        id: "field",
        productName: "X",
        talkName: "Talk",
        units: [{ id: "doors", label: "Doors" }],
        who: "",
        starters: [],
        help: [],
      },
      { cards: "", inspect: "", briefs: "## live\nhi\n" },
    ),
  );
});

test("book start pause end and counts", async () => {
  const book = await Book.open();
  const pack = getPack("field");
  book.saveOwner({ name: "Pat", company: "Acme", county: "Travis" });
  assert.equal(book.setupComplete(), true);
  assert.equal(book.owner().label, "This phone");
  const day = book.startDay();
  book.bumpTile("doors", 2);
  const pin = book.dropPin({ address: "12 Oak" });
  book.countWrite(pack, pin.id, "talked");
  book.countWrite(pack, pin.id, "set");
  const open = book.openDay()!;
  assert.equal(open.counts.doors, 2);
  assert.equal(open.counts.talks, 0);
  assert.equal(open.counts.sets, 1);
  book.pauseDay();
  assert.equal(book.paused(), true);
  book.resumeDay();
  book.endDay();
  assert.equal(book.openDay(), null);
  assert.ok(book.elapsedMs() === 0);
  book.saveAar("One set. Leave the rest.");
  assert.equal(book.lastDay()?.aar, "One set. Leave the rest.");
});

test("copy json has labor memory pins and no trail", async () => {
  const book = await Book.open();
  book.startDay();
  book.bumpTile("doors", 1);
  book.dropPin({ lat: 30.2, lng: -97.7, address: "1 Main" });
  book.addMemory("Shop", "We leave on a no.");
  const json = book.toJson() as { pins: unknown[]; memory: unknown[]; trail?: unknown };
  assert.ok(Array.isArray(json.pins) && json.pins.length === 1);
  assert.ok(Array.isArray(json.memory) && json.memory.length === 1);
  assert.equal(json.trail, undefined);
  const merged = mergeJson(
    { counts: [{ day_id: "d", unit_id: "doors", n: 2 }] },
    { counts: [{ day_id: "d", unit_id: "doors", n: 5 }] },
  ) as { counts: { n: number }[] };
  assert.equal(merged.counts[0].n, 5);
});

test("merge fills blanks and keeps higher counts", async () => {
  const live = await Book.open();
  live.saveOwner({ name: "Pat", company: "Acme", county: "" });
  live.startDay();
  live.bumpTile("doors", 2);
  live.saveAar("Keep the loop.");
  live.dropPin({ address: "1 Main" });
  const incoming = await Book.open();
  incoming.saveOwner({ name: "", company: "", county: "Travis" });
  incoming.startDay();
  incoming.bumpTile("doors", 5);
  incoming.dropPin({ address: "9 Oak" });
  incoming.addMemory("Leave", "A no is complete.");
  live.mergeFromJson(incoming.toJson());
  assert.equal(live.owner().name, "Pat");
  assert.equal(live.owner().county, "Travis");
  assert.equal(live.openDay()?.counts.doors, 5);
  assert.equal(live.lastDay()?.aar, "Keep the loop.");
  assert.equal(live.pins().length, 2);
  assert.equal(live.memories()[0]?.body, "A no is complete.");
});

test("hours journal uses gaps not 0h", async () => {
  const book = await Book.open();
  const empty = book.hoursJournal(new Date());
  assert.equal(empty.length, 7);
  assert.ok(empty.every((h) => h.ms === null));
  book.startDay();
  book.bumpTile("doors", 1);
  const today = book.hoursJournal(new Date());
  assert.ok(today.some((h) => h.ms !== null && h.ms > 0));
  assert.ok(today.filter((h) => h.ms === null).length >= 1);
});

test("reminder is setup until the book is mine, night only after work", async () => {
  const book = await Book.open();
  const evening = new Date();
  evening.setHours(18, 0, 0, 0);
  const morning = new Date();
  morning.setHours(10, 0, 0, 0);
  assert.equal(book.reminder(evening), "setup");
  book.saveOwner({ name: "Pat", company: "Acme", county: "Travis" });
  assert.equal(book.reminder(evening), null);
  book.startDay();
  book.bumpTile("doors", 1);
  assert.equal(book.reminder(morning), null);
  assert.equal(book.reminder(evening), "night");
  book.saveAar("One set.");
  assert.equal(book.reminder(evening), null);
});

test("working loop and pin groups", async () => {
  const book = await Book.open();
  const a = book.dropPin({ lat: 30.27, lng: -97.74, address: "Near" });
  book.dropPin({ lat: 31.0, lng: -97.74, address: "Far" });
  book.dropPin({ address: "No fix" });
  book.useTodayLoop();
  assert.equal(book.loopPinIds().length, 3);
  book.setLoop([a.id]);
  const groups = book.groupedPins({ lat: 30.27, lng: -97.74 });
  assert.equal(groups[0]?.id, "loop");
  assert.equal(groups[0]?.pins[0]?.address, "Near");
  const bands = new Set(groups.map((g) => g.id));
  assert.ok(bands.has("far") || bands.has("walk"));
  assert.ok(bands.has("no-fix"));
});

test("restore json round-trips labor memory pins", async () => {
  const a = await Book.open();
  a.saveOwner({ name: "Pat", company: "Acme", county: "Travis", talkKey: "sk-or-secret" });
  a.startDay();
  a.bumpTile("doors", 3);
  a.dropPin({ lat: 30.2, lng: -97.7, address: "1 Main" });
  a.addMemory("Shop", "We leave on a no.");
  a.setMindset("why", "Feed people.");
  const dump = a.toJson();
  const b = await Book.open();
  b.saveOwner({ talkKey: "kept-here" });
  b.restoreFromJson(dump);
  assert.equal(b.owner().name, "Pat");
  assert.equal(b.owner().talkKey, "kept-here");
  assert.equal(b.openDay()?.counts.doors, 3);
  assert.equal(b.pins()[0]?.address, "1 Main");
  assert.equal(b.pins()[0]?.lat, 30.2);
  assert.equal(b.memories()[0]?.body, "We leave on a no.");
  assert.equal(b.mindset().why, "Feed people.");
});

test("copy round-trips working loop", async () => {
  const a = await Book.open();
  const pin = a.dropPin({ address: "1 Main" });
  a.setLoop([pin.id]);
  const b = await Book.open();
  b.restoreFromJson(a.toJson());
  assert.deepEqual(b.loopPinIds(), [pin.id]);
});

test("talk context strips gps and locks model", async () => {
  const book = await Book.open();
  book.saveOwner({ name: "Pat", company: "Acme", county: "Travis" });
  const pin = book.dropPin({ lat: 30.2, lng: -97.7, address: "12 Oak" });
  const ctx = buildTalkContext({ mode: "live", pack: getPack("field"), book, openPinId: pin.id });
  assert.doesNotMatch(JSON.stringify(ctx.posted), /30\.2/);
  assert.doesNotMatch(JSON.stringify(ctx.posted), /-97/);
  assert.equal(modelFor("roleplay", "xai"), "grok-4.5");
  assert.equal(modelFor("live", "xai"), "grok-4-fast");
  assert.equal(ctx.system.includes("16 CFR 429"), true);
  assert.ok(ctx.posted.hits.includes("12 Oak"));
});

test("retrieve ranks matching memory and does not dump the book", async () => {
  const book = await Book.open();
  book.addMemory("Leave", "A no is a complete sentence.", "typed", "leave no");
  book.addMemory("Chemicals", "We do not name a spray we did not bring.", "typed", "chemical");
  book.addMemory("Neighbor", "Never invent a house next door.", "typed", "neighbor");
  const hits = book.retrieve("how do I leave on a no");
  assert.equal(hits[0]?.title, "Leave");
  assert.equal(hits.some((h) => h.title === "Chemicals"), false);
  const empty = book.retrieve("");
  assert.equal(empty.length, 0);
});

test("talk retrieve posts matching memory, caps, and strips gps from memory", async () => {
  const book = await Book.open();
  book.saveOwner({ name: "Pat", company: "Acme", county: "Travis" });
  book.setMindset("why", "Feed people.");
  book.addMemory("Leave", "A no is a complete sentence.");
  book.addMemory("Spray", "Do not invent a chemical.");
  book.addMemory("Coords", "The shop is at 30.267 latitude.");
  const long = "x".repeat(POSTED_BUDGET.memory + 80);
  book.addMemory("Leave dump", long);
  const ctx = buildTalkContext({
    mode: "live",
    pack: getPack("field"),
    book,
    query: "leave on a no",
  });
  assert.match(ctx.posted.memory, /Leave/);
  assert.doesNotMatch(ctx.posted.memory, /chemical/i);
  assert.ok(ctx.posted.hits.includes("Leave"));
  assert.equal(ctx.posted.hits.includes("Spray"), false);
  const fat = buildTalkContext({
    mode: "live",
    pack: getPack("field"),
    book,
    query: "leave dump",
  });
  assert.ok(fat.posted.memory.length <= POSTED_BUDGET.memory);
  assert.match(fat.posted.memory, /…$/);
  const gps = buildTalkContext({
    mode: "live",
    pack: getPack("field"),
    book,
    query: "coords shop latitude",
  });
  assert.doesNotMatch(JSON.stringify(gps.posted), /30\.267/);
  assert.match(gps.posted.memory, /\[fix omitted\]/);
  assert.ok(gps.posted.memory.length <= POSTED_BUDGET.memory);
  const payload = talkPayload(ctx, "What do I say after a no?");
  assert.equal(payload.model, "grok-4-fast");
  assert.match(payload.messages[1].content, /Leave/);
});

test("stripGps redacts fixes and leaves porch words", () => {
  assert.equal(stripGps("12 Oak at 30.267, -97.743"), "12 Oak at [fix omitted], [fix omitted]");
  assert.equal(stripGps("Leave on a no."), "Leave on a no.");
});
