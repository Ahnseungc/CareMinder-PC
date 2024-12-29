importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js");

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
  const message = JSON.parse(payload.data.data);

  let notificationTitle = "";
  let notificationOptions = {
    body: "",
  };

  if (message.content.message) {
    notificationTitle = `${message.content.patientName} : ${message.content.requestTitle}`;
    notificationOptions = {
      body: message.content.message,
      // icon: "/logo.svg",
    };
  } else {
    notificationTitle = message.content.patientName;
    notificationOptions = {
      body: message.content.requestContent,
      // icon: "/logo.svg",
    };
  }

  self.registration.showNotification(notificationTitle, notificationOptions);
});
