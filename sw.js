// Service Worker - PWA desteği için
const CACHE_NAME = 'guitar-tuner-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/tuner.js',
    '/manifest.json'
];

// Install event - cache dosyaları
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Cache açıldı');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event - cache'den servis et
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache'de varsa cache'den döndür, yoksa network'ten al
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

// Activate event - eski cache'leri temizle
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Eski cache siliniyor:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});