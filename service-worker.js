var CACHE = "network-or-cache-v25.5";

// On install, cache some resource.
self.addEventListener("install", function(evt) {

  // Open a cache and use `addAll()` with an array of assets to add all of them
  // to the cache. Ask the service worker to keep installing until the
  // returning promise resolves.
  evt.waitUntil(caches.open(CACHE).then(function (cache) {
    cache.addAll([
      "/",
      "/404.html",
      "/client.min.js?v=25.5",
      "/src/fonts/NotoSans-Regular.ttf",
      "/src/fonts/NotoSansMono-Regular.ttf",
      "/src/fonts/Saira-Regular.ttf",
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
      "/src/images/account.svg",
      "/src/images/account-add.svg",
      "/src/images/hacker.svg",
      "/src/images/wallet-green.svg",
      "/src/images/404-dark.svg",
      "/src/images/segment.svg",
      "/src/images/security.svg",
      "/src/images/share.svg",
      "/src/images/transfer.svg",
      "/src/images/wallet.svg",
      "/src/images/data.svg",
      "/src/images/logo-transparent.png",
      "/src/images/personal-finance.svg",
      "/src/images/statistics.svg",
      "/src/images/card.svg",
      "/src/images/favicon.ico",
      "/src/images/pig-coins.svg",
      "/src/images/swap.svg",
      "/src/images/invest.svg",
      "/src/images/investment-data.svg",
      "/src/images/open.svg",
      "/src/images/trade.svg",
    ]);
  }));
});

self.addEventListener("fetch", function(event) {

  if (event.request.url.indexOf("upload") !== -1) {
    return;
  }

  if(event.request.url.includes(".png") && event.request.mode !== "same-origin") {

    // Serve cached image if doesn't fail
    event.respondWith(
        caches.open(CACHE).then(function (cache) {
          return cache.match(event.request).then(function (response) {
            return (
                response ||
                fetch(event.request).then(function (response) { // Fetch, clone, and serve
                  cache.put(event.request, response.clone());
                  return response;
                })
            );
          });
        }),
    );


  }else if(event.request.mode === "navigate") {

    // Return the same index.html page for all navigation query
    event.respondWith( caches.match("/") || fetch(event.request));
  }
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
      caches.keys().then(function(cache_names) {
        return Promise.all(
            cache_names.filter(function(cache_name) {

              return Boolean(cache_name !== CACHE);
            }).map(function(cache_name) {

              return caches.delete(cache_name);
            })
        );
      })
  );
});