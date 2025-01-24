import AdminSidebar from "./AdminSidebar";
import UserSidebar from "./UserSidebar";
import StaffSidebar from "./StaffSidebar";

import { userState } from "@libraries/recoil";
import { UserType } from "@models/user";
import { Stack, styled } from "@mui/material";
import { SwitchCase } from "@toss/react";
import { useRecoilValue } from "recoil";

export type LayoutType = {
  admintype: UserType;
};

export default function Sidebar() {
  const user = useRecoilValue(userState);

  console.log(user);

  return (
    <Layout admintype={user?.type as UserType}>
      <SwitchCase
        value={user?.type as UserType}
        caseBy={{
          WARD: <UserSidebar />,
          STAFF: <StaffSidebar />,
          ADMIN: <AdminSidebar />,
        }}
      />
    </Layout>
  );
}

/** styles */

const Layout = styled(Stack)<LayoutType>(({ admintype, theme }) => ({
  position: "fixed",
  left: 0,
  top: "64px",
  width: "72px",
  minHeight: "max-content",
  height: "calc(100vh - 64px)",
  overflowY: "auto",
  alignItems: "center",
  gap: "14px",
  padding: "16px 0",
  backgroundColor: theme.palette.primary.main,
  zIndex: "10",

  ...(admintype === "STAFF" && {
    backgroundColor: theme.palette.secondary.main,
  }),
  ...(admintype === "ADMIN" && {
    backgroundColor: theme.palette.success.light,
  }),
}));
