import { ReactComponent as Notice } from "@assets/menuIcons/notice.svg";
import MenuLayout from "./MenuLayout";
import RoutePath from "@routes/routePath";
import { useRecoilValue } from "recoil";
import { userState } from "@libraries/recoil";
import { UserType } from "@models/user";
import { SwitchCase } from "@toss/react";

export default function NoticeMenu() {
  const user = useRecoilValue(userState);
  return (
    <SwitchCase
      value={user?.type as UserType}
      caseBy={{
        main: <MenuLayout routePath={RoutePath.StaffNotice} pageName={"공지"} icon={Notice} />,
        staff: <MenuLayout routePath={RoutePath.StaffNotice} pageName={"공지"} icon={Notice} />,
      }}
    />
  );
}
