import {
  AdminCreateNewWard,
  AdminWardManagementMenu,
  StaffManageMenu,
} from "@components/layout/sidebar/menu";

export default function AdminSidebar() {
  return (
    <>
      <AdminCreateNewWard />
      <AdminWardManagementMenu />
      <StaffManageMenu />
    </>
  );
}
