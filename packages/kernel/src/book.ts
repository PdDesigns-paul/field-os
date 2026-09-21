import type { Database, SqlJsStatic, SqlValue } from "sql.js";
import type { BrandPack, MemoryRow, PinStatus } from "./types.ts";

const SCHEMA = `
PRAGMA user_version = 1;
CREATE TABLE IF NOT EXISTS owner (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL DEFAULT 'This phone',
  name TEXT NOT NULL DEFAULT '',
  company TEXT NOT NULL DEFAULT '',
  county TEXT NOT NULL DEFAULT '',
  pack_id TEXT NOT NULL DEFAULT 'field',
  talk_key TEXT NOT NULL DEFAULT '',
  tour_done INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS day (
  id TEXT PRIMARY KEY,
  started_at TEXT NOT NULL,
  ended_at TEXT,
  tz TEXT NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  aar TEXT NOT NULL DEFAULT ''
);
CREATE TABLE IF NOT EXISTS day_count (
  day_id TEXT NOT NULL,
  unit_id TEXT NOT NULL,
  n INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day_id, unit_id)
);
CREATE TABLE IF NOT EXISTS labor_window (
  id TEXT PRIMARY KEY,
  day_id TEXT NOT NULL,
  start TEXT NOT NULL,
  end TEXT,
  kind TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS pin (
  id TEXT PRIMARY KEY,
  day_id TEXT,
  lat REAL,
  lng REAL,
  address TEXT NOT NULL DEFAULT '',
  year TEXT NOT NULL DEFAULT '',
  status TEXT,
  note TEXT NOT NULL DEFAULT '',
  look TEXT NOT NULL DEFAULT '',
  unit_id TEXT,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS inspect_tick (
  pin_id TEXT NOT NULL,
  row_id TEXT NOT NULL,
  done INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (pin_id, row_id)
);
CREATE TABLE IF NOT EXISTS memory (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  tags TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL,
  source TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS mindset (
  k TEXT PRIMARY KEY,
  v TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS copy_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  at TEXT NOT NULL,
  channel TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS loop_pin (
  pin_id TEXT PRIMARY KEY,
  n INTEGER NOT NULL
);
`;

let SQL: SqlJsStatic | null = null;

export async function loadSql(locateFile?: (file: string) => string): Promise<SqlJsStatic> {
  if (SQL) return SQL;
  const { default: initSqlJs } = await import("sql.js");
  SQL = await initSqlJs(locateFile ? { locateFile } : undefined);
  return SQL;
}

function uid(): string {
  return crypto.randomUUID();
}

function nowIso(): string {
  return new Date().toISOString();
}

function sqlVal(v: unknown): SqlValue {
  if (v == null) return null;
  if (typeof v === "number" || typeof v === "string") return v;
  if (typeof v === "boolean") return v ? 1 : 0;
  return String(v);
}

export type Owner = {
  id: string;
  label: string;
  name: string;
  company: string;
  county: string;
  packId: string;
  talkKey: string;
  tourDone: boolean;
};

export type PinRow = {
  id: string;
  dayId: string | null;
  lat: number | null;
  lng: number | null;
  address: string;
  year: string;
  status: PinStatus | null;
  note: string;
  look: string;
  unitId: string | null;
  createdAt: string;
};

export type Reminder = "setup" | "night" | null;

export type PinGroup = {
  id: string;
  label: string;
  pins: PinRow[];
};

export type DayRow = {
  id: string;
  startedAt: string;
  endedAt: string | null;
  tz: string;
  notes: string;
  aar: string;
  counts: Record<string, number>;
};

export class Book {
  readonly db: Database;
  private constructor(db: Database) {
    this.db = db;
  }

  static async open(bytes?: Uint8Array | null, locateFile?: (f: string) => string): Promise<Book> {
    const sql = await loadSql(locateFile);
    const db = bytes?.length ? new sql.Database(bytes) : new sql.Database();
    db.run(SCHEMA);
    const book = new Book(db);
    book.migrate();
    book.ensureOwner();
    return book;
  }

  exportBytes(): Uint8Array {
    return this.db.export();
  }

