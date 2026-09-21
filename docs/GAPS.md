# Gaps, risks, and better ideas

The spec is strong on doctrine (Places, five types, local book, honesty, leak tests). These are the holes that will hurt on a real phone or a Vercel bill. Decisions, not bikesheds.

## 1. Talk cannot be a public URL

The spec wants no account and Talk as the only cloud. A function at `/api/talk` on a public host is a credit firehose. IP rate limits will not save a hobby xAI key once a pack is interesting.

**Better:** a **shop grant**, not a login Place. Office mints a token into the pack file or a local desk PIN. The phone stores it in the book and sends it as a bearer. The function ignores `body.model` and checks the grant. Rotate from the desk. Still no `/login`.

Without this, sequence 4 should not ship.

## 2. adapter-static fights Talk and host-pack resolve

`adapter-static` cannot be the Talk function. You then keep two build graphs (`apps/phone` + `api/talk.ts`) and fake host routing in the client.

**Better:** **SvelteKit `adapter-vercel`** with Places prerendered and one server route for Talk. Same project, same deploy, Host header available at the edge. Custom-domain → pack is then a `hosts.yaml` lookup in middleware, not a guess after first paint.

Keep the PWA: navigation fallback, SW that **does not cache** `/api/talk`.

## 3. OPFS is not a disk

Safari and storage pressure will eat Origin Private File System. Incognito and “Clear History” wipe a season. The spec treats OPFS as the book. Copy this phone is the real durability story, and people will not Copy every night.

**Better:**

- OPFS primary, **IndexedDB snapshot of last export** as fallback. `open()` tries OPFS then IDB. Still not localStorage JSON as the live book.
- Debounced export after each mutation, with a write lock. sql.js is in-memory; a crash between exports drops the last doors.
- You shows **book health**: last write, last copy, storage engine in use.
- Schema `user_version` and ordered migrations in the kernel from day one. Copy import of an older dump must migrate, not brick.

## 4. Do not bundle every pack in the PWA

If `field`, `roof`, `pest`, and `solar` all ship in the JS, a pest canvasser can read i35 in DevTools. Leak tests at compile time do not hide nouns in the bundle.

**Better:** middleware (or `/api/resolve`) picks the pack. The phone fetches **one** compiled JSON. Office “load pack file” is a local override. Other packs stay on the CDN unused.

## 5. A day should be a labor window

Calendar `YYYY-MM-DD` rolls at midnight. Night work and a 9pm last door will split a shift or write tomorrow’s counts on today’s card, depending on timezone. UTC is worse.

**Better:** Start day opens a day; End day closes it. The date on the card is the **start** date. Store the tz offset at Start. Do not auto-roll at 00:00.

Hours: empty clocks graph as **gaps**, not 0h bars (spec already says this — keep it). Label Hours as a journal of the shift, not payroll. If Copy is used to “defend hours,” it is evidence; do not wink at FLSA.

## 6. Voice is a second cloud, and iPhone PWA is weak

Chrome Speech Recognition is Google’s cloud. That is telemetry-adjacent and not offline. iOS installed PWAs barely do STT. “Hear this line” via speechSynthesis is robotic on a porch.

**Better:**

- Hold-to-talk: Web Speech when it exists; **big typed note** when it does not. Do not pretend the driveway is a voice OS.
- Hear this line: prefer a shop-recorded clip on the pack over TTS. TTS as fallback.
- Never send audio of a homeowner. Dictation is the canvasser’s mouth, on their phone, after they leave the stoop.

Talk generation is the only **named** thing that dies offline. Be honest that dictation often dies too.

## 7. Plan is a list. The map is a luxury.

OSM tiles have a usage policy. MapTiler is another key. Offline tiles are huge. Background geolocation is not a PWA. Trail “foreground only” is correct — a locked phone will not be a stalker GPS, and you should not promise it.

**Better:** Plan is **pins grouped by distance**, list-first. Map chip when online. Distance uses the last fix. Coach never sees lat/lng (spec). Notion copy strips coordinates. Do not block Plan on a map vendor.

