const staticCacheName = 'restaurant-cache-1';

const urlsToCache = [
    '/',
    '/restaurant.html',
    '/img/1.jpg',
    '/img/2.jpg',
    '/img/3.jpg',
    '/img/4.jpg',
    '/img/5.jpg',
    '/img/6.jpg',
    '/img/7.jpg',
    '/img/8.jpg',
    '/img/9.jpg',
    '/img/10.jpg',
    '/js/dbhelper.js',
    '/js/main.js',
    '/js/restaurant_info.js',
    '/css/styles.css',
    'data/restaurants.json',

];

self.addEventListener('install', (event) => {
    console.log("[Service worker] Installing Service Worker...", event);
    event.waitUntil(
        // Open 'staatic' cache or create it if it doesn't exist
        caches.open(staticCacheName)
        .then((cache) => {
            console.log('[Service Worker] Precaching App Shell...');
            // Static Precaching main assets
            return cache.addAll(urlsToCache);
        }).catch(erroe => {
            console.log(erroe);

        })
    );
});

self.addEventListener('activate', (event) => {
    console.log("[Service worker] Activating Service Worker...", event);
    event.waitUntil(
        caches.keys()
        .then((cacheNames) => {
            return Promise.all(
                cacheNames.filter((cacheName) => {
                    return cacheName.startsWith('restaurant-') &&
                        cacheName != staticCacheName;
                }).map((cacheName) => {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    console.log("[Service worker] Fetching something...", event);
    event.respondWith(
        caches.match(event.request)
        .then((response) => {
            if (response) {
                console.log('[ServiceWorker] Fetching from cache...', response);
                return response;
            } else {
                console.log('[ServiceWorker] Fetching from network...', response);
                return fetch(event.request)
                    .then((response) => {
                        return response;
                    });
            }
        })
    );
});