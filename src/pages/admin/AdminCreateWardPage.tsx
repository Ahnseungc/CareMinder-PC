import { Box, Stack, styled, Typography } from "@mui/material";
import { ReactComponent as EmptyStaff } from "@/assets/EmptyStaff.svg";
import CButton from "@components/common/atom/C-Button";
import { useBooleanState } from "@toss/react";
import TOSModal from "@components/settings/modal/TOSModal";
import CreateWardModal from "@components/admin/adminModal/CreateWardModal";

export default function AdminCreateWardPage() {
  const [openTOS, openTOSModal, closeTOSModal] = useBooleanState(false);
  const [open, openCreateModal, closeCreateModal] = useBooleanState(false);
  const handleTOS = () => {
    closeTOSModal();
    openCreateModal();
  };

  return (
    <>
      <CreateWardModal open={open} onClose={closeCreateModal} />
      <TOSModal open={openTOS} onClose={closeTOSModal} onConfirm={handleTOS} />
      <Container>
        <HeadContainer>
          <div>
            <Title variant="h1">병동 계정 생성</Title>
          </div>
          <div style={{ width: "131.37px" }}></div>
        </HeadContainer>
        <BodyContainer>
          <EmptyStaffContainer>
            <EmptyStaff />
            <EmptyText>등록된 병동 계정이 없습니다.</EmptyText>
            <div style={{ maxWidth: "148px" }}>
              <CButton buttontype="primarySpaureWhite" onClick={openTOSModal}>
                병동 계정 생성
              </CButton>
            </div>
          </EmptyStaffContainer>
        </BodyContainer>
      </Container>
    </>
  );
}
const Container = styled(Stack)({
  height: "100%",
  padding: "31.6px 0",
});

const HeadContainer = styled(Stack)({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
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

const EmptyStaffContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",

  gap: "32px",

  minHeight: "600px",
  marginBottom: "100px",
});

const EmptyText = styled(Typography)(({ theme }) => ({
  fontSize: "16px",
  lineHeight: "24px",
  fontWeight: "500",
  color: theme.palette.text.primary,
}));
