// public/sw.js
// why: jednostavan offline cache (app shell + runtime assets)
const CACHE_NAME = "bokigym-v1";
const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/offline.html",
  "/icons/pwa-192.png",
  "/icons/pwa-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Navigate requests → SPA fallback
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match("/index.html");
        return cached || caches.match("/offline.html");
      })
    );
    return;
  }

  // Static assets: scripts/styles/images → SWR or cache-first
  if (request.destination === "script" || request.destination === "style") {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }
  if (request.destination === "image") {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Default: try network, fallback cache
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((resp) => {
      if (resp && resp.status === 200) cache.put(request, resp.clone());
      return resp;
    })
    .catch(() => cached);
  return cached || network;
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;
  const resp = await fetch(request);
  if (resp && resp.status === 200) cache.put(request, resp.clone());
  return resp;
}
