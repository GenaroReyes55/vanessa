const CACHE_NAME = 'vane-app-v5'; // Subimos la versión para forzar la limpieza

const urlsToCache = [
  './',
  './index.html',
  './notas.html',
  './contraseñas.html', // Asegúrate de que el nombre coincide exactamente
  './manifest.json',
  './icono.png',
  './iconopag.png'
];

// Instalación
self.addEventListener('install', event => {
  self.skipWaiting(); // Obliga a la nueva versión a instalarse de inmediato
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Archivos en caché (v5)');
        return cache.addAll(urlsToCache);
      })
  );
});

// Limpieza automática del caché viejo
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim()); // Toma el control de inmediato
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Borrando caché antiguo:', cacheName);
            return caches.delete(cacheName); // Borra las versiones v1, v2, v3, v4...
          }
        })
      );
    })
  );
});

// NUEVA ESTRATEGIA: "Network First" (Red primero, luego caché)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Si hay internet y carga bien, devuelve la versión más nueva 
        // y de paso actualiza el caché silenciosamente.
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Si FALLA (porque no hay internet), usa la versión del caché
        return caches.match(event.request);
      })
  );
});