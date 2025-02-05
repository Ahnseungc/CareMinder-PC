import { RouterProvider } from "react-router-dom";
import AppRegister from "@libraries/index";
import Router from "@routes/router";

export default function App() {
  console.log("VITE_SERVER_URL:", import.meta.env.VITE_SEVER_URL);
  console.log("VITE_SW_SERVER_URL:", import.meta.env.VITE_SW_SEVER_URL);

  return (
    <AppRegister>
      <RouterProvider router={Router} fallbackElement={null} />
    </AppRegister>
  );
}
