import { RouterProvider } from "react-router-dom";
import AppRegister from "@libraries/index";
import Router from "@routes/router";

export default function App() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then(registration => {
        console.log("Service Worker 등록 성공:", registration);
      })
      .catch(error => {
        console.error("Service Worker 등록 실패:", error);
      });
  }
  return (
    <AppRegister>
      <RouterProvider router={Router} fallbackElement={null} />
    </AppRegister>
  );
}
