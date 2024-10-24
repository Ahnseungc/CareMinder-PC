import { Box, styled } from "@mui/system";
import CButton from "@components/common/atom/C-Button";
import PaginationComponent from "@components/common/pagination";
import StaffAccountSettingsTable from "@components/settings/StaffAccountSettingsTable";
import { IconButton, InputBase, Paper, Typography } from "@mui/material";
import { useBooleanState } from "@toss/react";

import { useState } from "react";
import InfoModal from "@components/settings/modal/InfoModal";
import TOSModal from "@components/settings/modal/TOSModal";
import { ReactComponent as EmptyStaff } from "@/assets/EmptyStaff.svg";
import ChangeModal from "@components/settings/modal/ChangeModal";
import { useRecoilState } from "recoil";
import { editingState } from "@libraries/recoil";

import { ReactComponent as X } from "@/assets/x-Icon.svg";
import { ReactComponent as Search } from "@/assets/serachIcons/search-gray.svg";
import { CreateStaff } from "./CreateStaff";

export const StaffAccount = () => {
  const [open, openCreateModal, closeCreateModal] = useBooleanState(false);
  const [openDelete, openDeleteModal, closeDeleteModal] = useBooleanState(false);
  const [openTOS, openTOSModal, closeTOSModal] = useBooleanState(false);

  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [isClear, setIsClear] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useRecoilState(editingState);

  const handleClear = () => {
    setIsEditing([]);
    setIsClear(true);
  };

  const handleTOS = () => {
    setIsCreate(true);
    closeTOSModal();
  };

  return (
    <>
      {isCreate ? (
        <CreateStaff onCreate={setIsCreate} />
      ) : (
        <>
          <ChangeModal
            open={open}
            onClose={closeCreateModal}
            onConfirm={() => null}
            modalTitle={"스태프 추가"}
            subTitle={"아이디/휴대폰 번호/이메일 중 택일"}
            rightText={"추가"}
          />
          <TOSModal open={openTOS} onClose={closeTOSModal} onConfirm={handleTOS} />
          <InfoModal
            open={openDelete}
            onClose={closeDeleteModal}
            modalType={"checkDeleteStaff"}
            onConfirm={() => null}
          ></InfoModal>
          <BodyTitleContainer>
            {isEditing.length !== 0 ? (
              <EditContainer>
                <X style={{ cursor: "pointer" }} onClick={handleClear} />
                <EditMenu sx={{ marginRight: "60px", textDecoration: "none" }}>
                  {isEditing.length}개 항목 선택 됨
                </EditMenu>
                <EditMenu>직업</EditMenu>
                <EditMenu>구역</EditMenu>
                <EditMenu>계정잠금</EditMenu>
                <EditMenu>삭제</EditMenu>
                <EditMenu>비밀번호 재설정</EditMenu>
              </EditContainer>
            ) : (
              <>
                <Paper
                  component="form"
                  sx={{
                    p: "2px 4px",
                    display: "flex",
                    alignItems: "center",
                    width: 400,
                    border: "1px solid #ECECEC",
                    borderRadius: "6px",
                    boxShadow: "none",
                  }}
                >
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="검색할 내용을 입력해주세요."
                    inputProps={{ "aria-label": "검색할 내용을 입력해주세요." }}
                  />
                  <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
                    <Search />
                  </IconButton>
                </Paper>
                <div>
                  <Title variant="h1">스태프 계정 수정</Title>
                </div>
                <StaffButtonContainer>
                  <CButton buttontype="primarySpaureWhite" onClick={openTOSModal}>
                    스태프 계정 생성
                  </CButton>
                  <CButton buttontype="primarySpaureWhite" onClick={openCreateModal}>
                    스태프 추가
                  </CButton>
                </StaffButtonContainer>
              </>
            )}
          </BodyTitleContainer>
          {/* 스태프 리스트 실제 데이터 조건문으로 변경해야함 */}
          {false ? (
            <EmptyStaffContainer>
              <EmptyStaff />
              <p>등록된 스태프가 없습니다.</p>
            </EmptyStaffContainer>
          ) : (
            <>
              <StaffAccountSettingsTable
                onDelete={openDeleteModal}
                isClear={isClear}
                setIsClear={setIsClear}
              />
              <PaginationContainer>
                <div>
                  <PaginationComponent totalPage={5} />
                </div>
              </PaginationContainer>
            </>
          )}
        </>
      )}
    </>
  );
};

/** styles */

const BodyTitleContainer = styled(Box)({
  position: "relative",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  margin: "60px 0 40px 0",
});

const StaffButtonContainer = styled(Box)({
  display: "flex",
  gap: "20px",
  width: "400px",
});

const PaginationContainer = styled(Box)({
  marginTop: "60px",
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

  minHeight: "600px",
  marginBottom: "100px",
});

const EditContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "start",
  alignItems: "center",
  gap: "20px",

  width: "100%",
  padding: "15px 12px",

  borderRadius: "100px",
  backgroundColor: theme.palette.primary.dark,
  opacity: "0.6",
  color: theme.palette.divider,
}));

const EditMenu = styled(Typography)({
  textDecoration: "underline",
});
