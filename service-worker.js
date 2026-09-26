const CACHE_NAME = "vaultwise-v1";
const urlsToCache = [
  "/APP/",
  "/APP/dashboard.html",
  "/APP/styles.css",
  "/APP/dashboard.js",
  "/APP/app.js",
  "/APP/icon-192.png",
  "/APP/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
