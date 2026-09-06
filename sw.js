const CACHE = 'menu-v4';
const CACHE = 'menu-v5';
const ASSETS = [
  '/', '/index.html', '/style.css', '/app.js', '/data.js', '/i18n.js',
  '/menu.json', '/menu.en.json', '/menu.es.json', '/menu.fr.json', '/menu.de.json',
  '/icon.svg'
  './', './index.html', './style.css', './app.js', './data.js', './i18n.js',
  './manifest.json', './icon.svg',
  './menu.json', './menu.en.json', './menu.es.json', './menu.fr.json', './menu.de.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Network-first for all requests, fallback to cache when offline
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        if (res.ok) caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
