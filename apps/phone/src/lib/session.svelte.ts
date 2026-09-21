import { Book, getPack, resolvePack, type BrandPack, type DayRow, type Owner, type PinRow } from "@field-os/kernel";
import { loadBookBytes, saveBookBytes, type PersistEngine } from "./persist";

import wasmUrl from "sql.js/dist/sql-wasm.wasm?url";

function packIdFromLocation(): string {
  if (typeof location === "undefined") return "field";
  const q = new URLSearchParams(location.search).get("pack") ?? undefined;
  return resolvePack({ id: q ?? undefined, host: location.hostname });
}

export class Phone {
  ready = $state(false);
  closed = $state(true);
  engine: PersistEngine = $state("memory");
  lastWrite = $state<string | null>(null);
  pack: BrandPack = $state(getPack("field"));
  owner: Owner = $state({
    id: "",
    label: "This phone",
    name: "",
    company: "",
    county: "",
    packId: "field",
    talkKey: "",
    tourDone: false,
  });
  day: DayRow | null = $state(null);
  pins: PinRow[] = $state([]);
  paused = $state(false);
  elapsed = $state(0);
  talkOpen = $state(false);
  talkMode: "live" | "roleplay" | "mindset" = $state("live");
  menuOpen = $state(false);
  cardIndex = $state(0);

  private book: Book | null = null;

  setupDone = $derived(Boolean(this.owner.name && this.owner.company && this.owner.county));
  tourDone = $derived(this.owner.tourDone);

  async boot(): Promise<void> {
    const id = packIdFromLocation();
    this.pack = getPack(id);
    try {
      const loaded = await loadBookBytes();
      this.engine = loaded.bytes ? loaded.engine : "memory";
      this.book = await Book.open(loaded.bytes, (file) => (file.endsWith(".wasm") ? wasmUrl : file));
      this.closed = false;
      const o = this.book.owner();
      if (!o.packId || o.packId === "field") {
        this.book.saveOwner({ packId: id });
      }
      this.pull();
      await this.persist();
    } catch (err) {
      console.warn("book closed", err);
      this.book = null;
      this.closed = true;
    }
    this.applyManifest();
    this.ready = true;
  }

  private pull(): void {
    if (!this.book) return;
    this.owner = this.book.owner();
    this.day = this.book.openDay();
    this.pins = this.book.pins();
    this.paused = this.book.paused();
    this.elapsed = this.book.elapsedMs();
  }

  private async persist(): Promise<void> {
    if (!this.book) return;
    this.engine = await saveBookBytes(this.book.exportBytes());
    this.lastWrite = new Date().toISOString();
  }

  private async mutate(fn: (book: Book) => void): Promise<void> {
    if (!this.book) return;
    fn(this.book);
    this.pull();
    await this.persist();
  }

  finishTour(): Promise<void> {
    return this.mutate((b) => b.saveOwner({ tourDone: true }));
  }

  saveSetup(patch: { name: string; company: string; county: string }): Promise<void> {
    return this.mutate((b) => b.saveOwner(patch));
  }

  startDay(): Promise<void> {
    return this.mutate((b) => {
      b.startDay();
    });
  }

  pauseDay(): Promise<void> {
    return this.mutate((b) => (this.paused ? b.resumeDay() : b.pauseDay()));
  }

  endDay(): Promise<void> {
    return this.mutate((b) => b.endDay());
  }

  bump(unitId: string): Promise<void> {
    return this.mutate((b) => b.bumpTile(unitId, 1));
  }

  dropPin(address = ""): Promise<void> {
    return this.mutate((b) => {
      b.dropPin({ address });
    });
  }

  openTalk(mode: "live" | "roleplay" | "mindset" = "live"): void {
    this.talkMode = mode;
    this.talkOpen = true;
  }

  closeTalk(): void {
    this.talkOpen = false;
  }

  private applyManifest(): void {
    if (typeof document === "undefined") return;
    document.title = this.pack.pwa.name;
    const manifest = {
      name: this.pack.pwa.name,
      short_name: this.pack.pwa.shortName,
      start_url: "/today",
      display: "standalone",
      background_color: "#efece3",
      theme_color: "#efece3",
      icons: [{ src: "/mark.svg", sizes: "64x64", type: "image/svg+xml", purpose: "any" }],
    };
    let link = document.querySelector<HTMLLinkElement>('link[rel="manifest"][data-pack]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "manifest";
      link.dataset.pack = "1";
      document.head.appendChild(link);
    }
    const blob = new Blob([JSON.stringify(manifest)], { type: "application/manifest+json" });
    link.href = URL.createObjectURL(blob);
  }
}

export const phone = new Phone();
