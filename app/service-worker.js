// service-worker.js — Cache-first strategy for Liz Program PWA
// Cache name: bump version string to force a fresh install on deploy
const CACHE_NAME = "liz-app-v4"; // bumped: rebuilt as vanilla JS, removed Preact/htm

// Files to cache on install (shell + CDN deps)
// CDN URLs must match the <script src> imports in index.html exactly.
const PRECACHE_URLS = [
  "./",
  "./manifest.json",
  "https://unpkg.com/lucide@0.263.1/dist/umd/lucide.min.js",
  "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600&display=swap",
];

// Install: open cache and precache listed resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Some CDN URLs may fail on first install (no network) — ignore individual failures
      return Promise.allSettled(PRECACHE_URLS.map((url) => cache.add(url)));
    }).then(() => self.skipWaiting())
  );
});

// Activate: delete old caches so stale assets don't linger
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: navigation requests → network-first (keeps the app fresh);
//        everything else → cache-first with network fallback.
self.addEventListener("fetch", (event) => {
  // Only handle http/https requests
  if (!event.request.url.startsWith("http")) return;

  const isNavigation = event.request.mode === "navigate";

  if (isNavigation) {
    // Navigation (HTML pages): try network first so updates land immediately;
    // fall back to cache if offline.
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache successful navigation responses
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    // Assets (JS, CSS, fonts, CDN): cache-first.
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        });
      })
    );
  }
});