  private migrate(): void {
    this.db.run(`CREATE TABLE IF NOT EXISTS loop_pin (
      pin_id TEXT PRIMARY KEY,
      n INTEGER NOT NULL
    )`);
    this.db.run("PRAGMA user_version = 2");
  }

  private ensureOwner(): void {
    const row = this.db.exec("SELECT id FROM owner LIMIT 1");
    if (!row.length || !row[0].values.length) {
      this.db.run("INSERT INTO owner (id, label) VALUES (?, ?)", ["", "This phone"]);
    }
  }

  owner(): Owner {
    const r = this.one(
      "SELECT id, label, name, company, county, pack_id, talk_key, tour_done FROM owner LIMIT 1",
    );
    return {
      id: String(r.id ?? ""),
      label: String(r.label ?? "This phone"),
      name: String(r.name ?? ""),
      company: String(r.company ?? ""),
      county: String(r.county ?? ""),
      packId: String(r.pack_id ?? "field"),
      talkKey: String(r.talk_key ?? ""),
      tourDone: Number(r.tour_done) === 1,
    };
  }

  setupComplete(): boolean {
    const o = this.owner();
    return Boolean(o.name && o.company && o.county);
  }

  saveOwner(patch: Partial<Owner>): void {
    const o = { ...this.owner(), ...patch };
    this.db.run(
      "UPDATE owner SET label=?, name=?, company=?, county=?, pack_id=?, talk_key=?, tour_done=?",
      [o.label, o.name, o.company, o.county, o.packId, o.talkKey, o.tourDone ? 1 : 0],
    );
  }

  openDay(): DayRow | null {
    const r = this.maybe("SELECT * FROM day WHERE ended_at IS NULL ORDER BY started_at DESC LIMIT 1");
    if (!r) return null;
    return this.hydrateDay(r);
  }

  lastDay(): DayRow | null {
    const r = this.maybe("SELECT * FROM day ORDER BY started_at DESC LIMIT 1");
    return r ? this.hydrateDay(r) : null;
  }

  startDay(): DayRow {
    const open = this.openDay();
    if (open) return open;
    const id = uid();
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.db.run("INSERT INTO day (id, started_at, tz) VALUES (?, ?, ?)", [id, nowIso(), tz]);
    this.db.run("INSERT INTO labor_window (id, day_id, start, kind) VALUES (?, ?, ?, 'work')", [
      uid(),
      id,
      nowIso(),
    ]);
    return this.hydrateDay(this.one("SELECT * FROM day WHERE id=?", [id]));
  }

  pauseDay(): void {
    const day = this.openDay();
    if (!day) return;
    const open = this.maybe(
      "SELECT id FROM labor_window WHERE day_id=? AND end IS NULL AND kind='work' LIMIT 1",
      [day.id],
    );
    if (!open) return;
    this.db.run("UPDATE labor_window SET end=? WHERE id=?", [nowIso(), sqlVal(open.id)]);
    this.db.run("INSERT INTO labor_window (id, day_id, start, kind) VALUES (?, ?, ?, 'pause')", [
      uid(),
      day.id,
      nowIso(),
    ]);
  }

  resumeDay(): void {
    const day = this.openDay();
    if (!day) return;
    const pause = this.maybe(
      "SELECT id FROM labor_window WHERE day_id=? AND end IS NULL AND kind='pause' LIMIT 1",
      [day.id],
    );
    if (!pause) return;
    this.db.run("UPDATE labor_window SET end=? WHERE id=?", [nowIso(), sqlVal(pause.id)]);
    this.db.run("INSERT INTO labor_window (id, day_id, start, kind) VALUES (?, ?, ?, 'work')", [
      uid(),
      day.id,
      nowIso(),
    ]);
  }

  paused(): boolean {
    const day = this.openDay();
    if (!day) return false;
    return Boolean(
      this.maybe(
        "SELECT id FROM labor_window WHERE day_id=? AND end IS NULL AND kind='pause' LIMIT 1",
        [day.id],
      ),
    );
  }

  endDay(): void {
    const day = this.openDay();
    if (!day) return;
    this.db.run("UPDATE labor_window SET end=? WHERE day_id=? AND end IS NULL", [nowIso(), day.id]);
    this.db.run("UPDATE day SET ended_at=? WHERE id=?", [nowIso(), day.id]);
  }

