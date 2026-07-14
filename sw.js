/* Service Worker — Guardião Digital da Operação (Orbita)
   Estratégia: cache-first com fallback de rede; navegações caem para index.html offline.
   Ao publicar nova versão, altere CACHE_VERSION (idealmente = APP_VERSION do index.html). */
var CACHE_VERSION = "v47";
var CACHE_NAME = "gdv-cache-" + CACHE_VERSION;

/* App shell — caminhos relativos para funcionar em subpasta do GitHub Pages */
var PRECACHE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-512.png?v=47",
  "./css/styles.css?v=47",
  "./js/sign-lang.js?v=47",
  "./js/orbita-world-map.js?v=47",
  "./js/questions-data.js?v=47",
  "./js/country-questions-data.js?v=47",
  "./js/bosses-data.js?v=47",
  "./js/chain-data.js?v=47",
  "./js/game.js?v=47",
  "./js/access-gate.js?v=47",
  "./assets/d3.min.js",
  "./assets/topojson-client.min.js",
  "./assets/countries-110m.json",
  "./assets/orbita-logo.svg"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      // addAll falha tudo se um item falhar; usamos add individual tolerante
      return Promise.all(PRECACHE.map(function (url) {
        return cache.add(new Request(url, { cache: "reload" })).catch(function () { return null; });
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== CACHE_NAME) return caches.delete(k);
        return null;
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET") return;

  var url = new URL(req.url);
  // Só tratamos requisições da mesma origem (o resto vai direto à rede)
  if (url.origin !== self.location.origin) return;

  // Navegação (abrir a página): tenta rede, cai para index.html do cache
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(function () {
        return caches.match("./index.html", { ignoreSearch: true }).then(function (r) {
          return r || caches.match("./");
        });
      })
    );
    return;
  }

  // Demais assets: cache-first (ignora ?v= para resiliência), atualiza em segundo plano
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then(function (cached) {
      var network = fetch(req).then(function (res) {
        if (res && res.status === 200) {
          var copy = res.clone();
          caches.open(CACHE_NAME).then(function (cache) { cache.put(req, copy); });
        }
        return res;
      }).catch(function () { return cached; });
      return cached || network;
    })
  );
});
