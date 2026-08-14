importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js",
);

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

firebase.initializeApp({
  apiKey: "AIzaSyDbisWCe49Qfi5UU9s2sWBkRaBiP-WBTsQ",
  authDomain: "words4web-e87a3.firebaseapp.com",
  projectId: "words4web-e87a3",
  storageBucket: "words4web-e87a3.firebasestorage.app",
  messagingSenderId: "221559289590",
  appId: "1:221559289590:web:f71b2f886d8a0388245ed7",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const data = payload?.data || {};

  const title = payload.notification?.title || data.title || "Agency OS";
  const body =
    payload.notification?.body || data.body || "New update received.";

  const notificationOptions = {
    body,
    icon: "/window.svg",
    badge: "/window.svg",
    color: "#4f46e5",
    data: data,
    vibrate: [200, 100, 200],
    requireInteraction: false,
    timestamp: Date.now(),
    tag: data?.ticketId || data?.type || "agency-os-general",
    renotify: true,
    actions: [
      {
        action: "view",
        title: data?.ticketId ? "View Ticket" : "View Board",
      },
    ],
  };

  self.registration.showNotification(title, notificationOptions);
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const data = event?.notification?.data || {};
  let targetPath = "/kanban";
  if (data?.ticketId) {
    targetPath = `/kanban?ticketId=${data?.ticketId}`;
  }

  const targetUrl = new URL(targetPath, self.location.origin);

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          try {
            const clientUrl = new URL(client.url);
            if (
              (clientUrl.pathname === "/kanban" ||
                clientUrl.pathname === targetPath) &&
              "focus" in client
            ) {
              if ("navigate" in client) {
                client.navigate(targetUrl.href);
              }
              return client.focus();
            }
          } catch (urlErr) {
            console.error("Failed to parse client URL:", urlErr);
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(targetUrl.href);
        }
      })
      .catch((err) => {
        console.error("Notification click handler failed:", err);
      }),
  );
});
