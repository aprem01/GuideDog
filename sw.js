const CACHE = 'blindguide-v4';
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(['/', '/index.html'])).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
    if (e.request.method !== 'GET' || e.request.url.includes('workers.dev')) return;
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
