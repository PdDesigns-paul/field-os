# Field OS — product contract

The book. Agents implement this, not a memory of Roofus.

## Problem

Roofus is a roofing takeoff tool that grew a canvasser journal, then a coach, then white-label packs, then a labor clock, then pest and solar proofs. The phone still thinks Today lives at `/truck`. A second shop still risks hearing “knock.”

Field OS is a **new repo** for a white-label door-to-door coach and journal. New language. New architecture. Roofus.coach and the Roofus GitHub stay where they are.

## Architecture

| Piece | Language | Why |
| --- | --- | --- |
| Kernel (book, pack compile, honesty, memory, backup, coach context) | TypeScript | Same leak / honesty / resolve tests in CI and on Vercel. No browser required. |
| Phone (Places, five-type kit, Talk UI, maps surface) | Svelte 5 + SvelteKit | Routes are Places. Renderer of kernel state, not a second store. |
| Packs | Markdown + YAML | One source → cards, help, briefs, AI context. |
| Talk edge | One function | Stream tokens. No business rules. OpenRouter-shaped; xAI first. |

Book engine is **sql.js**. Live bytes live in **OPFS**. Not Neon. Not host Postgres. Not a JSON blob in localStorage.

### BrandPack shape

```ts
BrandPack = {
  id, productName, talkName,
  places: { today, door, inspect, plan },
  markSrc, pwa, tokens, copy, modules,
  cards, claimCard?, scenes, who, claimStages?,
  briefs, starters, promptModules, help,
  labor: { units: ActivityUnit[] },
  inspect: InspectPack
}
modules = { storms, claim, internachi, packets }  // default all false
```

Resolve: pack id at build, or host allowlist, else `field`. Unknown id → `field`, never silent roof.

## Phone chrome

- Routes: `/today` `/door` `/inspect` `/plan`
- Five types, no sixth: Place, Do, Chip, Go, Talk
- Talk FAB; hidden on Inspect; hold starts Live
- Count tiles: the tile is the control
- Squint test is the UI law
- First screen is Today. No login wall.
- Setup on Today until name, company, and one county exist
- Help and Menu in the header. Back only on Settings, Reference, and nested pages.

## Book tables

Owner-scoped.

- `owner` (id, label; empty id = This phone)
- `day` (date, counts keyed by unit id, notes, aar)
- `labor_window` (start, end, pause segments; breaks derived)
- `pin` (lat/lng optional, address, year, status, note, look, inspect ticks)
- `memory` (title, tags, body, source: typed | packet | faq)
- `mindset` (why, demon, pace, stack)
- `copy_log` (last copy at, channel: file | optional notion)

Trail points, if later, are a separate table that does **not** export to Talk or to Notion.

## Coach

- Honesty prompt is short, locked in the kernel, identical for every pack
- Three briefs from the pack: live, roleplay, mindset
- Tools read the posted book only. No web.
- `modelFor(roleplay)` = dear; everything else cheap. Client cannot override.
- Voice: hold-to-talk and Hear this line. No voice clone. Do not record a homeowner.
- Never fake neighbors, storms, “we’re working next door,” invented years, prices, kWh, chemicals, infestations
- Always the cooling-off rule. Never a waiver. Never the utility.
- GPS never sent as lat/lng to the coach
- One appointment from a day of doors still counts as a winning day

## Copy this phone

SQLite dump or JSON. Merge: fill blanks, keep higher counts. Restore onto a live day demands a typed confirm. Last copy is a line on You. Notion is optional and never the only lifeboat.

## Testing

CI is the TypeScript kernel.

- Compile `field` / `roof` / `pest` / `solar` / a leaky fixture
- Fail compile on an invalid pack
- Honesty strings present for every pack
- `field`, `pest`, `solar` contain none of `knock`, `On the roof`, `i35`, `hail`, `adjuster` unless the pack opted into the matching module
- Labor unit labels come from the pack; storage is generic unit ids
- Empty owner is This phone; Switch book / Restore require typed confirm when the day has counts or pins
- Copy round-trip includes labor + memory + pins; trail absent
- Talk tools see only posted book fields; `modelFor(roleplay)` is dear
- Default resolve is `field`; unknown host is `field`; grok.me is not a pack host

## Sequence

1. TypeScript kernel
2. Svelte shell
3. Journal + labor + pins + Copy
4. Talk fleet + memory
5. Door / Inspect / Roleplay
6. Proof packs
7. Office desk

Gaps and recommended changes: [GAPS.md](GAPS.md).
