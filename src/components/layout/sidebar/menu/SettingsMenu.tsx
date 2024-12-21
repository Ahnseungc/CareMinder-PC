import { ReactComponent as Settings } from "@assets/menuIcons/settings.svg";
import MenuLayout from "./MenuLayout";
import RoutePath from "@routes/routePath";
import { SwitchCase } from "@toss/react";
import { UserType } from "@models/user";
import { useRecoilValue } from "recoil";
import { userState } from "@libraries/recoil";

export default function SettingsMenu() {
  const user = useRecoilValue(userState);
  return (
    <SwitchCase
      value={user?.type as UserType}
      caseBy={{
        WARD: <MenuLayout routePath={RoutePath.Settings} pageName="설정" icon={Settings} />,
        STAFF: <MenuLayout routePath={RoutePath.StaffSettings} pageName="설정" icon={Settings} />,
      }}
    />
  );
}
