import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDr2aG0diglJe-A-lC9VqpfLnoEz1Baj4I",
  authDomain: "careminder-e50ae.firebaseapp.com",
  projectId: "careminder-e50ae",
  storageBucket: "careminder-e50ae.firebasestorage.app",
  messagingSenderId: "264563409584",
  appId: "1:264563409584:web:228f2d074c73b057023175",
  measurementId: "G-CW3VDEXZ1F",
};

export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

console.log(app);
