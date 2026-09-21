import type { Database, SqlJsStatic, SqlValue } from "sql.js";
import type { BrandPack, PinStatus } from "./types.ts";

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
    book.ensureOwner();
    return book;
  }

  exportBytes(): Uint8Array {
    return this.db.export();
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

  addMemory(title: string, body: string, source = "typed"): void {
    this.db.run("INSERT INTO memory (id, title, body, source) VALUES (?, ?, ?, ?)", [
      uid(),
      title,
      body,
      source,
    ]);
  }

  memories(): { id: string; title: string; body: string; source: string }[] {
    return this.all("SELECT id, title, body, source FROM memory ORDER BY title").map((r) => ({
      id: String(r.id),
      title: String(r.title),
      body: String(r.body),
      source: String(r.source),
    }));
  }

  markCopy(channel: "file" | "json"): void {
    this.db.run("INSERT INTO copy_log (at, channel) VALUES (?, ?)", [nowIso(), channel]);
  }

  lastCopy(): { at: string; channel: string } | null {
    const r = this.maybe("SELECT at, channel FROM copy_log ORDER BY id DESC LIMIT 1");
    return r ? { at: String(r.at), channel: String(r.channel) } : null;
  }

  hoursThisWeek(): { day: string; ms: number }[] {
    const rows = this.all("SELECT id, started_at FROM day ORDER BY started_at DESC LIMIT 14");
    return rows.map((d) => {
      const windows = this.all("SELECT start, end FROM labor_window WHERE day_id=? AND kind='work'", [
        d.id,
      ]);
      const ms = windows.reduce((sum, w) => {
        const a = new Date(String(w.start)).getTime();
        const b = w.end ? new Date(String(w.end)).getTime() : Date.now();
        return sum + Math.max(0, b - a);
      }, 0);
      return { day: String(d.started_at).slice(0, 10), ms };
    });
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
  const counts = new Map<string, number>();
  for (const src of [a.counts, b.counts]) {
    if (!Array.isArray(src)) continue;
    for (const row of src as { day_id: string; unit_id: string; n: number }[]) {
      const k = `${row.day_id}:${row.unit_id}`;
      counts.set(k, Math.max(counts.get(k) ?? 0, Number(row.n) || 0));
    }
  }
  return {
    ...a,
    ...b,
    counts: [...counts.entries()].map(([k, n]) => {
      const [day_id, unit_id] = k.split(":");
      return { day_id, unit_id, n };
    }),
  };
}