  saveAar(text: string): void {
    const day = this.openDay() ?? this.lastDay();
    if (!day) return;
    this.db.run("UPDATE day SET aar=? WHERE id=?", [text, day.id]);
  }

  elapsedMs(): number {
    const day = this.openDay();
    if (!day) return 0;
    const rows = this.all("SELECT start, end, kind FROM labor_window WHERE day_id=? AND kind='work'", [
      day.id,
    ]);
    const t = Date.now();
    return rows.reduce((sum, w) => {
      const a = new Date(String(w.start)).getTime();
      const b = w.end ? new Date(String(w.end)).getTime() : t;
      return sum + Math.max(0, b - a);
    }, 0);
  }

  bumpTile(unitId: string, delta = 1): void {
    const day = this.openDay() ?? this.startDay();
    this.db.run(
      "INSERT INTO day_count (day_id, unit_id, n) VALUES (?, ?, ?) ON CONFLICT(day_id, unit_id) DO UPDATE SET n = n + excluded.n",
      [day.id, unitId, delta],
    );
  }

  countWrite(pack: BrandPack, pinId: string, status: PinStatus): void {
    const day = this.openDay() ?? this.startDay();
    const pin = this.one("SELECT unit_id FROM pin WHERE id=?", [pinId]);
    const prevUnit = pin.unit_id ? String(pin.unit_id) : null;
    const nextUnit = pack.labor.statusToUnit[status] ?? null;
    if (prevUnit && prevUnit !== nextUnit) {
      this.db.run("UPDATE day_count SET n = MAX(n - 1, 0) WHERE day_id=? AND unit_id=?", [
        day.id,
        prevUnit,
      ]);
    }
    if (nextUnit && nextUnit !== prevUnit) {
      this.db.run(
        "INSERT INTO day_count (day_id, unit_id, n) VALUES (?, ?, 1) ON CONFLICT(day_id, unit_id) DO UPDATE SET n = n + 1",
        [day.id, nextUnit],
      );
    }
    this.db.run("UPDATE pin SET status=?, unit_id=?, day_id=? WHERE id=?", [
      status,
      nextUnit,
      day.id,
      pinId,
    ]);
  }

  dropPin(input: { lat?: number; lng?: number; address?: string }): PinRow {
    const day = this.openDay() ?? this.startDay();
    const id = uid();
    this.db.run("INSERT INTO pin (id, day_id, lat, lng, address, created_at) VALUES (?, ?, ?, ?, ?, ?)", [
      id,
      day.id,
      input.lat ?? null,
      input.lng ?? null,
      input.address ?? "",
      nowIso(),
    ]);
    return this.pin(id)!;
  }

  pin(id: string): PinRow | null {
    const r = this.maybe("SELECT * FROM pin WHERE id=?", [id]);
    return r ? this.hydratePin(r) : null;
  }

  pins(): PinRow[] {
    return this.all("SELECT * FROM pin ORDER BY created_at DESC").map((r) => this.hydratePin(r));
  }

  savePinNote(id: string, note: string): void {
    this.db.run("UPDATE pin SET note=? WHERE id=?", [note, id]);
  }

  savePinAddress(id: string, address: string): void {
    this.db.run("UPDATE pin SET address=? WHERE id=?", [address, id]);
  }

  tickInspect(pinId: string, rowId: string, done: boolean): void {
    this.db.run(
      "INSERT INTO inspect_tick (pin_id, row_id, done) VALUES (?, ?, ?) ON CONFLICT(pin_id, row_id) DO UPDATE SET done=excluded.done",
      [pinId, rowId, done ? 1 : 0],
    );
  }

  ticks(pinId: string): Record<string, boolean> {
    const out: Record<string, boolean> = {};
    for (const r of this.all("SELECT row_id, done FROM inspect_tick WHERE pin_id=?", [pinId])) {
      out[String(r.row_id)] = Number(r.done) === 1;
    }
    return out;
  }