## 8. Count tiles vs pin status will double-write

Tile taps (no pin) and pin status (no-answer, talked, look, set, revisit, skip) both want to move Today’s numbers.

**Better:** the kernel owns `count_write(unit, source: tile | pin, pin_id?)`. A pin has at most one unit write. Changing status moves the write, it does not add. Tiles are unlocated counts. Tests for this belong in sequence 3, not in Svelte.

## 9. Office has no door on it

“Office is a desk URL, not a Place” is right. With no account, `/office` is a theme picker for whoever has the link — the thing the spec forbids on the canvasser phone.

**Better:** a **desk PIN** hashed in the book. `/office` asks for it. Canvasser Settings does not link there. Still not `/login`.

## 10. Photos will blow the quota

“Talk hidden on Inspect so it does not cover the shutter” implies camera. Full-res house photos in OPFS will evict the book.

**Better for V1:** ticks only. Photos stay in the camera roll. If photos land later, they are not in the SQLite book and they do not go to Talk or Notion.

## 11. Cooling-off is US federal, not a lawyer

16 CFR 429 is a floor. Some states give more days. Canada / UK / AU are different. A pack must not disable it. The kernel should not invent a 50-state matrix.

**Better:** V1 says the federal rule and “your state may give more.” Never coach a waiver. Jurisdiction packs are a later door, not a V1 flag.

## 12. Reminders without a push service

Web Push is another cloud and iOS needs an installed PWA plus permission. The spec says Talk is the only cloud.

**Better:** in-app banners when they open the phone. Evening journal only after logged work (spec). No push vendor in V1.

## 13. sql.js size and first open

The WASM is a cold-start hit on a cheap Android. Load it once, keep the module. Do not new-up sql.js per tap. Show a quiet “opening the book” on first launch, then stay up.

## 14. Host name

Not roofus.coach. Pick a host before pack `roof` ships a mark that looks like the old dog. `field-os.vercel.app` is fine for V1. A custom domain is a Vercel project setting, not a second site.

Hobby accounts: deployment protection and preview URLs. The canvasser PWA must be the production URL they install. Do not teach them to install a preview.

## 15. License vs white-label

MIT on the kernel is simple. A shop’s mark, scripts, and packet text are **not** MIT just because they sat in `/packs`. Keep tenant files out of the default tree, or mark them as examples. Distill InterNACHI / NABCEP / NPMA / Taggart / Bensman — do not commit their PDFs.

## 16. What I would not change

These are already the right calls. Do not reopen them.

- TypeScript kernel (not Rust/WASM) so Vercel/Node CI is one language
- sql.js in the phone, not Neon as the book
- `field` as default; leak tests on `pest` / `solar`
- Honesty locked in the kernel
- Four Places, five types, Talk as a button
- No `/login` Place
- Copy merge in the kernel
- No Playwright in CI
- Roofus is an archive, not tenant zero

## Recommended sequence tweak

Keep 1–7. Add these as kernel work **inside** those numbers, not as new epics:

| When | Extra |
| --- | --- |
| 1 | `user_version`, migrations, resolve from `hosts.yaml`, leak fixtures |
| 2 | Dynamic manifest per pack (PWA name/mark). Do not ship one gold icon. |
| 3 | Dual persist (OPFS + IDB snapshot), count_write, labor window = day |
| 4 | Shop grant + ignore client `model` + context cap. No lat/lng in the prompt. |
| 5 | Typed fallback for hold-to-talk. Shop audio for Hear this line. |
| 6 | Pack JSON fetched, not bundled. Leak test on compiled surfaces **and** on shipped bytes. |
| 7 | Desk PIN. Pack file load. Packet **text** ingest only. |

## Open questions for Paul

1. Host: stay on `*.vercel.app` until a domain, or buy one now?
2. Talk spend: shop grant in V1, or hard-off Talk until Office exists?
3. Photos in V1: ticks only, yes?
4. Shared truck phone: two books in OPFS is enough, or also a “this is a shop phone” lock on You?
