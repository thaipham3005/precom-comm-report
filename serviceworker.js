const CACHE_NAME = 'VER_1'
const UrlsToCache = ['index.php', 'offline.html']

const self = this
// install SW
self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME)
		.then((cache) => {
			console.log('Opened cache');
			return cache.addAll(UrlsToCache)
		})
	)
})
//Listen to request
self.addEventListener('fetch', (event) => {
	event.respondWith(
		caches.match(event.request)
		.then(() => {
			return fetch(event.request)
				.catch(() => caches.match('offline.html'))
		})
	)
})

// Activate SW
self.addEventListener('activate', (event) => {
	const cacheWhitelist = []
	cacheWhitelist.push(CACHE_NAME)

	event.waitUntil(
		caches.keys().then((cacheNames) => Promise.all(
			cacheNames.map((cacheName) => {
				if (!cacheWhitelist.includes(cacheName)) {
					return caches.delete(cacheName)
				}
			})
		))
	)
})