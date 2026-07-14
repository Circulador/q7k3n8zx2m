/* Service Worker — Guardião Cibernético (Orbita)
   Estratégia: cache-first com fallback de rede; navegações caem para index.html offline.
   Ao publicar nova versão, altere CACHE_VERSION (idealmente = APP_VERSION do index.html). */
var CACHE_VERSION = "v57";
var CACHE_NAME = "gdv-cache-" + CACHE_VERSION;

/* App shell — caminhos relativos para funcionar em subpasta do GitHub Pages */
var PRECACHE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png?v=57",
  "./icons/icon-512.png?v=57",
  "./css/styles.css?v=57",
  "./js/sign-lang.js?v=57",
  "./js/orbita-world-map.js?v=57",
  "./js/questions-data.js?v=57",
  "./js/country-questions-data.js?v=57",
  "./js/bosses-data.js?v=57",
  "./js/chain-data.js?v=57",
  "./js/boss-maps.js?v=57",
  "./js/game.js?v=57",
  "./js/access-gate.js?v=57",
  "./assets/d3.min.js",
  "./assets/topojson-client.min.js",
  "./assets/countries-110m.json",
  "./assets/orbita-logo.svg"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(PRECACHE);
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE_NAME; }).map(function (k) { return caches.delete(k); })
      );
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;
  var url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(function () {
        return caches.match("./index.html");
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function (cached) {
      if (cached) return cached;
      return fetch(event.request).then(function (response) {
        if (!response || response.status !== 200 || response.type !== "basic") return response;
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function (cache) { cache.put(event.request, clone); });
        return response;
      });
    })
  );
});
