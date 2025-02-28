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
import { styled } from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";

export default function StaffSidebar() {
  return (
    <Wrapper>
      <div>
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
      </div>
      <div style={{ cursor: "pointer" }}>
        <PublicIcon fontSize="large" color="disabled" />
        <Lan>Ko | en</Lan>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled("div")`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-bottom: 20px;
  justify-content: space-between;
  align-items: center;
`;
const Lan = styled("div")`
  font-size: 12px;
  color: #c8c6c6;
  font-weight: 700;
`;
