importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js");

self.addEventListener("install", function (e) {
  console.log("실행중?");
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  console.log("fcm service worker가 실행되었습니다.");
});

const firebaseConfig = {
  apiKey: "AIzaSyDr2aG0diglJe-A-lC9VqpfLnoEz1Baj4I",
  authDomain: "careminder-e50ae.firebaseapp.com",
  projectId: "careminder-e50ae",
  storageBucket: "careminder-e50ae.firebasestorage.app",
  messagingSenderId: "264563409584",
  appId: "1:264563409584:web:228f2d074c73b057023175",
  measurementId: "G-CW3VDEXZ1F",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  console.log("payload", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    // icon: payload.icon
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
