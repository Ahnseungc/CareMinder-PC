import SignOutButton from "./SignOutButton";
import { Box, styled, Typography } from "@mui/material";

export default function AdminHeader() {
  return (
    <>
      <Typography variant="h1" sx={{ color: "white" }}>
        Administrator
      </Typography>
      <Typography>
        <HeaderContainer>
          <SignOutButton />
        </HeaderContainer>
      </Typography>
    </>
  );
}

const HeaderContainer = styled(Box)({
  display: "flex",
  alignItems: "flex-start",
  gap: "20px",
});
