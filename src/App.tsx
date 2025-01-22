import { RouterProvider } from "react-router-dom";
import AppRegister from "@libraries/index";
import Router from "@routes/router";

export default function App() {
  return (
    <AppRegister>
      {/* <HashRouter>
        <RouterProvider router={Router} fallbackElement={null} />
      </HashRouter> */}
      <RouterProvider router={Router} fallbackElement={null} />
    </AppRegister>
  );
}
