# Contributing

This repo is the book. GitHub issues are the sequence. Do not start Talk because it is more fun than leak tests.

## Rules

1. Read [AGENTS.md](AGENTS.md) and [docs/SPEC.md](docs/SPEC.md).
2. Stay on the current sequence number.
3. Kernel tests must pass without a browser.
4. Do not copy [PdDesigns-paul/Roofus](https://github.com/PdDesigns-paul/Roofus).
5. Packs `field`, `pest`, and `solar` must not say knock / On the roof / i35.
6. Do not add a sixth control type.

## Local (once sequence 1 exists)

```text
npm test --workspace packages/kernel
npx tsx packages/kernel/src/cli.ts check
npx tsx packages/kernel/src/cli.ts check packs/fixtures/leaky   # must fail
```

Phone (sequence 2):

```text
cd apps/phone
npm install
npm run dev
```

`/` redirects to `/today`.
