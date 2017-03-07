self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.');
  console.log('[Service Worker] Push had this data:', event.data.json());
  var data = event.data.json();
  var title = data.title;
  var options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click Received.');

  event.notification.close();

  event.waitUntil(
    clients.openWindow('https://developers.google.com/web/')
  );
});