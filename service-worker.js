var CACHE = "network-or-cache-v1.0.0";

// On install, cache some resource.
self.addEventListener("install", function(evt) {

  // Open a cache and use `addAll()` with an array of assets to add all of them
  // to the cache. Ask the service worker to keep installing until the
  // returning promise resolves.
  evt.waitUntil(caches.open(CACHE).then(function (cache) {
    cache.addAll([
      "/index.html",
      "/404.html",
      "/client.min.js?v=9.3",
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

self.addEventListener("fetch", function(event) {
  event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
  );
});