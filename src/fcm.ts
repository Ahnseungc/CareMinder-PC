// const firebaseConfig = {
//   apiKey: "AIzaSyDr2aG0diglJe-A-lC9VqpfLnoEz1Baj4I",
//   authDomain: "careminder-e50ae.firebaseapp.com",
//   projectId: "careminder-e50ae",
//   storageBucket: "careminder-e50ae.firebasestorage.app",
//   messagingSenderId: "264563409584",
//   appId: "1:264563409584:web:228f2d074c73b057023175",
//   measurementId: "G-CW3VDEXZ1F",
// };

// const app = initializeApp(firebaseConfig);
// const messaging = getMessaging(app);

// self.addEventListener("install", function (e) {
//   console.log(e);
// });

// self.addEventListener("activate", function (e) {
//   console.log("fcm sw activate..");
// });

// const token = await getToken(messaging, {
//   vapidKey:
//     "BDOPhFvQMqh6P-qImnWLcs_eCrPP04JOZ3MYUS1aPhdrsxq1HrliVRIaIcC7mMr2Xcw7zYQyVvEtuTD8D3ux1pU",
// });
// console.log("token", token);

// if (token) {
//   console.log("token: ", token);
//   await axiosInstance.post(
//     `/fcm/save`,
//     {},
//     {
//       headers: {
//         FcmToken: token,
//       },
//     },
//   );
//   // mutate(token);
// } else console.log("Can not get Token");

// async function requestPermission() {
//   const permission = await Notification.requestPermission();
//   if (permission === "denied") return; // 알림 허용 X 상태
//   console.log("허용");

//   if (token) {
//     console.log("token: ", token);
//     const res = await axiosInstance.post(
//       `/fcm/save`,
//       {},
//       {
//         headers: {
//           FcmToken: token,
//         },
//       },
//     );
//     console.log(res);
//     // mutate(token);
//   } else console.log("Can not get Token");

//   // 알림 수신 처리
//   //   onMessage(messaging, payload => {
//   //     console.log("메시지가 도착했습니다.", payload);
//   //     console.log("메시지가 도착했습니다.", messaging);
//   //     // ...
//   //   });
//   console.log("_____");
// }

// requestPermission();
