import {
  HomeMenu,
  // RequestsMenu,
  PatientManagementMenu,
  CompletedRequestsMenu,
  // NoticeMenu,
  SettingsMenu,
} from "@components/layout/sidebar/menu";
import { styled } from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";

export default function UserSidebar() {
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
