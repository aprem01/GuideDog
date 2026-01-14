const CACHE_NAME = 'blindguide-v2';
const ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.16.3/dist/ort.min.js',
    'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    
    // Skip API calls
    if (event.request.url.includes('api.openai.com') || 
        event.request.url.includes('api.anthropic.com')) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then((cached) => {
                if (cached) return cached;
                
                return fetch(event.request)
                    .then((response) => {
                        if (!response.ok) return response;
                        
                        const clone = response.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => cache.put(event.request, clone));
                        
                        return response;
                    });
            })
    );
});
