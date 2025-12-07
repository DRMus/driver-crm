// Обработчик push-уведомлений для Service Worker
// Этот файл будет включен в Service Worker через Workbox

self.addEventListener('push', (event) => {
  let data = {};
  
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'Уведомление', body: event.data.text() };
    }
  }

  const options = {
    title: data.title || 'Driver CRM',
    body: data.body || 'Новое уведомление',
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    data: data,
    requireInteraction: false,
    silent: false,
  };

  event.waitUntil(
    self.registration.showNotification(options.title, options)
  );
});

// Обработчик клика по уведомлению
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const data = event.notification.data;
  let url = '/';

  // Определяем URL на основе типа уведомления
  if (data && data.type === 'calendar_reminder' && data.eventId) {
    url = `/calendar?event=${data.eventId}`;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Если есть открытое окно, фокусируемся на нем
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      // Иначе открываем новое окно
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

