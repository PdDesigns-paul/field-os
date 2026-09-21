# @field-os/kernel

TypeScript kernel for Field OS. Phone and CI call the same contract.

```text
Pack  = compile(markdown) -> BrandPack
Book  = SQLite via sql.js
Talk  = honesty + pack briefs + posted book
Copy  = JSON export / merge / restore
```

Copy merge fills blanks, keeps higher counts, collapses same-date days, and does not wipe. Hours journal uses `ms: null` gaps, not 0h. Reminders: Setup until the book is mine; Finish the day only after logged work and after 17:00. Working loop is `loop_pin`. Reference is pack-distilled analogs, not a fifth Place.

```sh
npm install
npm test
```

Default pack is `field`. Unknown id and grok.me resolve to `field`. Packs `field` / `pest` / `solar` fail compile if they say knock / On the roof / i35. Honesty (16 CFR 429, never the utility, no fake neighbor) is locked here and cannot be turned off by a pack.
