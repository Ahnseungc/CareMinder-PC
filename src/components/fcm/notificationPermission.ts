import { getToken } from "firebase/messaging";
import { registerServiceWorker } from "./registerServiceWorker";
import axiosInstance from "@utils/axios/axiosInstance";
import { messaging } from "./initFirebase";

export async function handleAllowNotification() {
  registerServiceWorker(); // 나중에 설명
  try {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey:
          "BDOPhFvQMqh6P-qImnWLcs_eCrPP04JOZ3MYUS1aPhdrsxq1HrliVRIaIcC7mMr2Xcw7zYQyVvEtuTD8D3ux1pU",
      });
      console.log("token", token);
      if (token) {
        await axiosInstance.post(
          `/fcm/save`,
          {},
          {
            headers: {
              FcmToken: token,
            },
          },
        );
      } else {
        alert("토큰 등록이 불가능 합니다. 생성하려면 권한을 허용해주세요");
      }
    } else if (permission === "denied") {
      alert("web push 권한이 차단되었습니다. 알림을 사용하시려면 권한을 허용해주세요");
    }
  } catch (error) {
    console.error("푸시 토큰 가져오는 중에 에러 발생", error);
  }
}
