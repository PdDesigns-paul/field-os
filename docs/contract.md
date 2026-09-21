Status: ready-for-agent. Do not implement from this chat. This spec is the book for **PdDesigns-paul/field-os**, an uncreated repository. **PdDesigns-paul/Roofus is not this product.** Do not open a PR there. Do not copy its tree.

Sources synthesized (not an interview): product contract and glossary from Roofus doctrine (Places, five types, local-first book, Talk, honesty); the Frankenstein diagnosis (estimator → porch journal → bolted packs); starred repos of [PdDesigns-paul](https://github.com/PdDesigns-paul?tab=stars) and Vercel templates as architecture analogs, not dependencies. FO-7 (Vercel): same seam, kernel in TypeScript, book as sql.js bytes in OPFS, one Talk function. No host Postgres as the book.

---

## Problem Statement

I am done editing Roofus. That repo is a roofing takeoff tool that grew a canvasser journal, then a coach, then white-label packs, then a labor clock, then pest and solar proofs. The phone still thinks Today lives at `/truck`. Curriculum is TypeScript. The gold dog is the kernel. A second shop still risks hearing “knock.”

I need a **new project in a new repo**: a white-label door-to-door coach and journal for new salespeople in any trade. New language. New architecture. Roofus.coach and the Roofus GitHub stay where they are. This product does not wear that dog unless a pack says so.

## Solution

Start **Field OS** in [PdDesigns-paul/field-os](https://github.com/PdDesigns-paul/field-os).

The phone is a ride-along journal + training pocket + coach for a new D2D hire. Four Places, five control types, offline book, Talk is the coach. A tenant pack is markdown the kernel compiles — brand, porch words, Door cards, inspect rows, labor units, optional modules. Default pack is generic D2D (`field`), not roofing. Proof packs (`roof`, `pest`, `solar`) must not leak another trade’s nouns.

The architecture is a clean break from React + Zustand + localStorage:

- **Kernel in TypeScript.** The book is SQLite via sql.js, persisted as bytes in OPFS — not Neon, not a JSON blob in localStorage. Packs compile from markdown + YAML. Honesty, leak tests, backup, and coach context live in the kernel. Tests run in CI without a browser. No account. No telemetry. (OpenLogi analog.)
- **Phone in Svelte 5.** A thin shell: Places as routes, five-type kit, pack-driven screens. It is a renderer of kernel state and pack schema, not a second source of truth. (json-render analog: catalog of Place / Do / Chip / Go / Talk; pack JSON is the spec.)
- **Curriculum is one markdown source** per pack, compiled to cards, beats, help, and coach briefs. (docmd analog.)
- **Coach memory is a local layer** in SQLite the kernel retrieves. Not FAQs pasted into a novel-length prompt. (supermemory / mem0 analog.)
- **Talk is the only cloud.** Cheap Live, dear Roleplay, no picker. OpenRouter-shaped routing; xAI is the first provider. On-device Live is a later door (needle), not V1.

Roofus is a research archive for porch craft. It is not a dependency and not tenant zero of this repo.

## User Stories

1. As a new D2D hire, I want a phone journal that works with no signal, so that a dead tower is not a dead day.
2. As a new D2D hire, I want the first screen to be Today, so that I start on the log, not a dashboard or a login wall.
3. As a new D2D hire, I want five job slides on first open (who I am, drop a pin, what to say at the door, talk to the coach, the honest reason we stop), so that nobody makes me memorize tab names.
4. As a new D2D hire, I want Skip on every slide, so that a second-week hire is not trapped in a tour.
5. As a new D2D hire, I want Setup on Today until name, company, and one county exist, so that the book is mine before I log a door.
6. As a new D2D hire, I want four Places on one bottom bar — Today, Door, Inspect, Plan — so that I always know where I am.
7. As a new D2D hire, I want the coach as a Talk button, not a fifth tab, so that I can ask without leaving the street.
8. As a new D2D hire, I want tap-to-fan Live / Roleplay / Mindset and hold-to-start Live, so that the coach is one motion in a driveway.
9. As a new D2D hire, I want Door cards that already fill my name and company, so that I can say the line without editing on the porch.
10. As a new D2D hire, I want every Door card to be hook → honest reason → one open question, so that I do not dump a pitch.
11. As a new D2D hire, I want Hear this line, so that I rehearse the sound, not just the words.
12. As a new D2D hire, I want hold-to-talk that looks like a hold plate, so that I can dictate a note without typing.
13. As a new D2D hire, I want Pin on Today to drop GPS and open that house on that page, so that the sidewalk log is the house in front of me.
14. As a new D2D hire, I want pin status (no-answer, talked, look, set, revisit, skip) to write Today’s count once, so that two logs of the same talk is impossible.
15. As a new D2D hire, I want count tiles I can tap with no pin, so that a day of doors still counts if I did not drop houses.
16. As a new D2D hire, I want Start day and End day under the date, so that the clock is what I worked.
17. As a new D2D hire, I want Pause as a chip, so that lunch is not billed as a knock window.
18. As a new D2D hire, I want elapsed time on Today, so that I can see the shift I am in.
19. As a new D2D hire, I want Night on Today to open Finish the day on Plan, so that After Action Report is a night ritual, not a Today form.
20. As a new D2D hire, I want Plan to be a map of pins I dropped, walks grouped by distance, so that I park once.
21. As a new D2D hire, I want Near me and Use today as chips, so that tomorrow is a loop I already have, not a Census hunt.
22. As a new D2D hire, I want Inspect rows for this trade, ticked on the open pin, so that the walk is this house.
23. As a new D2D hire, I want Talk hidden on Inspect, so that it does not cover the shutter.
24. As a new D2D hire, I want Roleplay beats I can Knock, hold-to-talk, and Score me, so that practice happens off the porch.
25. As a new D2D hire, I want Practice locked when the office has it off, so that I do not roleplay in a driveway by accident.
26. As a new D2D hire, I want Mindset worksheets private (Why, demon, Pace, Talent stack), so that that voice never reaches a homeowner.
27. As a new D2D hire, I want the coach to read today’s log, the open pin, mindset, and shop memory — never the public web — so that he does not invent a street.
28. As a new D2D hire, I want the coach to refuse fake neighbors, fake storms, “we’re working next door,” invented years, prices, kWh, chemicals, and infestations, so that I do not get the shop sued.
29. As a new D2D hire, I want the coach to say the cooling-off rule on a door-to-door sale and never coach a waiver, so that I stay legal.
30. As a new D2D hire, I want the coach to never claim we are the utility, so that no solar pack can lie that way.
31. As a new D2D hire, I want Copy this phone as a SQLite dump or JSON file, so that a dead phone is not a dead year.
32. As a new D2D hire, I want Last copy as a line on You, so that I know when the lifeboat was written.
33. As a new D2D hire, I want Restore onto a live day to demand a typed confirm, so that I do not wipe a shift.
34. As a new D2D hire, I want Reminders only when the matching box is empty, and evening journal only after I logged work, so that a blank first hour after 5pm is Setup, not an After Action Report.
35. As a new D2D hire on pack `field`, I want generic door craft (say who I am, honest reason, one open question, leave on a no), with no roof, pest, or solar nouns, so that I am clearly in a kernel, not a reskin.
36. As a new D2D hire on pack `roof`, I want Script B (age / free look) as the default and Script A only after Keep on a matching zip, so that I do not run insurance talk on a retail street.
37. As a new D2D hire on pack `roof`, I want i35 after photos and three options from what they already agreed they saw, so that I do not dump a close on a cold face.
38. As a new D2D hire on pack `pest`, I want Stops / Inspects / Starts and foundations, not storms, so that I am in pest.
39. As a new D2D hire on pack `solar`, I want Pitch / Site / Route, Surveys, and four qualifiers then leave, so that I do not invent kWh or a 2026 ITC.
40. As a new D2D hire in any pack, I want Today’s tiles labeled from my pack’s labor units, so that I never tap “On the roof” for a solar survey.
41. As a new D2D hire, I want Help and Menu in the header, and Back only on Settings, Reference, and nested pages, so that the four Places never grow a back button.
42. As a new D2D hire, I want one filled primary Do per screen, so that I can still see the action in sun with a thumb.
43. As a new D2D hire, I want the coach to remember shop facts I saved, across days, so that I do not re-teach him every morning.
44. As a new D2D hire, I want Trail off until I tap it, foreground only, so that a locked phone stops the line, not the clock.
45. As a new D2D hire, I want Hours to show this week’s numbers first-party, so that the person who worked the shift can see it.
46. As a new D2D hire, I want Last 30 to survive prune via a compact rollup, so that old fat days do not erase the month.
47. As an owner-operator, I want an owner chip on You that reads This phone when signed out, so that whose book this is is visible without a login Place.
48. As an owner-operator, I want Switch book as a chip when another owner is already on this phone, with typed confirm, so that a shared truck phone does not merge two years.
49. As an owner-operator, I want Office as a desk URL, not a Place and not a canvasser Settings row, so that rookies do not pick a theme.
50. As an owner-operator, I want to set mark and PWA name for a tenant from the desk, locally, so that a pest shop does not wear a roofing dog.
51. As an owner-operator, I want the default pack’s metal to be simple and honest, not a stolen Roofus gold, so that this product has its own face.
52. As an owner-operator, I want Notion optional and behind a toggle, never the only lifeboat, so that I am not pasting a secret to survive.
53. As an owner-operator, I want labor segments and the Hours rollup in the copy, not thousands of trail points, so that I can defend hours.
54. As an owner-operator, I want a photographed script or PDF ingested to markdown the coach can name by title, so that “I read your flyer” is only true when there is text.
55. As an owner-operator, I want Roleplay expensive and Live cheap, with no model picker, so that practice can be dear and the driveway stays fast.
56. As an owner-operator, I want one appointment from a day of doors to still count as a winning day in the coach’s mouth, so that a rookie is not crushed by a dashboard.
57. As an owner-operator, I want optional modules (storms, claim, internachi, packets) as flags, so that pest does not inherit hail.
58. As an owner-operator, I want a custom-domain alias to resolve a pack from the host on one deploy, so that I do not buy a second site.
59. As an owner-operator, I want this product on its own host, not roofus.coach, so that Roofus can stay a roofing tenant elsewhere.
60. As a pack author, I want one markdown + YAML folder to compile into Door cards, Roleplay beats, inspect rows, tour, help, and briefs, so that I do not fork five source files.
61. As a pack author, I want a Pack contract the kernel only consumes, so that a new trade is a folder, not a fork of the phone.
62. As a pack author, I want place labels, talk name, mark, tokens, labor units, and copy keys in the pack, so that chrome can change without a sixth control type.
63. As a pack author, I want kernel honesty out of my pack, so that I cannot turn cooling-off or “never the utility” off.
64. As a pack author, I want a leak test that fails if `pest` or `solar` still say knock / On the roof / i35, so that a reskin cannot ship.
65. As a pack author, I want InterNACHI MRI, NABCEP/SEI, NPMA/EPA Core, Taggart D2DU, and Bensman/Bryant as named public analogs I may distill — not licensed PDF dumps — so that Reference is honest.
66. As a pack author, I want storms, claim, internachi, and packets off unless the pack turns them on, so that a new trade does not inherit roof modules.
67. As a pack author, I want to compile a pack on my laptop with a CLI and see leak/honesty fail before a phone ever loads it, so that CI is the kernel, not the shell.
68. As a trainer, I want the same book the canvasser sees, so that I am not reading a hidden admin ledger.
69. As a trainer, I want GPS never sent as lat/lng to the coach, so that I coach minutes and segments, not a stalker map.
70. As a trainer, I want empty clocks to graph as gaps, not 0h bars, so that Hours is honest.
71. As Field OS, I want five types only — Place, Do, Chip, Go, Talk — so that a shop cannot invent a sixth control.
72. As Field OS, I want buttons to do, links to go, chips to fork the current task, and ghost captions never to be actions, so that a thumb in sun can find the tap.
73. As Field OS, I want SQLite on the phone as the live book, so that a JSON blob in localStorage cannot become the database again.
74. As Field OS, I want no `/login` Place, ever, so that account is a chip on You or it is This phone.
75. As Field OS, I want routes named `/today`, `/door`, `/inspect`, `/plan` from day one, so that file names and tab words match.
76. As Field OS, I want CI to test the TypeScript kernel against `field`, `roof`, `pest`, and `solar` fixtures, so that a leak fails the build without opening a browser.
77. As Field OS, I want no takeoff, no square-count, no scrape of listing sites, so that the estimator this industry came from cannot crawl in.
78. As Field OS, I want no UserButton, Stripe sheet, or pricing Place, so that entitlement never becomes a tab.
79. As Field OS, I want no Grok App Builder scaffold, no better-auth, no host Postgres as the book, so that this repo cannot grow those organs in the dark.
80. As Field OS, I want Talk generation to be the only thing that dies offline — cards, ticks, clock, and last memory still work — so that the pocket still speaks.
81. As Field OS, I want Live / Roleplay / Mindset to share one memory layer and three briefs, so that the coach is a small fleet, not one novel.
82. As a pack author, I want `field` to ship as the default so a blank build is generic D2D, so that roofing cannot accidentally be the kernel again.
83. As an owner-operator, I want a pack file I can load on the desk, so that a shop can be a folder, not a rebuild.
84. As a new D2D hire, I want Compass visible on Door, so that I can read the job in the truck before the first house.
85. As Field OS, I want Copied backup to round-trip through the kernel, so that Svelte never invents a second merge algorithm.

## Implementation Decisions

### This is a new product

- New GitHub repo: `PdDesigns-paul/field-os`. Public. GitHub is the book.
- Do not submodule, vendor, or copy `PdDesigns-paul/Roofus`. Porch craft may be rewritten into pack `roof` from public teaching + doctrine memory, not from that tree.
- Do not use roofus.coach as this product’s host. Roofus stays Roofus.
- Do not scaffold TanStack Start, React, Zustand, or Grok `src/lib/auth` / `src/lib/db`.

### Language and split

Two languages, one seam.

| Piece | Language | Why |
| --- | --- | --- |
| Kernel (book, pack compile, honesty, memory, backup, coach context) | **TypeScript** | Vercel/Node can compile it. Same leak / honesty / resolve tests. Local-first, testable without a browser, CLI in CI. Analog: OpenLogi. |
| Phone shell (Places, five-type kit, Talk UI, maps surface) | **Svelte 5 + SvelteKit (adapter-static PWA)** | Compiler UI, routes are Places, not a virtual-DOM journal. Analog: json-render’s Svelte renderer — catalog in, screen out. |
| Packs | **Markdown + YAML** | One source → cards, help, briefs, AI context. Analog: docmd. |
| Talk edge | **One function** | Stream tokens. No business rules. OpenRouter-shaped; xAI first. Analog: cheap/dear routing, no picker. |

The kernel is the source of truth. Svelte may not persist the book itself. If the kernel cannot open the book, the phone is read-only chrome, not a second store.

Python stays out of the phone. Packet ingest (MinerU analog) may later be an optional office CLI in any language; V1 ingest is “paste or upload text,” not a Python service in-process.

### The one seam

The kernel exposes one contract the phone and CI both call:

```text
Pack  = compile(markdown + yaml) -> BrandPack
Book  = SQLite via sql.js (OPFS bytes; owners, days, counts, pins, labor windows, memory, mindset)
Talk  = honesty_kernel + pack.briefs[mode] + book.retrieve(query) + today
Copy  = export/import Book (JSON or db file). Merge: fill blanks, keep higher counts.
```

`BrandPack` shape (from the Roofus prototype — keep the shape, not the files):

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

Do not add a second seam (no GraphQL, no pack CMS, no theme engine, no Svelte store that mirrors SQLite).

### Book (SQLite)

Relational, owner-scoped. Engine is sql.js. Live bytes live in OPFS. Not Neon. Not host Postgres. Not a JSON blob in localStorage.

- `owner` (id, label; empty id = This phone)
- `day` (date, counts as generic integers keyed by unit id, notes, aar)
- `labor_window` (start, end, pause segments; breaks derived)
- `pin` (lat/lng optional, address, year, status, note, look, inspect ticks)
- `memory` (title, tags, body, source: typed | packet | faq)
- `mindset` (why, demon, pace, stack)
- `copy_log` (last copy at, channel: file | optional notion)

Trail points, if later, are a separate table that **does not** export to Talk or to Notion.

### Phone chrome

- Routes: `/today` `/door` `/inspect` `/plan`. Settings / Reference / Office / Talk sheet are not Places.
- Five types, no sixth. Brand tokens from pack. Types may not change.
- Talk FAB; hidden on Inspect. Hold starts Live.
- Count tiles: the tile is the control.
- Squint test is the UI law. No 19-button kit.

### Coach

- Honesty prompt is short, locked in the kernel, identical for every pack.
- Three briefs from the pack: live, roleplay, mindset.
- Tools read the posted book only. No web. No RAG until a named child.
- `modelFor(roleplay)` = dear; everything else cheap. Client cannot override.
- Voice: hold-to-talk and Hear this line. No voice clone. Do not record a homeowner.

### Packs shipped in this repo

| id | Who it is | Proof |
| --- | --- | --- |
| `field` | Generic D2D. Default. | No trade nouns. SLAP. Cooling-off. |
| `roof` | Roof / storm canvasser. | Script B default; A after Keep; i35. Not the Roofus dog unless this pack brings its own mark. |
| `pest` | Pest D2D. | Stops / Inspects / Starts. Storms off. |
| `solar` | Solar D2D. | Pitch / Site / Route. Never invent kWh / ITC. Never the utility. |

A second tenant that still says “knock” and “On the roof” is a failed proof. Stop.

### Deploy

- Static PWA (SvelteKit adapter-static) + TypeScript kernel + sql.js book + one Talk serverless function.
- Vercel/Node build. No `cargo` / `wasm-pack` step.
- One project. Host header may select pack. No second site for a second trade.
- No roofus.coach. No grok.me as a pack host.

### Sequence (later chats, not this one)

1. TypeScript kernel: Pack compile, empty Book, honesty strings, leak fixtures, CLI.
2. Svelte shell: four Places, five types, empty book, tour, routes that match words. Wired to the kernel.
3. Journal + labor + pins + Copy this phone.
4. Talk fleet + memory retrieve.
5. Door / Inspect / Roleplay from compiled markdown.
6. Proof packs pest + solar + roof. `field` remains default.
7. Office desk: mark, load pack file, packet text ingest. Not a Place.

## Testing Decisions

A good test observes the kernel contract, not the component tree. **CI is the TypeScript kernel.** No Playwright. No browser in GitHub Actions. Squint / grayscale / thumb-in-sun stay human checks on the live phone.

**One seam:** `compile(pack) + Book + Talk context + Copy`.

Prior art does not exist in this repo. Do not import Roofus `*.test.ts`. Write kernel tests that:

- Compile `field` / `roof` / `pest` / `solar` / a leaky fixture.
- Fail compile on an invalid pack, not at runtime.
- Assert honesty strings present for every pack (FTC 429, never the utility, no fake neighbor, empty packet refusal).
- Assert `field`, `pest`, `solar` compiled surfaces contain none of `knock`, `On the roof`, `i35`, `hail`, `adjuster` unless that pack opted into the matching module (only `roof` does).
- Assert labor unit labels come from the pack; storage is generic unit ids; Start/End/Pause produce ISO windows; breaks are derived.
- Assert owner prefix; empty owner is This phone; Switch book / Restore require typed confirm when the day has counts or pins.
- Assert Copy round-trip includes labor + memory + pins; merge keeps higher counts; trail absent.
- Assert Talk tools see only posted book fields; `modelFor(roleplay)` is dear; no client override.
- Assert default resolve is `field`; unknown host is `field`; grok.me is not a pack host.

Svelte is allowed a tiny unit test on the five-type class map if it stays pure. It may not re-implement merge, compile, or honesty.

## Out of Scope

- Implementing this spec in this chat.
- Any commit to `PdDesigns-paul/Roofus`.
- Moving or sharing roofus.coach.
- TanStack Start, Zustand, Grok App Builder scaffold, better-auth, Neon/Postgres as the live book.
- `/login` as a Place, UserButton, Stripe, pricing grid.
- Payroll-grade timekeeping.
- Takeoff / squares / estimator. Listing-site scrape.
- Recording a homeowner. Robocalls. Cooling-off waiver coaching.
- Voice cloning. Needle on-device model as a V1 dependency.
- Embedding n8n, Orca, Octop, json-render-the-library, or a model picker. Steal the *idea*, not the library.
- A sixth control type. A theme picker on the canvasser phone.
- Playwright in CI.
- Making Roofus (the dog) the default pack of this repo.

## Further Notes

### Why this split

Roofus taught the product. It also taught that a React journal with JSON blobs and TypeScript packs will accrete `/truck` aliases and a 21k prompt. The kernel owns the book so an agent cannot quietly invent a second store. Svelte owns chrome so Places are files. Markdown owns training so a shop is a folder. Vercel is Node: the kernel is TypeScript so the build we actually ship can run. The book stays SQLite on the phone.

### Starred-repo analogs (ideas, not dependencies)

| Star | Steal this |
| --- | --- |
| OpenLogi | Local-first. No account. No telemetry. Plain config. |
| docmd | One markdown source → cards, help, coach context. |
| json-render | Phone is a renderer of a catalog + JSON spec. Catalog = five types. |
| supermemory / mem0 | Memory is retrieve/write on the device, not prompt stuffing. |
| MinerU | Office packet → markdown. V1 can be pasted text; CLI later. |
| needle | Future cheap on-device Live. Not V1. |
| VoiceStudio | Dictation + Hear this line. No clone. |
| n8n / n8n-as-code | Office jobs as data: copy, ingest, restore. No canvas on the phone. |
| Octop / orca | Talk modes as a small fleet sharing memory. |
| OpenRouter | Cost routing without a picker. |
| public-apis | Storms/GIS optional modules on open data. |

### Vercel Templates

| Template | Link | Steal this |
| --- | --- | --- |
| Platforms Starter Kit | https://vercel.com/templates/next.js/platforms-starter-kit | Multi-Tenant Starter Kit; Tailwind; Shadcn |
| Morphic AI Search | https://vercel.com/templates/next.js/morphic-ai-answer-engine-generative-ui | AI-powered search with grounded, cited answers (offline MD index of webpages that the AI is allowed to crawl and return detailed answer); Generative UI |

### Glossary

Kernel, pack, Places, Do, Chip, Go, Talk, book, You, This phone, Switch book, Copy this phone, Last copy, labor units, owner chip, Office desk, After Action Report, Working loop, Pin, packs `field` / `roof` / `pest` / `solar`.

Pack `roof` may say knock, i35, Script A/B, Keep/Toss. The kernel and packs `field` / `pest` / `solar` may not.

Do not say Truck, After, Rufus, Roofus (unless describing the old repo), login tab, theme, CRM, pipeline, takeoff.

### Proof of done (when an agent later implements)

1. This repo runs a phone whose default pack is generic D2D. No gold dog unless pack `roof` brought a mark.
2. `field` / `pest` / `solar` compiled packs fail CI if they say knock / On the roof / i35.
3. Copy this phone restores labor + memory on a second browser profile.
4. Routes are `/today` `/door` `/inspect` `/plan`.
5. Kernel unit tests (`compile` / `leak` / `resolve` / `open` / Copy merge) are CI. No Playwright. Vercel/Node build has no `cargo` / `wasm-pack` step.
6. Zero files sourced from PdDesigns-paul/Roofus.

