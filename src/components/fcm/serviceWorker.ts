export function registerServiceWorker(): Promise<ServiceWorkerRegistration> {
  return new Promise((resolve, reject) => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then(registration => {
          console.log("Service Worker 등록 성공:", registration);
          resolve(registration); // ServiceWorkerRegistration 반환
        })
        .catch(error => {
          console.error("Service Worker 등록 실패:", error);
          reject(error); // 등록 실패 시 reject
        });
    } else {
      reject(new Error("서비스 워커를 지원하지 않는 브라우저입니다."));
    }
  });
}

export const logoutServiceWorker = () => {
  // 서비스 워커 제거
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => {
      registration.unregister().then(success => {
        if (success) {
          console.log("서비스 워커 제거 성공:", registration);
        } else {
          console.log("서비스 워커 제거 실패:", registration);
        }
      });
    });
  });

  // 추가로 로그아웃 처리 로직 (예: 토큰 삭제)
  console.log("사용자 로그아웃 완료");
};
