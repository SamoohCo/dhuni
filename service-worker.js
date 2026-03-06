// ============================================================
// DHUNI — Service Worker
// Cache-first for all static assets.
// YouTube streams are not cached (network-only by fallthrough).
// ============================================================

const CACHE = 'dhuni-v2';
const STATIC = [
  '/',
  '/index.html',
  '/style.css',
  '/main.js',
  '/stations.js',
  '/manifest.json',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(STATIC))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Only cache-intercept same-origin requests for our static files
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return; // let YouTube etc. pass through

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') return response;
        const clone = response.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, clone));
        return response;
      });
    })
  );
});
