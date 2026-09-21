# Field OS

White-label door-to-door coach and journal for a new hire in any trade.

The phone is a ride-along: **Today / Door / Inspect / Plan**, an offline book, and a Talk button. A tenant is a markdown pack the kernel compiles. The default pack is generic D2D (`field`), not roofing.

**This is not Roofus.** [PdDesigns-paul/Roofus](https://github.com/PdDesigns-paul/Roofus) stays a roofing phone. Do not copy that tree. Do not host this on roofus.coach. This product does not wear that dog unless pack `roof` brings its own mark.

| Piece | Choice |
| --- | --- |
| Kernel | TypeScript — pack compile, SQLite book, honesty, leak tests, Copy, coach context |
| Book | sql.js bytes in OPFS (+ IndexedDB snapshot). Not Neon. Not a JSON blob in localStorage. |
| Phone | Svelte 5 + SvelteKit next (sequence 2). Four Places, five types. |
| Packs | Markdown + YAML. `field` default. Templates: `roof`, `pest`, `solar`. |
| Cloud | One Talk function. Cheap Live, dear Roleplay. OpenRouter key on You, or xAI. No `/login` Place. |
| Host | Vercel. One project. Host header may select a pack. Generic `*.vercel.app` is fine for play-testing. |

## Status

**Sequence 1 (kernel) is in this repo.** `packages/kernel` compiles four pack templates, owns the sql.js book, honesty, leak tests, Talk context, and Copy JSON restore. CI is `npm test` in that folder. No Playwright. No `cargo`.

A playable phone is proving the seam in a Grok preview (TanStack shell, same TypeScript kernel). Svelte Places land in sequence 2. Until then, this host still serves the Field OS face from `index.html`.

Product contract: [docs/SPEC.md](docs/SPEC.md). Gaps: [docs/GAPS.md](docs/GAPS.md). Agent rules: [AGENTS.md](AGENTS.md).

## The one seam

The kernel is the source of truth. The phone is chrome. CI calls the same contract:

```text
Pack  = compile(markdown + yaml) -> BrandPack
Book  = SQLite via sql.js (OPFS bytes; owners, days, counts, pins, labor, memory, mindset)
Talk  = honesty_kernel + pack.briefs[mode] + book.retrieve(query) + today
Copy  = export/import Book (JSON or db file). Merge: fill blanks, keep higher counts.
```

If the kernel cannot open the book, the phone is read-only chrome, not a second store.

## Layout

```text
packages/kernel/     TypeScript. Node test runner. sql.js. No window. No Svelte.
apps/phone/          Svelte 5 + SvelteKit. Sequence 2.
api/talk.ts          The only cloud. OpenRouter-shaped; xAI first. Sequence 4.
packs/field|roof|pest|solar
packs/fixtures/leaky
hosts.yaml           Host → pack id. Unknown host → field.
```

Routes from day one: `/today` `/door` `/inspect` `/plan`. Settings, Reference, Office, and the Talk sheet are not Places.

Five types only: **Place, Do, Chip, Go, Talk**. Buttons do. Links go. Chips fork the current task. Ghost captions are never actions.

## Packs

These four stay as templates on a test phone. A shop later loads **one** book.

| id | Who it is | Proof |
| --- | --- | --- |
| `field` | Generic D2D. Default. | No trade nouns. SLAP. Cooling-off. |
| `roof` | Roof / storm canvasser. | Script B default; A after Keep; i35. Own mark, not the old dog unless this pack brings it. |
| `pest` | Pest D2D. | Stops / Inspects / Starts. Storms off. |
| `solar` | Solar D2D. | Pitch / Site / Route. Never invent kWh / ITC. Never the utility. |

`field`, `pest`, and `solar` fail CI if they say `knock`, `On the roof`, or `i35`. Packs cannot turn honesty off.

## Talk keys

Clients drop an **OpenRouter** key on You (`sk-or-…`). It stays in the book on that phone. Live is cheap (`x-ai/grok-4-fast`). Roleplay is dear (`x-ai/grok-4.5`). No model picker. The function ignores a client-chosen model.

Preview / shop play-testing may fall back to `XAI_API_KEY` when no OpenRouter key is saved.

## Vercel

One project. Static PWA for the Places (once Svelte exists). One Node function for Talk. No host Postgres as the book. No `cargo` / `wasm-pack` step.

Until the Svelte phone exists, this repo serves the Field OS face from `index.html` so the project has a host that is **not** roofus.coach. A generic `field-os.vercel.app` (or whatever Vercel assigns) is the play-test domain.

## Sequence

1. TypeScript kernel: pack compile, empty Book, honesty strings, leak fixtures, CLI. **Done.**
2. Svelte shell: four Places, five types, empty book, tour, routes that match words.
3. Journal + labor + pins + Copy this phone.
4. Talk fleet + memory retrieve.
5. Door / Inspect / Roleplay from compiled markdown.
6. Proof packs pest + solar + roof. `field` remains default.
7. Office desk: mark, load pack file, packet text ingest. Not a Place.

Photos and VoiceStudio (hotswap roleplay voices) stay at the bottom of the list.

CI is the kernel. No Playwright. No browser in GitHub Actions.

## Not this product

- TanStack Start, React, Zustand, Grok App Builder scaffold, better-auth, Neon as the live book
- `/login` as a Place, UserButton, Stripe, a pricing grid
- Takeoff, squares, estimator, listing-site scrape
- Recording a homeowner, robocalls, coaching a cooling-off waiver
- A sixth control type, a theme picker on the canvasser phone
- Making Roofus (the dog) the default pack

## License

MIT for kernel and phone. A shop’s mark, porch words, and pack files stay the shop’s. Do not dump licensed PDFs into Reference — distill named public analogs only.
