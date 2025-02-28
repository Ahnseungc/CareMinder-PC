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
import { useTranslation } from "react-i18next";

export default function UserSidebar() {
  const { t, i18n } = useTranslation();

  const changeLanguage = () => {
    const newLang = i18n.language === "en" ? "ko" : "en";
    i18n.changeLanguage(newLang);
  };

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
      <div style={{ cursor: "pointer" }} onClick={changeLanguage}>
        <PublicIcon fontSize="large" color="disabled" />
        <Lan>{t("en")}</Lan>
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
  font-size: 15px;
  color: #c8c6c6;
  font-weight: 600;
  text-align: center;
`;
