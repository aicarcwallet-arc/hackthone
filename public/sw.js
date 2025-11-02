const CACHE_NAME = 'aic-learn-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/aic toekn  copy.png',
  '/ARAC LOGO.png',
  '/circle.b8b9d808c4509a1c3043e1a2859807b7a83364094f388457832f020fa02cbc37.png',
  '/usdc-3d-icon-download-in-png-blend-fbx-gltf-file-formats--bitcoin-logo-coin-cryptocurrency-symbol-crypto-coins-vol2-pack-science-technology-icons-7947905.webp'
];

const EDUCATIONAL_CONTENT = [
  'DeFi',
  'Smart Contract',
  'Web3',
  'Blockchain',
  'Wallet',
  'Gas Fee',
  'NFT',
  'Staking'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  if (event.request.url.includes('supabase') ||
      event.request.url.includes('ethereum') ||
      event.request.url.includes('metamask')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).then((response) => {
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
          return response;
        });
      })
      .catch(() => {
        if (event.request.url.includes('index.html') || event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
        return new Response('Offline - Learn blockchain basics when you reconnect!', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({
            'Content-Type': 'text/plain'
          })
        });
      })
  );
});
