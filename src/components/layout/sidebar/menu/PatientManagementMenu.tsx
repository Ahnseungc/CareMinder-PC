import { ReactComponent as PatientManagement } from "@assets/menuIcons/patientManage.svg";
import MenuLayout from "./MenuLayout";
import RoutePath from "@routes/routePath";
import { useRecoilValue } from "recoil";
import { userState } from "@libraries/recoil";
import { SwitchCase } from "@toss/react";
import { UserType } from "@models/user";

export default function PatientManagementMenu() {
  const user = useRecoilValue(userState);
  return (
    <SwitchCase
      value={user?.type as UserType}
      caseBy={{
        WARD: (
          <MenuLayout
            routePath={RoutePath.StaffWardInOut}
            pageName={"입퇴원 관리"}
            icon={PatientManagement}
          />
        ),
        STAFF: (
          <MenuLayout
            routePath={RoutePath.StaffWardInOut}
            pageName={"입퇴원 관리"}
            icon={PatientManagement}
          />
        ),
      }}
    />
  );
}
