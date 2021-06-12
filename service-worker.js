var CACHE = 'network-or-cache-v1.0';

// On install, cache some resource.
self.addEventListener('install', function(evt) {
  console.log('The service worker is being installed.');

  // Ask the service worker to keep installing until the returning promise
  // resolves.
  evt.waitUntil(precache());
});

// On fetch, use cache but update the entry with the latest contents
// from the server.
self.addEventListener('fetch', function(evt) {
  console.log('The service worker is serving the asset.');
  // Try network and if it fails, go for the cached copy.
  evt.respondWith(fromNetwork(evt.request, 400).catch(function () {
    return fromCache(evt.request);
  }));
});

// Open a cache and use `addAll()` with an array of assets to add all of them
// to the cache. Return a promise resolving when all the assets are added.
function precache() {
  return caches.open(CACHE).then(function (cache) {
    return cache.addAll([
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
      "/src/images/manifest",
      "/src/images/pig-coins.svg",
      "/src/images/swap.svg",
      "/src/images/wallet-dark.svg",
    ]);
  });
}

// Time limited network request. If the network fails or the response is not
// served before timeout, the promise is rejected.
function fromNetwork(request, timeout) {
  return new Promise(function (fulfill, reject) {
    // Reject in case of timeout.
    var timeoutId = setTimeout(reject, timeout);
    // Fulfill in case of success.
    fetch(request).then(function (response) {
      clearTimeout(timeoutId);
      fulfill(response);
    // Reject also if network fetch rejects.
    }, reject);
  });
}

// Open the cache where the assets were stored and search for the requested
// resource. Notice that in case of no matching, the promise still resolves
// but it does with `undefined` as value.
function fromCache(request) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      return matching || Promise.reject('no-match');
    });
  });
}