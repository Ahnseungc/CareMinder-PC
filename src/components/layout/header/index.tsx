import UserHeader from "./UserHeader";
import { userState } from "@libraries/recoil";
import { UserType } from "@models/user";
import { Box, styled } from "@mui/material";
import { SwitchCase } from "@toss/react";
import { useRecoilValue } from "recoil";
import { LayoutType } from "../sidebar";
import AdminHeader from "./AdminHeader";

export default function Header() {
  const user = useRecoilValue(userState);

  return (
    <Layout adminType={user?.type as UserType}>
      <SwitchCase
        value={user?.type as UserType}
        caseBy={{
          WARD: <UserHeader />,
          STAFF: <UserHeader />,
          ADMIN: <AdminHeader />,
        }}
      />
    </Layout>
  );
}

const Layout = styled(Box)<LayoutType>(({ theme, adminType }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "64px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "14px 28px",
  zIndex: "10",

  backgroundColor: theme.palette.primary.main,
  ...(adminType === "STAFF" && {
    backgroundColor: theme.palette.secondary.main,
  }),
  ...(adminType === "ADMIN" && {
    backgroundColor: theme.palette.success.light,
  }),
}));
