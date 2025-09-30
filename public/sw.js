const CACHE = "bokigym-v1";
const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/offline.html",
  "/icons/pwa-192.png",
  "/icons/pwa-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k === CACHE ? null : caches.delete(k))))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const { request } = e;

  // SPA navigacije: mreža → fallback index/offline
  if (request.mode === "navigate") {
    e.respondWith(
      fetch(request).catch(async () => {
        const cache = await caches.open(CACHE);
        return (await cache.match("/index.html")) || cache.match("/offline.html");
      })
    );
    return;
  }

  // Stilovi/script: SWR
  if (request.destination === "style" || request.destination === "script") {
    e.respondWith(staleWhileRevalidate(request));
    return;
  }

  // Slike: cache-first
  if (request.destination === "image") {
    e.respondWith(cacheFirst(request));
    return;
  }

  // Ostalo: mreža → cache fallback
  e.respondWith(fetch(request).catch(() => caches.match(request)));
});

async function staleWhileRevalidate(req) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(req);
  const net = fetch(req)
    .then((res) => {
      if (res && res.status === 200) cache.put(req, res.clone());
      return res;
    })
    .catch(() => cached);
  return cached || net;
}
async function cacheFirst(req) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(req);
  if (cached) return cached;
  const res = await fetch(req);
  if (res && res.status === 200) cache.put(req, res.clone());
  return res;
}