import SignOutButton from "@components/layout/header/SignOutButton";
import { LayoutType } from "@components/layout/sidebar";
import { Box, Stack, styled, Typography } from "@mui/material";
import AdminListTable from "./AdminListTable";

export default function SuperAdminPage() {
  return (
    <Container>
      <Layout adminType="admin">
        <Typography variant="h1" sx={{ color: "white" }}>
          SuperAdmin
        </Typography>
        <Typography>
          <HeaderContainer>
            <SignOutButton />
          </HeaderContainer>
        </Typography>
      </Layout>
      <Body>
        <SideLayout adminType="admin"></SideLayout>
        <OuterContainer>
          <InnerOtherContainer>
            <SubContainer>
              <HeadContainer>
                <div>
                  <Title variant="h1">어드민 계정 대기</Title>
                </div>
                <div style={{ width: "131.37px" }}></div>
              </HeadContainer>
              <BodyContainer>
                <AdminListTable />
              </BodyContainer>
            </SubContainer>
          </InnerOtherContainer>
        </OuterContainer>
      </Body>
    </Container>
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

  ...(adminType === "admin" && {
    backgroundColor: theme.palette.success.dark,
  }),
}));

const SideLayout = styled(Stack)<LayoutType>(({ adminType, theme }) => ({
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

  ...(adminType === "admin" && {
    backgroundColor: theme.palette.success.dark,
  }),
}));

const HeaderContainer = styled(Box)({
  display: "flex",
  alignItems: "flex-start",
  gap: "20px",
});

const Container = styled(Stack)(({ theme }) => ({
  minHeight: "100vh",
  backgroundColor: theme.palette.primary.main,
}));

const Body = styled(Box)({
  display: "flex",
  minHeight: "100vh",
});

const OuterContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  marginTop: "64px", // header
  marginLeft: "72px", // sidebar
  backgroundColor: theme.palette.background.default,
}));

const InnerOtherContainer = styled(Stack)(({ theme }) => ({
  margin: "30px",
  padding: "30px",
  borderRadius: "24px",
  backgroundColor: theme.palette.background.paper,
}));

const SubContainer = styled(Stack)({
  height: "100%",
  padding: "31.6px 0",
});

const HeadContainer = styled(Stack)({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",

  marginBottom: "50px",
});

const BodyContainer = styled(Box)({
  marginBottom: "32px",
});

const Title = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.dark,
  textTransform: "uppercase",
  lineHeight: "24px",
  letterSpacing: "-3%",
}));