  setMindset(k: string, v: string): void {
    this.db.run("INSERT INTO mindset (k, v) VALUES (?, ?) ON CONFLICT(k) DO UPDATE SET v=excluded.v", [
      k,
      v,
    ]);
  }

  mindset(): Record<string, string> {
    const out: Record<string, string> = {};
    for (const r of this.all("SELECT k, v FROM mindset")) out[String(r.k)] = String(r.v);
    return out;
  }

  addMemory(title: string, body: string, source = "typed", tags = ""): void {
    this.db.run("INSERT INTO memory (id, title, tags, body, source) VALUES (?, ?, ?, ?, ?)", [
      uid(),
      title,
      tags,
      body,
      source,
    ]);
  }

  memories(): MemoryRow[] {
    return this.all("SELECT id, title, tags, body, source FROM memory ORDER BY title").map((r) => ({
      id: String(r.id),
      title: String(r.title),
      tags: String(r.tags ?? ""),
      body: String(r.body),
      source: String(r.source),
    }));
  }

  retrieve(query: string, limit = 4): MemoryRow[] {
    const q = tokens(query);
    if (!q.length) return [];
    const scored = this.memories()
      .map((m) => ({ m, score: scoreMemory(q, m) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score || a.m.title.localeCompare(b.m.title));
    return scored.slice(0, Math.max(0, limit)).map((x) => x.m);
  }

  markCopy(channel: "file" | "json"): void {
    this.db.run("INSERT INTO copy_log (at, channel) VALUES (?, ?)", [nowIso(), channel]);
  }

  lastCopy(): { at: string; channel: string } | null {
    const r = this.maybe("SELECT at, channel FROM copy_log ORDER BY id DESC LIMIT 1");
    return r ? { at: String(r.at), channel: String(r.channel) } : null;
  }

  hoursJournal(now = new Date()): { date: string; ms: number | null }[] {
    const days = this.all("SELECT id, started_at FROM day");
    const byDate = new Map<string, string[]>();
    for (const d of days) {
      const local = localDate(new Date(String(d.started_at)));
      const list = byDate.get(local) ?? [];
      list.push(String(d.id));
      byDate.set(local, list);
    }
    const out: { date: string; ms: number | null }[] = [];
    for (let i = 6; i >= 0; i--) {
      const cursor = new Date(now);
      cursor.setHours(12, 0, 0, 0);
      cursor.setDate(cursor.getDate() - i);
      const date = localDate(cursor);
      const ids = byDate.get(date);
      if (!ids?.length) {
        out.push({ date, ms: null });
        continue;
      }
      let ms = 0;
      for (const id of ids) {
        const windows = this.all(
          "SELECT start, end FROM labor_window WHERE day_id=? AND kind='work'",
          [id],
        );
        ms += windows.reduce((sum, w) => {
          const a = new Date(String(w.start)).getTime();
          const b = w.end ? new Date(String(w.end)).getTime() : Date.now();
          return sum + Math.max(0, b - a);
        }, 0);
      }
      out.push({ date, ms: ms > 0 ? ms : null });
    }
    return out;
  }

  reminder(now = new Date()): Reminder {
    if (!this.setupComplete()) return "setup";
    if (now.getHours() < 17) return null;
    const day = this.openDay() ?? this.lastDay();
    if (!day) return null;
    const pins = this.maybe("SELECT id FROM pin WHERE day_id=? LIMIT 1", [day.id]);
    const hasWork = Object.values(day.counts).some((n) => n > 0) || Boolean(pins);
    if (!hasWork) return null;
    if (day.aar.trim()) return null;
    return "night";
  }

  setLoop(pinIds: string[]): void {
    this.db.run("DELETE FROM loop_pin");
    pinIds.forEach((id, n) => {
      this.db.run("INSERT INTO loop_pin (pin_id, n) VALUES (?, ?)", [id, n]);
    });
  }

  loopPinIds(): string[] {
    return this.all("SELECT pin_id FROM loop_pin ORDER BY n").map((r) => String(r.pin_id));
  }

  useTodayLoop(): void {
    const day = this.openDay() ?? this.lastDay();
    if (!day) {
      this.setLoop([]);
      return;
    }
    this.setLoop(
      this.all("SELECT id FROM pin WHERE day_id=? ORDER BY created_at", [day.id]).map((r) =>
        String(r.id),
      ),
    );
  }

  groupedPins(origin: { lat: number; lng: number } | null): PinGroup[] {
    const pins = this.pins();
    const loopIds = new Set(this.loopPinIds());
    const loop = pins.filter((p) => loopIds.has(p.id));
    const rest = pins.filter((p) => !loopIds.has(p.id));
    const groups: PinGroup[] = [];
    if (loop.length) groups.push({ id: "loop", label: "Working loop", pins: sortPins(loop, origin) });
    if (!origin) {
      if (rest.length) groups.push({ id: "all", label: loop.length ? "Other pins" : "Pins", pins: rest });
      return groups;
    }
    const near: PinRow[] = [];
    const walk: PinRow[] = [];
    const far: PinRow[] = [];
    const noFix: PinRow[] = [];
    for (const p of rest) {
      const m = pinMeters(origin, p);
      if (m == null) noFix.push(p);
      else if (m < 400) near.push(p);
      else if (m < 1000) walk.push(p);
      else far.push(p);
    }
    const band = (id: string, label: string, list: PinRow[]) => {
      if (list.length) groups.push({ id, label, pins: sortPins(list, origin) });
    };
    band("near", "Near", near);
    band("walk", "Walk", walk);
    band("far", "Farther", far);
    band("no-fix", "No fix", noFix);
    return groups;
  }

  liveDayHasWork(): boolean {
    const day = this.openDay();
    if (!day) return false;
    const counts = Object.values(day.counts).some((n) => n > 0);
    const pins = this.maybe("SELECT id FROM pin WHERE day_id=? LIMIT 1", [day.id]);
    return counts || Boolean(pins);
  }

  toJson(): unknown {
    const owner = this.owner();
    return {
      owner: { ...owner, talkKey: owner.talkKey ? "[kept]" : "" },
      days: this.all("SELECT * FROM day"),
      counts: this.all("SELECT * FROM day_count"),
      windows: this.all("SELECT * FROM labor_window"),
      pins: this.all("SELECT * FROM pin"),
      ticks: this.all("SELECT * FROM inspect_tick"),
      memory: this.all("SELECT * FROM memory"),
      mindset: this.all("SELECT * FROM mindset"),
      copy: this.all("SELECT * FROM copy_log"),
      loop: this.all("SELECT * FROM loop_pin"),
    };
  }

  restoreFromJson(data: unknown): void {
    if (!data || typeof data !== "object") throw new Error("not a Field OS copy");
    const json = data as {
      owner?: Partial<Owner> & { pack_id?: string; talk_key?: string; tour_done?: number };
      days?: Record<string, unknown>[];
      counts?: Record<string, unknown>[];
      windows?: Record<string, unknown>[];
      pins?: Record<string, unknown>[];
      ticks?: Record<string, unknown>[];
      memory?: Record<string, unknown>[];
      mindset?: Record<string, unknown>[];
      copy?: Record<string, unknown>[];
      loop?: Record<string, unknown>[];
    };
    const keptKey = this.owner().talkKey;
    this.db.run("DELETE FROM inspect_tick");
    this.db.run("DELETE FROM pin");
    this.db.run("DELETE FROM day_count");
    this.db.run("DELETE FROM labor_window");
    this.db.run("DELETE FROM day");
    this.db.run("DELETE FROM memory");
    this.db.run("DELETE FROM mindset");
    this.db.run("DELETE FROM copy_log");
    this.db.run("DELETE FROM loop_pin");

    if (json.owner) {
      const o = json.owner;
      const incomingKey = o.talkKey ?? o.talk_key ?? "";
      this.saveOwner({
        label: o.label ?? "This phone",
        name: o.name ?? "",
        company: o.company ?? "",
        county: o.county ?? "",
        packId: o.packId ?? o.pack_id ?? "field",
        talkKey: !incomingKey || incomingKey === "[kept]" ? keptKey : String(incomingKey),
        tourDone: Boolean(o.tourDone ?? o.tour_done),
      });
    }

    for (const d of json.days ?? []) {
      this.db.run(
        "INSERT OR REPLACE INTO day (id, started_at, ended_at, tz, notes, aar) VALUES (?, ?, ?, ?, ?, ?)",
        [d.id, d.started_at, d.ended_at ?? null, d.tz ?? "UTC", d.notes ?? "", d.aar ?? ""].map(sqlVal),
      );
    }
    for (const c of json.counts ?? []) {
      this.db.run("INSERT OR REPLACE INTO day_count (day_id, unit_id, n) VALUES (?, ?, ?)", [
        sqlVal(c.day_id),
        sqlVal(c.unit_id),
        Number(c.n) || 0,
      ]);
    }
    for (const w of json.windows ?? []) {
      this.db.run(
        "INSERT OR REPLACE INTO labor_window (id, day_id, start, end, kind) VALUES (?, ?, ?, ?, ?)",
        [w.id, w.day_id, w.start, w.end ?? null, w.kind ?? "work"].map(sqlVal),
      );
    }
    for (const p of json.pins ?? []) {
      this.db.run(
        "INSERT OR REPLACE INTO pin (id, day_id, lat, lng, address, year, status, note, look, unit_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          p.id,
          p.day_id ?? null,
          p.lat ?? null,
          p.lng ?? null,
          p.address ?? "",
          p.year ?? "",
          p.status ?? null,
          p.note ?? "",
          p.look ?? "",
          p.unit_id ?? null,
          p.created_at ?? nowIso(),
        ].map(sqlVal),
      );
    }
    for (const t of json.ticks ?? []) {
      this.db.run("INSERT OR REPLACE INTO inspect_tick (pin_id, row_id, done) VALUES (?, ?, ?)", [
        sqlVal(t.pin_id),
        sqlVal(t.row_id),
        t.done ? 1 : 0,
      ]);
    }
    for (const m of json.memory ?? []) {
      this.db.run("INSERT OR REPLACE INTO memory (id, title, tags, body, source) VALUES (?, ?, ?, ?, ?)", [
        sqlVal(m.id ?? uid()),
        sqlVal(m.title ?? ""),
        sqlVal(m.tags ?? ""),
        sqlVal(m.body ?? ""),
        sqlVal(m.source ?? "typed"),
      ]);
    }
    for (const m of json.mindset ?? []) {
      this.db.run("INSERT OR REPLACE INTO mindset (k, v) VALUES (?, ?)", [sqlVal(m.k), sqlVal(m.v ?? "")]);
    }
    for (const c of json.copy ?? []) {
      this.db.run("INSERT INTO copy_log (at, channel) VALUES (?, ?)", [
        sqlVal(c.at),
        sqlVal(c.channel ?? "json"),
      ]);
    }
    for (const l of json.loop ?? []) {
      this.db.run("INSERT OR REPLACE INTO loop_pin (pin_id, n) VALUES (?, ?)", [
        sqlVal(l.pin_id),
        Number(l.n) || 0,
      ]);
    }
  }

  mergeFromJson(data: unknown): void {
    if (!data || typeof data !== "object") throw new Error("not a Field OS copy");
    const merged = mergeJson(this.toJson() as Record<string, unknown>, data as Record<string, unknown>);
    this.restoreFromJson(merged);
  }

  private hydrateDay(r: Record<string, unknown>): DayRow {
    const counts: Record<string, number> = {};
    for (const c of this.all("SELECT unit_id, n FROM day_count WHERE day_id=?", [r.id])) {
      counts[String(c.unit_id)] = Number(c.n);
    }
    return {
      id: String(r.id),
      startedAt: String(r.started_at),
      endedAt: r.ended_at ? String(r.ended_at) : null,
      tz: String(r.tz),
      notes: String(r.notes ?? ""),
      aar: String(r.aar ?? ""),
      counts,
    };
  }

  private hydratePin(r: Record<string, unknown>): PinRow {
    return {
      id: String(r.id),
      dayId: r.day_id ? String(r.day_id) : null,
      lat: r.lat == null ? null : Number(r.lat),
      lng: r.lng == null ? null : Number(r.lng),
      address: String(r.address ?? ""),
      year: String(r.year ?? ""),
      status: (r.status as PinStatus | null) ?? null,
      note: String(r.note ?? ""),
      look: String(r.look ?? ""),
      unitId: r.unit_id ? String(r.unit_id) : null,
      createdAt: String(r.created_at),
    };
  }

  private one(sql: string, params: unknown[] = []): Record<string, unknown> {
    const r = this.maybe(sql, params);
    if (!r) throw new Error("expected a row");
    return r;
  }

  private maybe(sql: string, params: unknown[] = []): Record<string, unknown> | null {
    const rows = this.all(sql, params);
    return rows[0] ?? null;
  }

  private all(sql: string, params: unknown[] = []): Record<string, unknown>[] {
    const stmt = this.db.prepare(sql);
    stmt.bind(params as never[]);
    const rows: Record<string, unknown>[] = [];
    while (stmt.step()) rows.push(stmt.getAsObject());
    stmt.free();
    return rows;
  }
}

export function mergeJson(
  a: Record<string, unknown>,
  b: Record<string, unknown>,
): Record<string, unknown> {
  const { days, remap } = collapseByDate(
    unionByKey(asRows(a.days), asRows(b.days), "id", mergeDay),
  );
  const dayOf = (id: unknown) => remap.get(String(id)) ?? String(id ?? "");
  const withDay = (row: Record<string, unknown>) => ({
    ...row,
    day_id: row.day_id == null ? row.day_id : dayOf(row.day_id),
  });
  const counts = new Map<string, number>();
  for (const src of [a.counts, b.counts]) {
    if (!Array.isArray(src)) continue;
    for (const row of src as { day_id: string; unit_id: string; n: number }[]) {
      const k = `${dayOf(row.day_id)}:${row.unit_id}`;
      counts.set(k, Math.max(counts.get(k) ?? 0, Number(row.n) || 0));
    }
  }
  return {
    owner: mergeOwner(asRecord(a.owner), asRecord(b.owner)),
    days,
    counts: [...counts.entries()].map(([k, n]) => {
      const [day_id, unit_id] = k.split(":");
      return { day_id, unit_id, n };
    }),
    windows: unionByKey(
      asRows(a.windows).map(withDay),
      asRows(b.windows).map(withDay),
      "id",
      (live, inc) => ({ ...inc, ...live }),
    ),
    pins: unionByKey(asRows(a.pins).map(withDay), asRows(b.pins).map(withDay), "id", mergePin),
    ticks: unionTicks(asRows(a.ticks), asRows(b.ticks)),
    memory: unionByKey(asRows(a.memory), asRows(b.memory), "id", (live, inc) => ({
      ...inc,
      ...live,
      body: String(live.body ?? "") || String(inc.body ?? ""),
    })),
    mindset: unionByKey(asRows(a.mindset), asRows(b.mindset), "k", (live, inc) => ({
      k: live.k ?? inc.k,
      v: String(live.v ?? "") || String(inc.v ?? ""),
    })),
    copy: [...asRows(a.copy), ...asRows(b.copy)],
    loop: asRows(a.loop).length ? asRows(a.loop) : asRows(b.loop),
  };
}

function asRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" ? (v as Record<string, unknown>) : {};
}

