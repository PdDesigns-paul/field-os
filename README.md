# Field OS

White-label door-to-door coach and journal for a new hire in any trade.

The phone is a ride-along: **Today / Door / Inspect / Plan**, an offline book, and a Talk button. A tenant is a markdown pack the kernel compiles. The default pack is generic D2D (`field`), not roofing.

**This is not Roofus.** [PdDesigns-paul/Roofus](https://github.com/PdDesigns-paul/Roofus) stays a roofing phone. Do not copy that tree. Do not host this on roofus.coach. This product does not wear that dog unless pack `roof` brings its own mark.

| Piece | Choice |
| --- | --- |
| Kernel | TypeScript — pack compile, SQLite book, honesty, leak tests, Copy, coach context |
| Book | sql.js bytes in OPFS. Not Neon. Not a JSON blob in localStorage. |
| Phone | Svelte 5 + SvelteKit, renderer of kernel state. Four Places, five types. |
| Packs | Markdown + YAML. `field` default. Proofs: `roof`, `pest`, `solar`. |
| Cloud | One Talk function. Cheap Live, dear Roleplay. No `/login` Place. |
| Host | Vercel. One project. Host header may select a pack. |

## Status

Repo is public. Kernel, phone, and packs are **not implemented yet**. Sequence is below. Product contract: [docs/SPEC.md](docs/SPEC.md). Things the spec still needs: [docs/GAPS.md](docs/GAPS.md). Agent rules: [AGENTS.md](AGENTS.md).

## The one seam

The kernel is the source of truth. The phone is chrome. CI calls the same contract:

```text
Pack  = compile(markdown + yaml) -> BrandPack
Book  = SQLite via sql.js (OPFS bytes; owners, days, counts, pins, labor, memory, mindset)
Talk  = honesty_kernel + pack.briefs[mode] + book.retrieve(query) + today
Copy  = export/import Book (JSON or db file). Merge: fill blanks, keep higher counts.
```

If the kernel cannot open the book, the phone is read-only chrome, not a second store.

## Layout (when sequence 1 starts)

```text
packages/kernel/     TypeScript. Vitest. No window. No Svelte.
apps/phone/          Svelte 5 + SvelteKit. Places as routes.
api/talk.ts          The only cloud. OpenRouter-shaped; xAI first.
packs/field|roof|pest|solar
packs/fixtures/leaky
hosts.yaml           Host → pack id. Unknown host → field.
```

Routes from day one: `/today` `/door` `/inspect` `/plan`. Settings, Reference, Office, and the Talk sheet are not Places.

Five types only: **Place, Do, Chip, Go, Talk**. Buttons do. Links go. Chips fork the current task. Ghost captions are never actions.

## Packs

| id | Who it is | Proof |
| --- | --- | --- |
| `field` | Generic D2D. Default. | No trade nouns. SLAP. Cooling-off. |
| `roof` | Roof / storm canvasser. | Script B default; A after Keep; i35. Own mark, not the old dog unless this pack brings it. |
| `pest` | Pest D2D. | Stops / Inspects / Starts. Storms off. |
| `solar` | Solar D2D. | Pitch / Site / Route. Never invent kWh / ITC. Never the utility. |

`field`, `pest`, and `solar` fail CI if they say `knock`, `On the roof`, or `i35`. Packs cannot turn honesty off.

## Vercel

One project. Static PWA for the Places. One Node function for Talk. No host Postgres as the book. No `cargo` / `wasm-pack` step.

Until the phone exists, this repo serves the Field OS face from `index.html` so the project has a host that is **not** roofus.coach.

Talk keys (`XAI_API_KEY` or OpenRouter) are server-only. They never ship in the PWA. See [docs/GAPS.md](docs/GAPS.md) for why a public Talk URL is not enough.

## Sequence

1. TypeScript kernel: pack compile, empty Book, honesty strings, leak fixtures, CLI.
2. Svelte shell: four Places, five types, empty book, tour, routes that match words.
3. Journal + labor + pins + Copy this phone.
4. Talk fleet + memory retrieve.
5. Door / Inspect / Roleplay from compiled markdown.
6. Proof packs pest + solar + roof. `field` remains default.
7. Office desk: mark, load pack file, packet text ingest. Not a Place.

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
