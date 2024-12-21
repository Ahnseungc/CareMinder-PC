// 서비스 워크 등록
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration> {
  if ("serviceWorker" in navigator) {
    try {
      const existingRegistrations = await navigator.serviceWorker.getRegistrations();

      if (existingRegistrations.length > 0) {
        return existingRegistrations[0]; // 기존 등록 된 거 반환
      }

      const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
      return registration; // 새로 등록 성공 시 반환
    } catch (error) {
      throw error; // 실패 시 에러 던짐
    }
  } else {
    throw new Error("서비스 워커를 지원하지 않는 브라우저입니다.");
  }
}

// 서비스 워커 제거
export const logoutServiceWorker = async () => {
  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
    }

    // 추가로 로그아웃 처리 로직 (예: 토큰 삭제)
    console.log("사용자 로그아웃 완료");
  } catch (error) {
    console.error("서비스 워커 제거 중 에러 발생:", error);
  }
};
