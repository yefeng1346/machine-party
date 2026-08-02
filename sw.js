self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    try {
      const subscription = await self.registration.pushManager.getSubscription();
      if (subscription) await subscription.unsubscribe();
    } catch (_) {
      // Continue cleanup if an old push subscription cannot be read.
    }

    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
    await self.registration.unregister();
  })());
});
