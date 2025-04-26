importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

// Initialize Firebase
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

// Optional: Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/assets/icon/favicon.png' // Optional: Add your app's icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
