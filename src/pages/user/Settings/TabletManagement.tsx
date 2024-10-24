import { Box, styled } from "@mui/system";
import PaginationComponent from "@components/common/pagination";
import { Typography } from "@mui/material";
import TabletManagementTable from "@components/settings/TabletManagementTable";
import CButton from "@components/common/atom/C-Button";

//태블릿 병상 관리

export const TabletManagement = () => {
  return (
    <>
      <BodyTitleContainer>
        <div>
          <Title variant="h1">태블릿 병상 관리</Title>
        </div>
      </BodyTitleContainer>
      <TabletManagementTable />
      <PaginationContainer>
        <div style={{ width: "148px" }}></div>
        <div>
          <PaginationComponent totalPage={5} />
        </div>
        <div style={{ width: "148px" }}>
          <CButton buttontype="primarySpaureWhite">삭제하기</CButton>
        </div>
      </PaginationContainer>
    </>
  );
};

const BodyTitleContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: "60px 0 40px 0",
});

const PaginationContainer = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  marginTop: "60px",
});

const Title = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.dark,
  textTransform: "uppercase",
  lineHeight: "24px",
  letterSpacing: "-3%",
}));
