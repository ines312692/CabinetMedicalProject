
  importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
  importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

  const firebaseConfig = {
    apiKey: "AIzaSyB44xvEJeZM-z12PJlCO8RRCPWjnO8hfvI",
    authDomain: "appmedical-936e4.firebaseapp.com",
    projectId: "appmedical-936e4",
    storageBucket: "appmedical-936e4.appspot.com",
    messagingSenderId: "911828432393",
    appId: "1:911828432393:web:a2e854d2e008aeba496ad8",
    measurementId: "G-N242QXWRME"
  };

  firebase.initializeApp(firebaseConfig);

  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message:', payload);

    const notificationTitle = payload.notification?.title || 'New Notification';
    const notificationOptions = {
      body: payload.notification?.body || 'You have a new message.',
      icon: '/assets/icon/favicon.png',
      data: payload.data
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });

  self.addEventListener('notificationclick', (event) => {
    console.log('[firebase-messaging-sw.js] Notification clicked:', event.notification.data);
    event.notification.close();

    const urlToOpen = event.notification.data?.url || '/';
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
        for (let client of windowClients) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
    );
  });
