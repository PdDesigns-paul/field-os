const OPFS_FILE = "field-os.sqlite";
const IDB_NAME = "field-os";
const IDB_STORE = "book";
const IDB_KEY = "bytes";

export type PersistEngine = "opfs" | "idb" | "memory";

function idb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(IDB_STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbGet(): Promise<Uint8Array | null> {
  try {
    const db = await idb();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, "readonly");
      const req = tx.objectStore(IDB_STORE).get(IDB_KEY);
      req.onsuccess = () => {
        const v = req.result;
        resolve(v instanceof Uint8Array ? v : v ? new Uint8Array(v) : null);
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

async function idbPut(bytes: Uint8Array): Promise<void> {
  const db = await idb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, "readwrite");
    tx.objectStore(IDB_STORE).put(bytes, IDB_KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function opfsGet(): Promise<Uint8Array | null> {
  const root = await navigator.storage.getDirectory();
  try {
    const handle = await root.getFileHandle(OPFS_FILE);
    const file = await handle.getFile();
    return new Uint8Array(await file.arrayBuffer());
  } catch {
    return null;
  }
}

async function opfsPut(bytes: Uint8Array): Promise<void> {
  const root = await navigator.storage.getDirectory();
  const handle = await root.getFileHandle(OPFS_FILE, { create: true });
  const writable = await handle.createWritable();
  await writable.write(bytes);
  await writable.close();
}

export async function loadBookBytes(): Promise<{ bytes: Uint8Array | null; engine: PersistEngine }> {
  if (typeof navigator !== "undefined" && navigator.storage?.getDirectory) {
    const fromOpfs = await opfsGet();
    if (fromOpfs?.length) return { bytes: fromOpfs, engine: "opfs" };
  }
  const fromIdb = await idbGet();
  if (fromIdb?.length) return { bytes: fromIdb, engine: "idb" };
  return { bytes: null, engine: "memory" };
}

export async function saveBookBytes(bytes: Uint8Array): Promise<PersistEngine> {
  let engine: PersistEngine = "memory";
  if (typeof navigator !== "undefined" && navigator.storage?.getDirectory) {
    try {
      await opfsPut(bytes);
      engine = "opfs";
    } catch {
      engine = "memory";
    }
  }
  try {
    await idbPut(bytes);
    if (engine === "memory") engine = "idb";
  } catch {
    /* snapshot is best-effort */
  }
  return engine;
}
