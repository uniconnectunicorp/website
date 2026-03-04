const CACHE_NAME = "uniconnect-sw-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  if (!event.data) return;
  const data = event.data.json();
  const options = {
    body: data.body || "",
    icon: "/android-chrome-192x192.png",
    badge: "/favicon-32x32.png",
    tag: data.tag || "notificacao",
    renotify: true,
    requireInteraction: false,
    data: { url: data.url || "/admin/crm-pipeline" },
  };
  event.waitUntil(self.registration.showNotification(data.title || "UniConnect", options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/admin/crm-pipeline";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(url) && "focus" in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(url);
      }
    })
  );
});

// Mensagem do cliente para mostrar notificação local (sem push server)
self.addEventListener("message", (event) => {
  if (event.data?.type === "SHOW_NOTIFICATION") {
    const { title, body, url, tag } = event.data;
    self.registration.showNotification(title, {
      body,
      icon: "/android-chrome-192x192.png",
      badge: "/favicon-32x32.png",
      tag: tag || "notificacao",
      renotify: true,
      requireInteraction: false,
      data: { url: url || "/admin/crm-pipeline" },
    });
  }
});
