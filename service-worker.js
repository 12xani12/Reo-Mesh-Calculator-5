const CACHE_NAME = 'reo-mesh-calculator-cache-v1';
const urlsToCache = [
  '/Reo-Mesh-Calculator-5/', // Explicitly cache the base URL of your new repo
  '/Reo-Mesh-Calculator-5/index.html',
  '/Reo-Mesh-Calculator-5/style.css',
  '/Reo-Mesh-Calculator-5/script.js',
  '/Reo-Mesh-Calculator-5/icon-192x192.png',
  '/Reo-Mesh-Calculator-5/icon-512x512.png',
  '/Reo-Mesh-Calculator-5/manifest.json'
  // Add any other static assets your site uses
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
