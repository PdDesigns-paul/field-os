# Field OS — agent contract

This file is the law for any agent that touches this repository.

## What this repo is

A **new product**. White-label D2D coach and journal. Kernel in TypeScript. Phone in Svelte 5. Book is sql.js bytes in OPFS. Talk is the only cloud. Default pack is `field`.

## What this repo is not

- Not [PdDesigns-paul/Roofus](https://github.com/PdDesigns-paul/Roofus). Do not submodule, vendor, copy, or open a PR there.
- Not roofus.coach.
- Not a Grok App Builder scaffold. No TanStack Start, no React, no Zustand, no `src/lib/auth`, no `src/lib/db`, no better-auth, no Neon/Postgres as the live book.
- Not an estimator. No takeoff, no squares, no listing scrape.

## Language

Do not say: Truck, After, Rufus, Roofus (unless pointing at the old repo), login tab, theme, CRM, pipeline, takeoff.

Pack `roof` may say knock, i35, Script A/B, Keep/Toss. The kernel and packs `field` / `pest` / `solar` may not.

## The seam

```text
Pack  = compile(markdown + yaml) -> BrandPack
Book  = SQLite via sql.js
Talk  = honesty_kernel + pack.briefs[mode] + book.retrieve(query) + today
Copy  = export/import Book. Merge: fill blanks, keep higher counts.
```

Svelte may not persist the book itself. Svelte may not re-implement merge, compile, or honesty. If the kernel cannot open the book, the phone is read-only chrome.

## Routes

`/today` `/door` `/inspect` `/plan`. No `/login` Place, ever. Office is a desk URL, not a Place. Talk is a button, hidden on Inspect.

## Tests

CI is `packages/kernel` on Node 22. Vitest. sql.js. No Playwright. No browser in GitHub Actions. No `cargo`. No `wasm-pack`.

A good test observes the kernel contract: `compile` / `leak` / `resolve` / `open` / Copy merge / honesty / `modelFor(roleplay)`.

## Honesty

Locked in the kernel. Identical for every pack. Packs cannot set `honesty` and cannot turn cooling-off or “never the utility” off.

## Resolve

Pack id at build, or host allowlist in `hosts.yaml`, else `field`. Unknown id → `field`. Never silent roof. `grok.me` is not a pack host.

## Before you write code

1. Read [docs/SPEC.md](docs/SPEC.md) and [docs/GAPS.md](docs/GAPS.md).
2. Stay on the current sequence number. Do not skip to Talk because it is fun.
3. Do not add a second seam (no GraphQL, no pack CMS, no theme engine, no Svelte store that mirrors SQLite).
4. Do not add a sixth control type.

## Proof of done (later)

1. Default pack is generic D2D. No gold dog unless pack `roof` brought a mark.
2. `field` / `pest` / `solar` fail CI if they say knock / On the roof / i35.
3. Copy this phone restores labor + memory on a second browser profile.
4. Routes are `/today` `/door` `/inspect` `/plan`.
5. Kernel unit tests are CI. Vercel/Node build has no `cargo` / `wasm-pack`.
6. Zero files sourced from PdDesigns-paul/Roofus.
