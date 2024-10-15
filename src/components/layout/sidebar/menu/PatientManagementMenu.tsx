import { ReactComponent as PatientManagement } from "@assets/menuIcons/patientManage.svg";
import MenuLayout from "./MenuLayout";
import RoutePath from "@routes/routePath";

export default function PatientManagementMenu() {
  return (
    <MenuLayout
      routePath={RoutePath.StaffWardInOut}
      pageName={"입퇴원 관리"}
      icon={PatientManagement}
    />
    // <SwitchCase
    //   value={user?.type as UserType}
    //   caseBy={{
    //     main: (
    //       <MenuLayout
    //         routePath={RoutePath.StaffWardInOut}
    //         pageName={"입퇴원 관리"}
    //         icon={PatientManagement}
    //       />
    //     ),
    //     staff: (
    //       <MenuLayout
    //         routePath={RoutePath.StaffWardInOut}
    //         pageName={"입퇴원 관리"}
    //         icon={PatientManagement}
    //       />
    //     ),
    //   }}
    // />
  );
}
