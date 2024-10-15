import { RouteObject, createBrowserRouter } from "react-router-dom";
import RoutePath from "@routes/routePath";
import AuthenticatedLayout from "@components/layout";
import AuthorizedRoute from "@routes/AuthorizedRoute";
import {
  AdminSigninPage,
  StaffWardInoutManagementPage,
  CompletedRequestsPage,
  DietPage,
  NoticePage,
  PatientManagementPage,
  RequestsPage,
  SettingsPage,
  SigninPage,
  StaffNoticeWritePage,
  StaffNoticePage,
} from "@pages/index";
import MainHomePage from "@pages/user/MainHomePage";
import StaffHomePage from "@pages/user/StaffHomePage";

const routes: RouteObject[] = [
  {
    path: RoutePath.Home,
    element: <AuthenticatedLayout />,
    children: [
      {
        element: <AuthorizedRoute allowedRoles={["main", "staff"]} />,
        children: [
          { index: true, element: <MainHomePage /> },
          { path: RoutePath.StaffHomePage, element: <StaffHomePage /> },
          { path: RoutePath.Settings, element: <SettingsPage /> },
        ],
      },
      {
        path: RoutePath.StaffWardManagement,
        element: <AuthorizedRoute allowedRoles={["staff"]} />,
        children: [
          { index: true, element: <MainHomePage /> },
          { path: RoutePath.StaffCompletedRequests, element: <CompletedRequestsPage /> },
          { path: RoutePath.StaffWardInOut, element: <StaffWardInoutManagementPage /> },
          { path: RoutePath.StaffNotice, element: <StaffNoticePage /> },
          { path: RoutePath.StaffNoticeWrite, element: <StaffNoticeWritePage /> },
        ],
      },
      {
        path: RoutePath.StaffWardManagement,
        element: <AuthorizedRoute allowedRoles={["admin"]} />,
        children: [{ path: RoutePath.AdminWardManagement, element: <div>어드민</div> }],
      },
    ],
  },
  { path: RoutePath.Signin, element: <SigninPage /> },
  { path: RoutePath.AdminSignin, element: <AdminSigninPage /> },
  { path: "*", element: <>Not found page</> },
];

const Router = createBrowserRouter(routes);

export default Router;
