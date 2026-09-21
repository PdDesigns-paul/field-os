const CACHE = "field-os-shell-v1";
const SHELL = ["/", "/today", "/door", "/inspect", "/plan", "/mark.svg", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL).catch(() => undefined)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.pathname.startsWith("/api/")) return;
  event.respondWith(
    caches.match(event.request).then((hit) => {
      return (
        hit ||
        fetch(event.request)
          .then((res) => {
            const copy = res.clone();
            if (res.ok && event.request.method === "GET") {
              caches.open(CACHE).then((cache) => cache.put(event.request, copy));
            }
            return res;
          })
          .catch(() => caches.match("/today"))
      );
    }),
  );
});
