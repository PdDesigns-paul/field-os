import assert from "node:assert/strict";
import { test } from "node:test";
import { Book, mergeJson } from "./book.ts";
import { compileLeakyFixture, compileMeta } from "./compile.ts";
import { HONESTY, HONESTY_MARKERS } from "./honesty.ts";
import { leakViolations } from "./leak.ts";
import { getPack, PACKS } from "./packs.ts";
import { resolvePack } from "./resolve.ts";
import { buildTalkContext, modelFor } from "./talk.ts";

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
});
