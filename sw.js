const CACHE_NAME = 'vane-app-v3'; 

// Archivos esenciales para que el horario funcione offline
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icono.png',
  './iconopag.png'
];

// Instalación y almacenamiento en caché de los recursos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Estrategia de respuesta: primero busca en caché, si no existe va a la red
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

// Limpieza automática de versiones antiguas del caché
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      );
    })
  );
});