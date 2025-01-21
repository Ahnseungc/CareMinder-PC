export async function registerServiceWorker(): Promise<ServiceWorkerRegistration> {
  if ("serviceWorker" in navigator) {
    try {
      const existingRegistrations = await navigator.serviceWorker.getRegistrations();

      // 기존 등록된 서비스 워커 반환
      if (existingRegistrations.length > 0) {
        const existingRegistration = existingRegistrations[0];
        await navigator.serviceWorker.ready; // 활성화 대기
        return existingRegistration;
      }

      const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
      await navigator.serviceWorker.ready; // 활성화 대기
      return registration;
    } catch (error) {
      console.error("서비스 워커 등록 실패:", error);
      throw error;
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
