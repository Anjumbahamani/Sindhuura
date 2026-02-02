/* public/firebase-messaging-sw.js */
importScripts("https://www.gstatic.com/firebasejs/9.6.11/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.11/firebase-messaging-compat.js");

// Paste the same config as in src/firebase.js (no env here)
firebase.initializeApp({
  apiKey: "<YOUR_API_KEY>",
  authDomain: "<YOUR_AUTH_DOMAIN>",
  projectId: "<YOUR_PROJECT_ID>",
  messagingSenderId: "<YOUR_SENDER_ID>",
  appId: "<YOUR_APP_ID>",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message:", payload);
  const notification = payload.notification || {};
  const title = notification.title || "Sindhuura Matrimony";
  const options = {
    body: notification.body,
    icon: "/favicon.ico", // or your own icon
  };

  self.registration.showNotification(title, options);
});