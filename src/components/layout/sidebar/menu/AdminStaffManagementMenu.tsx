import { ReactComponent as Staff } from "@assets/menuIcons/staff.svg";
import MenuLayout from "./MenuLayout";
import RoutePath from "@routes/routePath";

export default function AdminStaffManagementMenu() {
  return (
    <MenuLayout
      routePath={RoutePath.AdminWardManagement}
      pageName={`스태프\n계정 관리`}
      icon={Staff}
    />
  );
}