function asRows(v: unknown): Record<string, unknown>[] {
  return Array.isArray(v) ? (v as Record<string, unknown>[]) : [];
}

function unionByKey(
  live: Record<string, unknown>[],
  incoming: Record<string, unknown>[],
  key: string,
  merge: (live: Record<string, unknown>, incoming: Record<string, unknown>) => Record<string, unknown>,
): Record<string, unknown>[] {
  const map = new Map<string, Record<string, unknown>>();
  for (const row of incoming) {
    const k = String(row[key] ?? "");
    if (k) map.set(k, row);
  }
  for (const row of live) {
    const k = String(row[key] ?? "");
    if (!k) continue;
    const prev = map.get(k);
    map.set(k, prev ? merge(row, prev) : row);
  }
  return [...map.values()];
}

function mergeOwner(live: Record<string, unknown>, incoming: Record<string, unknown>): Record<string, unknown> {
  const fill = (k: string) => {
    const a = String(live[k] ?? "");
    return a || incoming[k];
  };
  return {
    ...incoming,
    ...live,
    name: fill("name"),
    company: fill("company"),
    county: fill("county"),
    label: fill("label") || "This phone",
    packId: live.packId || live.pack_id || incoming.packId || incoming.pack_id || "field",
    talkKey: live.talkKey || live.talk_key || incoming.talkKey || incoming.talk_key || "",
  };
}

