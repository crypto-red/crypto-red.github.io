var CACHE = 'network-or-cache-v1.3';

// On install, cache some resource.
self.addEventListener('install', function(evt) {
  console.log('The service worker is being installed.');
  // Open a cache and use `addAll()` with an array of assets to add all of them
  // to the cache. Ask the service worker to keep installing until the
  // returning promise resolves.
  evt.waitUntil(caches.open(CACHE).then(function (cache) {
    cache.addAll([
      "/client.min.js",
      "/src/sounds/sfx/md/alert_error-01.wav",
      "/src/sounds/sfx/md/navigation_transition-left.wav",
      "/src/sounds/sfx/md/alert_high-intensity.wav",
      "/src/sounds/sfx/md/navigation_transition-right.wav",
      "/src/sounds/sfx/md/hero_decorative-celebration-01.wav",
      "/src/sounds/sfx/md/state-change_confirm-down.wav",
      "/src/sounds/sfx/md/hero_decorative-celebration-02.wav",
      "/src/sounds/sfx/md/state-change_confirm-up.wav",
      "/src/sounds/sfx/md/hero_decorative-celebration-03.wav",
      "/src/sounds/sfx/md/ui_camera-shutter.wav",
      "/src/sounds/sfx/md/navigation_backward-selection-minimal.wav",
      "/src/sounds/sfx/md/ui_loading.wav",
      "/src/sounds/sfx/md/navigation_backward-selection.wav",
      "/src/sounds/sfx/md/ui_lock.wav",
      "/src/sounds/sfx/md/navigation_forward-selection.wav",
      "/src/sounds/sfx/md/ui_tap-variant-01.wav",
      "/src/sounds/sfx/md/navigation_selection-complete-celebration.wav",
      "/src/sounds/sfx/md/ui_unlock.wav",
      "/src/images/404-dark-2.svg",
      "/src/images/analytics.svg",
      "/src/images/coins-dark.svg",
      "/src/images/hacker.svg",
      "/src/images/jamy-annoyed.svg",
      "/src/images/jamy-shocked.svg",
      "/src/images/money-dark.svg",
      "/src/images/savings-dark.svg",
      "/src/images/transfer-dark.svg",
      "/src/images/wallet-green.svg",
      "/src/images/404-dark.svg",
      "/src/images/banknote-dark.svg",
      "/src/images/currency-dark.svg",
      "/src/images/hatch_strip_blue.png",
      "/src/images/jamy-flirty.svg",
      "/src/images/jamy-suspicious.svg",
      "/src/images/money-transfer-dark.svg",
      "/src/images/segment.svg",
      "/src/images/transfer.svg",
      "/src/images/wallet.svg",
      "/src/images/accountant-dark.svg",
      "/src/images/card-dark.svg",
      "/src/images/data.svg",
      "/src/images/hatch_strip_square_blue.png",
      "/src/images/jamy-happy.svg",
      "/src/images/logo-transparent.png",
      "/src/images/personal-finance.svg",
      "/src/images/statistics.svg",
      "/src/images/wallet-dark-2.svg",
      "/src/images/analytics-dark.svg",
      "/src/images/card.svg",
      "/src/images/favicon.ico",
      "/src/images/jamy-angry.svg",
      "/src/images/jamy-sad.svg",
      "/src/images/pig-coins.svg",
      "/src/images/swap.svg",
      "/src/images/wallet-dark.svg",
    ]);
  }));
});

// On fetch, use cache but update the entry with the latest contents
// from the server.
self.addEventListener('fetch', function(evt) {
  console.log('The service worker is serving the asset.');
  // You can use `respondWith()` to answer ASAP...
  evt.respondWith(fromCache(evt.request));
  // ...and `waitUntil()` to prevent the worker to be killed until
  // the cache is updated.
  evt.waitUntil(
      update(evt.request)
          // Finally, send a message to the client to inform it about the
          // resource is up to date.
          .then(refresh)
  );
});

// Open the cache where the assets were stored and search for the requested
// resource. Notice that in case of no matching, the promise still resolves
// but it does with `undefined` as value.
function fromCache(request) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request);
  });
}


// Update consists in opening the cache, performing a network request and
// storing the new response data.
function update(request) {
  return caches.open(CACHE).then(function (cache) {
    return fetch(request).then(function (response) {
      return cache.put(request, response.clone()).then(function () {
        return response;
      });
    });
  });
}

// Sends a message to the clients.
function refresh(response) {
  return self.clients.matchAll().then(function (clients) {
    clients.forEach(function (client) {
      // Encode which resource has been updated. By including the
      // [ETag](https://en.wikipedia.org/wiki/HTTP_ETag) the client can
      // check if the content has changed.
      var message = {
        type: 'refresh',
        url: response.url,
        // Notice not all servers return the ETag header. If this is not
        // provided you should use other cache headers or rely on your own
        // means to check if the content has changed.
        eTag: response.headers.get('ETag')
      };
      // Tell the client about the update.
      client.postMessage(JSON.stringify(message));
    });
  });
}