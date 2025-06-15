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

// self.addEventListener("fetch", (e) => {
//   console.log(e);
//   console.log("fetching...", e.request.url);
//   e.respondWith(
//     caches
//       .match(e.request)
//       .then((res) => {
//         if (!res || res.status === 404) {
//           return caches.match("/Demo2/pages/404.html");
//         }
//         // console.log("Serving from cache:", e.request.url);
//         return res;

//         // console.log("Fetching from network:",e.request.url)
//         // return fetch(e.request)
//       }).then((fetchRes) => {
//         return caches.open(staticDB).then((cache) => {
//           cache.put(e.request, fetchRes.clone());
//           return fetchRes;
//         })
//       })
//       .catch((err) => {
//         console.log(err);
//         return caches.match("/Demo2/pages/offline.html");
//       })
//   );
// });



self.addEventListener("fetch", (e) => {
  e.respondWith(
    fetch(e.request)
      .then((networkRes) => {
        // ✅ حفظ نسخة في الكاش
        const clone = networkRes.clone();
        caches.open(staticDB).then((cache) => {
          cache.put(e.request, clone);
        });
        return networkRes;
      })
      .catch(() => {
        // ❌ الشبكة فشلت - نحاول الكاش
        return caches.match(e.request).then((cachedRes) => {
          if (cachedRes) {
            return cachedRes;
          }

          // ✅ لو كان تنقل (يعني صفحة HTML غالبًا)، رجّع 404.html
          if (e.request.mode === "navigate") {
            return caches.match("/Demo2/pages/404.html");
          }

          // ✅ لو حاجة تانية ورجعناش حاجة، رجع offline.html
          return caches.match("/Demo2/pages/offline.html");
        });
      })
  );
});
