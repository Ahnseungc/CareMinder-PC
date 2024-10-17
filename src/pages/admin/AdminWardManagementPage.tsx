import { Box, Stack, styled, Typography } from "@mui/material";
import CButton from "@components/common/atom/C-Button";
import PaginationComponent from "@components/common/pagination";
import WardManagementTable from "@components/admin/WardManagementTable";
import { useBooleanState } from "@toss/react";
import ChangeWardMoadl from "@components/admin/adminModal/ChangeWardModal";
import ChangeModal from "@components/settings/modal/ChangeModal";

export default function AdminWardManagementPage() {
  const [openEdit, openEditModal, closeEditModal] = useBooleanState(false);
  const [openDelete, openDeleteModal, closeDeleteModal] = useBooleanState(false);

  return (
    <>
      <ChangeWardMoadl open={openEdit} onClose={closeEditModal} />
      <ChangeModal
        open={openDelete}
        onClose={closeDeleteModal}
        onConfirm={() => null}
        modalTitle={"비밀번호 입력"}
        subTitle={"비밀번호"}
        rightText={"다음"}
      />
      <Container>
        <HeadContainer>
          <div>
            <Title variant="h1">병동 계정 관리</Title>
          </div>
          <div style={{ maxWidth: "148px" }}>
            <CButton buttontype="primarySpaureWhite">병동 계정 생성</CButton>
          </div>
        </HeadContainer>
        <BodyContainer>
          <WardManagementTable onEdit={openEditModal} onDelete={openDeleteModal} />
          <PaginationContainer>
            <div>
              <PaginationComponent totalPage={5} />
            </div>
          </PaginationContainer>
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
  marginBottom: "48.5px",
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

const PaginationContainer = styled(Box)({
  marginTop: "60px",
});
