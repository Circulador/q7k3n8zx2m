/* Service Worker — Guardião Cibernético (Orbita)
   Estratégia: cache-first com fallback de rede; navegações caem para index.html offline.
   Ao publicar nova versão, altere CACHE_VERSION (idealmente = APP_VERSION do index.html). */
var CACHE_VERSION = "v83";
var CACHE_NAME = "gdv-cache-" + CACHE_VERSION;

/* App shell — caminhos relativos para funcionar em subpasta do GitHub Pages */
var PRECACHE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png?v=82",
  "./icons/icon-512.png?v=82",
  "./css/styles.css?v=82",
  "./js/sign-lang.js?v=82",
  "./js/orbita-world-map.js?v=82",
  "./js/questions-data.js?v=82",
  "./js/country-questions-data.js?v=82",
  "./js/bosses-data.js?v=82",
  "./js/boss-personal-tips.js?v=82",
  "./js/chain-data.js?v=82",
  "./js/boss-maps.js?v=82",
  "./js/game.js?v=82",
  "./js/demo-menu.js?v=82",
  "./js/review-bank.js?v=82",
  "./js/access-gate.js?v=82",
  "./assets/d3.min.js",
  "./assets/topojson-client.min.js",
  "./assets/countries-110m.json",
  "./assets/orbita-logo.svg"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(PRECACHE);
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE_NAME; }).map(function (k) { return caches.delete(k); })
      );
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  var url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;

  e.respondWith(
    caches.match(e.request).then(function (cached) {
      if (cached) return cached;
      return fetch(e.request).then(function (res) {
        if (!res || res.status !== 200 || res.type === "opaque") return res;
        var clone = res.clone();
        caches.open(CACHE_NAME).then(function (cache) { cache.put(e.request, clone); });
        return res;
      }).catch(function () {
        if (e.request.mode === "navigate") return caches.match("./index.html");
        return caches.match(e.request);
      });
    })
  );
});
