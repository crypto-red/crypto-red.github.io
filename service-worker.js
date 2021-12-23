var REQUIRED_CACHE = "network-or-cache-v1-r";
var USEFUL_CACHE = "network-or-cache-v1-u";
var STATIC_CACHE = "network-or-cache-v1-s";

// On install, cache some resource.
self.addEventListener("install", function(evt) {

  // Open a cache and use `addAll()` with an array of assets to add all of them
  // to the cache. Ask the service worker to keep installing until the
  // returning promise resolves.
  evt.waitUntil(caches.open(REQUIRED_CACHE).then(function (cache) {

    return cache.addAll([
      "/",
      "/index.html",
      "/404.html",
      "/client.min.js",
      "/src/fonts/NotoSans-Regular.woff2",
      "/src/fonts/SpecialElite-Regular.woff2",
      "/src/fonts/NotoSansMono-Regular.woff2",
      "/src/fonts/ShareTechMono-Regular.woff2",
      "/src/fonts/Saira-Regular.woff2",
    ]);
  }));

  evt.waitUntil(caches.open(USEFUL_CACHE).then(function (cache) {
    return cache.addAll([]);
  }));

  evt.waitUntil(caches.open(STATIC_CACHE).then(function (cache) {
    return cache.addAll([]);
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
        caches.open(STATIC_CACHE).then(function (cache) {
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


  }else if(url.includes("0.client.min.js") && event.request.mode === "same-origin") {

    event.respondWith(
        caches.open(USEFUL_CACHE).then(function (cache) {
          return cache.match("/0.client.min.js").then(function (response) {
            return (
                response ||
                fetch(event.request).then(function (response) { // Fetch, clone, and serve
                  cache.put(event.request, response.clone());
                  return response;
                })
            );
          });
        })
    );

  }else if(url.includes("1.client.min.js") && event.request.mode === "same-origin") {

    event.respondWith(
        caches.open(USEFUL_CACHE).then(function (cache) {
          return cache.match("/1.client.min.js").then(function (response) {
            return (
                response ||
                fetch(event.request).then(function (response) { // Fetch, clone, and serve
                  cache.put(event.request, response.clone());
                  return response;
                })
            );
          });
        })
    );

  }else if(url.includes("2.client.min.js") && event.request.mode === "same-origin") {

    event.respondWith(
        caches.open(USEFUL_CACHE).then(function (cache) {
          return cache.match("/2.client.min.js").then(function (response) {
            return (
                response ||
                fetch(event.request).then(function (response) { // Fetch, clone, and serve
                  cache.put(event.request, response.clone());
                  return response;
                })
            );
          });
        })
    );

  }else if(url.includes("3.client.min.js") && event.request.mode === "same-origin") {

    event.respondWith(
        caches.open(USEFUL_CACHE).then(function (cache) {
          return cache.match("/3.client.min.js").then(function (response) {
            return (
                response ||
                fetch(event.request).then(function (response) { // Fetch, clone, and serve
                  cache.put(event.request, response.clone());
                  return response;
                })
            );
          });
        })
    );

  }else if(url.includes("4.client.min.js") && event.request.mode === "same-origin") {

    event.respondWith(
        caches.open(USEFUL_CACHE).then(function (cache) {
          return cache.match("/4.client.min.js").then(function (response) {
            return (
                response ||
                fetch(event.request).then(function (response) { // Fetch, clone, and serve
                  cache.put(event.request, response.clone());
                  return response;
                })
            );
          });
        })
    );

  }else if(url.includes("5.client.min.js") && event.request.mode === "same-origin") {

    event.respondWith(
        caches.open(USEFUL_CACHE).then(function (cache) {
          return cache.match("/5.client.min.js").then(function (response) {
            return (
                response ||
                fetch(event.request).then(function (response) { // Fetch, clone, and serve
                  cache.put(event.request, response.clone());
                  return response;
                })
            );
          });
        })
    );

  }else if(url.includes("client.min.js") && event.request.mode === "same-origin") {

    event.respondWith(
        caches.open(REQUIRED_CACHE).then(function (cache) {
          return cache.match("/client.min.js").then(function (response) {
            return (
                response ||
                fetch(event.request).then(function (response) { // Fetch, clone, and serve
                  cache.put(event.request, response.clone());
                  return response;
                })
            );
          });
        })
    );

  }else if(event.request.mode === "navigate") {

    // Return the same index.html page for all navigation query
    caches.open(REQUIRED_CACHE).then(function (cache) {
      return cache.match("/index.html").then(function (response) {
        return (
            response ||
            fetch(event.request).then(function (response) { // Fetch, clone, and serve
              cache.put(event.request, response.clone());
              return response;
            })
        );
      });
    });
  }else {

    caches.open(REQUIRED_CACHE).then(function (cache) {
      return cache.match(event.request).then(function (response) {
        if(response) { return response }
      });
    });

    caches.open(USEFUL_CACHE).then(function (cache) {
      return cache.match(event.request).then(function (response) {
        if(response) { return response }
      });
    });

    caches.open(STATIC_CACHE).then(function (cache) {
      return cache.match(event.request).then(function (response) {

        return (
            response ||
            fetch(event.request).then(function (response) { // Fetch, clone, and serve
              cache.put(event.request, response.clone());
              return response;
            })
        );

      });
    });

  }
});

self.addEventListener("activate", function(event) {

  event.waitUntil(caches.open(USEFUL_CACHE).then(function (cache) {

    return cache.addAll([
      "/0.client.min.js",
      "/1.client.min.js",
      "/2.client.min.js",
      "/3.client.min.js",
      "/4.client.min.js",
      "/5.client.min.js",
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

  event.waitUntil(caches.open(STATIC_CACHE).then(function (cache) {

    return cache.addAll([
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
    ]);
  }));

  event.waitUntil(
      caches.keys().then(function(cache_names) {
        return Promise.all(
            cache_names.filter(function(cache_name) {

              return Boolean(cache_name !== REQUIRED_CACHE && cache_name !== USEFUL_CACHE && cache_name !== STATIC_CACHE);
            }).map(function(cache_name) {

              return caches.delete(cache_name);
            })
        );
      })
  );
});