import { useEffect, useState } from "react";
import { EventSourcePolyfill, MessageEvent } from "event-source-polyfill";
import Cookies from "js-cookie";
import { isElectron } from "./isElectron";

const SERVER_URL = import.meta.env.VITE_SEVER_URL;

type SSEMessageType = {
  content: {
    areaName: string;
    patientName: string;
    patientRequestId: number;
    requestTitle?: string;
    message?: string;
    requestContent?: string;
  };
  notificationId: string;
  type: string;
};

export function useSSE({ checkType, userType }: { checkType: string; userType: string }) {
  const [message, setMessage] = useState<SSEMessageType | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // ✅ 토큰 가져오기
    const accessTokenWard = Cookies.get("accessTokenWard");
    // const accessTokenStaff = Cookies.get("accessTokenStaff");
    // let token = userType === "WARD" ? accessTokenWard : accessTokenStaff;
    let token = accessTokenWard;

    if (!token) {
      console.error("🚨 토큰이 없습니다. SSE 연결 중단.");
      return;
    }

    console.log("🟢 SSE 연결 시도 중...");

    // ✅ SSE 연결
    const eventSource = new EventSourcePolyfill(`${SERVER_URL}/sse/open`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "text/event-stream",
      },
      withCredentials: true,
    });

    eventSource.onopen = () => {
      console.log("✅ SSE 연결 성공!");
      setIsConnected(true);
    };

    // ✅ 이벤트 리스너
    //@ts-ignore
    eventSource.addEventListener(checkType, (event: MessageEvent) => {
      const jsonData = JSON.parse(event.data);
      console.log("📩 SSE 이벤트 수신:", jsonData);

      if (isElectron()) {
        console.debug(
          JSON.stringify({
            type: "Notification",
            data: `${JSON.stringify(jsonData)}`,
          }),
        );
      } else {
        setMessage(jsonData);
      }
      const audio = new Audio("alarm.wav"); // public 폴더 내 파일
      audio.play().catch(error => console.error("🔇 알림 소리 재생 실패:", error));
    });

    // ✅ 에러 핸들링
    eventSource.onerror = error => {
      console.error("🚨 SSE 오류 발생:", error);
      setIsConnected(false);
      eventSource.close();
    };

    // ✅ Cleanup (컴포넌트 언마운트 시 연결 해제)
    return () => {
      console.log("🛑 SSE 연결 종료");
      setIsConnected(false);
      eventSource.close();
    };
  }, [checkType, userType]);

  return { message, isConnected };
}
