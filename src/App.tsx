import { RouterProvider } from "react-router-dom";
import AppRegister from "@libraries/index";
import Router from "@routes/router";

export default function App() {
  console.log("테스트1123")
  return (
    <AppRegister>
      <RouterProvider router={Router} fallbackElement={null} />
    </AppRegister>
  );
}
