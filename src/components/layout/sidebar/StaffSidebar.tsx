import {
  HomeMenu,
  // RequestsMenu,
  PatientManagementMenu,
  CompletedRequestsMenu,
  // NoticeMenu,
  SettingsMenu,
  MenuLayout,
  // DietMenu,
} from "@components/layout/sidebar/menu";
import { ReactComponent as Settings } from "@assets/menuIcons/settings.svg";

export default function StaffSidebar() {
  return (
    <>
      <HomeMenu />
      {/* Todo */}
      {/* <DietMenu /> */}
      {/* <RequestsMenu /> */}
      <PatientManagementMenu />
      <CompletedRequestsMenu />
      {/* <NoticeMenu /> */}
      <SettingsMenu />

      {/* 베드로 병원 */}
      <MenuLayout routePath={"/settings"} pageName="병동 설정" icon={Settings} />
    </>
  );
}
