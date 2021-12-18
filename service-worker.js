var CACHE = "network-or-cache-v60";

// On install, cache some resource.
self.addEventListener("install", function(evt) {

  // Open a cache and use `addAll()` with an array of assets to add all of them
  // to the cache. Ask the service worker to keep installing until the
  // returning promise resolves.
  return evt.waitUntil(caches.open(CACHE).then(function (cache) {
    cache.addAll([
      "/",
      "/index.html",
      "/404.html",
      "/client.min.js",
      "/client.min.js?v=60",
      "/src/fonts/NotoSans-Regular.ttf",
      "/src/fonts/SpecialElite-Regular.ttf",
      "/src/fonts/NotoSansMono-Regular.ttf",
      "/src/fonts/ShareTechMono-Regular.ttf",
      "/src/fonts/Saira-Regular.ttf",
      "/src/sounds/sfx/md/alert_error-01.mp3",
      "/src/sounds/sfx/md/navigation_transition-left.mp3",
      "/src/sounds/sfx/md/alert_high-intensity.mp3",
      "/src/sounds/sfx/md/FullHorizonThrow.mp3",
      "/src/sounds/sfx/md/navigation_transition-right.mp3",
      "/src/sounds/sfx/md/PrometheusVertical2.mp3",
      "/src/sounds/sfx/md/hero_decorative-celebration-01.mp3",
      "/src/sounds/sfx/md/state-change_confirm-down.mp3",
      "/src/sounds/sfx/md/hero_decorative-celebration-02.mp3",
      "/src/sounds/sfx/md/state-change_confirm-up.mp3",
      "/src/sounds/sfx/md/hero_decorative-celebration-03.mp3",
      "/src/sounds/sfx/md/MazeImpact5.mp3",
      "/src/sounds/sfx/md/ui_camera-shutter.mp3",
      "/src/sounds/sfx/md/navigation_backward-selection-minimal.mp3",
      "/src/sounds/sfx/md/ui_loading.mp3",
      "/src/sounds/sfx/md/navigation_backward-selection.mp3",
      "/src/sounds/sfx/md/ui_lock.mp3",
      "/src/sounds/sfx/md/navigation_forward-selection.mp3",
      "/src/sounds/sfx/md/ui_tap-variant-01.mp3",
      "/src/sounds/sfx/md/navigation_selection-complete-celebration.mp3",
      "/src/sounds/sfx/md/ui_unlock.mp3",
      "/src/images/404-dark-2.svg",
      "/src/images/analytics.svg",
      "/src/images/account.svg",
      "/src/images/account-add.svg",
      "/src/images/hacker.svg",
      "/src/images/wallet-green.svg",
      "/src/images/world_blue.jpg",
      "/src/images/404-dark.svg",
      "/src/images/segment.svg",
      "/src/images/security.svg",
      "/src/images/share.svg",
      "/src/images/transfer.svg",
      "/src/images/wallet.svg",
      "/src/images/data.svg",
      "/src/images/dust_overlay.png",
      "/src/images/logo-transparent.png",
      "/src/images/personal-finance.svg",
      "/src/images/statistics.svg",
      "/src/images/card.svg",
      "/src/images/favicon.ico",
      "/src/images/pig-coins.svg",
      "/src/images/pixelart_card.png",
      "/src/images/swap.svg",
      "/src/images/invest.svg",
      "/src/images/investment-data.svg",
      "/src/images/open.svg",
      "/src/images/trade.svg",
    ]);
  }));
});

self.addEventListener("fetch", function(event) {

  const url = event.request.url;

  if (url.includes("upload")) {
    return;
  }

  if((url.includes(".png") || url.includes(".jpg") || url.includes(".jpeg") || url.includes(".gif")) && event.request.mode !== "same-origin") {

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


  }else if(url.includes("client.min.js") && event.request.mode === "same-origin") {

    // Return the same index.html page for all navigation query
    event.respondWith( caches.match("/client.min.js").then(function (response) {
      return (
          response || fetch(event.request).then(function (response){return response})
      );
    }));

  }else if(event.request.mode === "navigate") {

    // Return the same index.html page for all navigation query
    event.respondWith( caches.match("/index.html").then(function (response) {
      return (
          response || fetch(event.request).then(function (response) {return response})
      );
    }));
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