function mergeDay(live: Record<string, unknown>, incoming: Record<string, unknown>): Record<string, unknown> {
  return {
    ...incoming,
    ...live,
    notes: String(live.notes ?? "") || incoming.notes,
    aar: String(live.aar ?? "") || incoming.aar,
    ended_at: live.ended_at ?? incoming.ended_at,
  };
}

function collapseByDate(days: Record<string, unknown>[]): {
  days: Record<string, unknown>[];
  remap: Map<string, string>;
} {
  const groups = new Map<string, Record<string, unknown>[]>();
  for (const d of days) {
    const key = d.started_at ? localDate(new Date(String(d.started_at))) : String(d.id ?? "");
    const list = groups.get(key) ?? [];
    list.push(d);
    groups.set(key, list);
  }
  const remap = new Map<string, string>();
  const out: Record<string, unknown>[] = [];
  for (const list of groups.values()) {
    const keptId = String(list[0]?.id ?? "");
    let merged = list[0] ?? {};
    for (const row of list) {
      merged = mergeDay(merged, row);
      remap.set(String(row.id), keptId);
    }
    out.push({ ...merged, id: keptId });
  }
  return { days: out, remap };
}

function mergePin(live: Record<string, unknown>, incoming: Record<string, unknown>): Record<string, unknown> {
  return {
    ...incoming,
    ...live,
    address: String(live.address ?? "") || incoming.address,
    note: String(live.note ?? "") || incoming.note,
    lat: live.lat ?? incoming.lat,
    lng: live.lng ?? incoming.lng,
    status: live.status ?? incoming.status,
  };
}

