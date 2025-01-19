import { lazy } from "react";

// export { default as StaffWardInoutManagementPage } from "./staff/StaffWardInoutManagementPage";
// export { default as StaffNoticePage } from "./staff/StaffNoticePage";
// export { default as StaffNoticeWritePage } from "./staff/StaffNoticeWritePage";
// export { default as StaffSettingsPage } from "./staff/StaffSettingsPage";

// export { default as CompletedRequestsPage } from "./user/CompletedRequestsPage";
// export { default as DietPage } from "./user/DietPage";
// export { default as MainHomePage } from "./user/MainHomePage";
// export { default as NoticePage } from "./user/NoticePage";
// export { default as PatientManagementPage } from "./user/PatientManagementPage";
// export { default as RequestsPage } from "./user/RequestsPage";
// export { default as SettingsPage } from "./user/SettingsPage";

// export { default as AdminSigninPage } from "./signin/AdminSigninPage";
// export { default as SigninPage } from "./signin/SigninPage";

export const StaffWardInoutManagementPage = lazy(
  () => import("./staff/StaffWardInoutManagementPage"),
);
export const StaffNoticePage = lazy(() => import("./staff/StaffNoticePage"));
export const StaffNoticeWritePage = lazy(() => import("./staff/StaffNoticeWritePage"));
export const StaffSettingsPage = lazy(() => import("./staff/StaffSettingsPage"));

export const CompletedRequestsPage = lazy(() => import("./user/CompletedRequestsPage"));
export const DietPage = lazy(() => import("./user/DietPage"));
export const MainHomePage = lazy(() => import("./user/MainHomePage"));
export const NoticePage = lazy(() => import("./user/NoticePage"));
export const PatientManagementPage = lazy(() => import("./user/PatientManagementPage"));
export const RequestsPage = lazy(() => import("./user/RequestsPage"));
export const SettingsPage = lazy(() => import("./user/SettingsPage"));

export const AdminSigninPage = lazy(() => import("./signin/AdminSigninPage"));
export const SigninPage = lazy(() => import("./signin/SigninPage"));
