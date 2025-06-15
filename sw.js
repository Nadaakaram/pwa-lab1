const filesCache = [
  "/Demo2/index.html",
  "/Demo2/page1.html",
  "/Demo2/Css/main.css",
  "/Demo2/pages/offline.html",
  "/Demo2/pages/404.html",
];

const staticDB = "pages";

self.addEventListener("install", (e) => {
  console.log("installing...");
  e.waitUntil(
    caches
      .open(staticDB)
      .then((cache) => {
        return cache.addAll(filesCache);
      })
      .catch((err) => {
        console.log(err);
      })
  );
});

self.addEventListener("activate", (e) => {
  console.log("activating...");
});


self.addEventListener("fetch", (e) => {
  e.respondWith(
    fetch(e.request)
      .then((networkRes) => {
        const clone = networkRes.clone();
        caches.open(staticDB).then((cache) => {
          cache.put(e.request, clone);
        });
        return networkRes;
      })
      .catch(() => {
        return caches.match(e.request).then((cachedRes) => {
          if (cachedRes) {
            return cachedRes;
          }

          if (e.request.mode === "navigate") {
            return caches.match("/Demo2/pages/404.html");
          }

          return caches.match("/Demo2/pages/offline.html");
        });
      })
  );
});