function unionTicks(
  live: Record<string, unknown>[],
  incoming: Record<string, unknown>[],
): Record<string, unknown>[] {
  const map = new Map<string, Record<string, unknown>>();
  for (const row of [...incoming, ...live]) {
    const k = `${row.pin_id}:${row.row_id}`;
    const prev = map.get(k);
    const done = Number(row.done) || 0;
    map.set(k, { ...row, done: Math.max(done, Number(prev?.done) || 0) });
  }
  return [...map.values()];
}

function localDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function pinMeters(
  origin: { lat: number; lng: number },
  pin: { lat: number | null; lng: number | null },
): number | null {
  if (pin.lat == null || pin.lng == null) return null;
  const toRad = (n: number) => (n * Math.PI) / 180;
  const dLat = toRad(pin.lat - origin.lat);
  const dLng = toRad(pin.lng - origin.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(origin.lat)) * Math.cos(toRad(pin.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371000 * Math.asin(Math.min(1, Math.sqrt(s)));
}

function sortPins(pins: PinRow[], origin: { lat: number; lng: number } | null): PinRow[] {
  if (!origin) return pins;
  return [...pins].sort((a, b) => (pinMeters(origin, a) ?? 1e12) - (pinMeters(origin, b) ?? 1e12));
}

const STOP = new Set([
  "the",
  "and",
  "for",
  "what",
  "how",
  "did",
  "does",
  "this",
  "that",
  "with",
  "from",
  "have",
  "want",
  "when",
  "then",
  "just",
  "your",
  "you",
  "are",
  "was",
  "can",
  "not",
  "but",
  "our",
  "out",
  "about",
  "into",
  "them",
  "they",
  "will",
  "would",
  "should",
  "could",
]);

function tokens(s: string): string[] {
  return s
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length >= 3 && !STOP.has(w));
}

function scoreMemory(query: string[], m: MemoryRow): number {
  const title = tokens(m.title);
  const tags = tokens(m.tags);
  const body = tokens(m.body);
  let score = 0;
  for (const t of query) {
    if (title.includes(t)) score += 3;
    if (tags.includes(t)) score += 2;
    if (body.includes(t)) score += 1;
  }
  return score;
}

