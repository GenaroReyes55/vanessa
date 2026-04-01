// Cambiamos a v3 para forzar al Samsung a actualizar la app
const CACHE_NAME = 'vane-app-v3'; 

// SOLO guardamos lo que necesita el horario. 
// Ignoramos claves.html y las otras imágenes para no gastar memoria.
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icono.png',
  './iconopag.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName !== CACHE_NAME;
        }).map(cacheName => {
          return caches.delete(cacheName); // Borra las versiones viejas
        })
      );
    })
  );
});