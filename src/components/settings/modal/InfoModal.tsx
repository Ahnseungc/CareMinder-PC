import { CMModal, CMModalProps, ModalActionButton } from "@components/common";
import { Box, styled, Typography } from "@mui/material";
import React, { useMemo } from "react";

const MODAL_CONTEXTS = {
  require: { title: "필수 입력 사항이 누락되었습니다.", controlAccount: false },
  doubleCheck: { title: "중복되었습니다.", controlAccount: false },
  error: { title: "오류가 발생했습니다.", controlAccount: false },
  delete: { title: "삭제되었습니다.", controlAccount: false },
  accountLock: { title: "계정이 잠겼습니다.", controlAccount: false },
  valueError: { title: "ID/PW 오류입니다.", controlAccount: false },
  checkTOS: { title: "필수 약관 체크 누락되었습니다.", controlAccount: false },
  successChangePW: { title: "비밀번호가 변경되었습니다.", controlAccount: false },
  successChangeInfo: { title: "변경 내용이 저장되었습니다.", controlAccount: false },
  confirmFail: { title: "인증실패되었습니다.", controlAccount: false },
  adminPopup: {
    title: "본 페이지는 관리자를 위한 페이지로, 관리자 외에 접근을 금합니다.",
    controlAccount: false,
  },
  createSuccess: { title: "계정 생성 완료되었습니다.", controlAccount: false },
  noResult: { title: "존재하지 않는 계정입니다.", controlAccount: false },
  waiting: { title: "회사에서 검토 후 계정 생성될 예정입니다.", controlAccount: false },
  checkDelete: { title: "", controlAccount: true },
  checkAddStaff: { title: "스태프를 정말로 추가하시겠습니까?", controlAccount: true },
  checkDeleteStaff: { title: "스태프를 정말로 제거하시겠습니까?", controlAccount: true },
  checkLockStaff: { title: "해당 스태프 계정을 잠금하시겠습니까?", controlAccount: true },
  checkUnLockStaff: { title: "해당 스태프 계정을 잠금 해제하시겠습니까?", controlAccount: true },
};

export type ModalType = keyof typeof MODAL_CONTEXTS;

interface InfoModalProps extends Omit<CMModalProps, "title"> {
  modalType: ModalType;
  onConfirm?: () => void;
  message?: React.ReactNode;
  leftText?: string;
  rightText?: string;
}

export default function InfoModal({
  onClose,
  modalType,
  onConfirm,
  message,
  leftText = "아니오",
  rightText = "예",
  ...props
}: InfoModalProps) {
  const { title, controlAccount } = useMemo(
    () => MODAL_CONTEXTS[modalType] || { title: "", controlAccount: false },
    [modalType],
  );

  return (
    <CMModal
      maxWidth="xs"
      onClose={onClose}
      footer={
        controlAccount ? (
          <>
            <ModalActionButton color="secondary" onClick={onClose}>
              {leftText}
            </ModalActionButton>
            <ModalActionButton onClick={onConfirm}>{rightText}</ModalActionButton>
          </>
        ) : (
          <ModalActionButton onClick={onClose}>확인</ModalActionButton>
        )
      }
      {...props}
    >
      <ContentLayout>
        <Typography variant="h2">
          {modalType === "accountLock" || modalType === "valueError" || modalType === "checkDelete"
            ? message
            : title}
        </Typography>
      </ContentLayout>
    </CMModal>
  );
}

const ContentLayout = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  paddingTop: "30px",
});

/** 사용 예시
<InfoModal open={open} onClose={closeCreateModal} modalType={"require"}></InfoModal>
<InfoModal open={open} onClose={closeCreateModal} modalType={"doubleCheck"}></InfoModal>
<InfoModal open={open} onClose={closeCreateModal} modalType={"error"}></InfoModal>
<InfoModal open={open} onClose={closeCreateModal} modalType={"confirmFail"}></InfoModal>
<InfoModal open={open} onClose={closeCreateModal} modalType={"createSuccess"}></InfoModal>
<InfoModal open={open} onClose={closeCreateModal} modalType={"checkAddStaff"}></InfoModal>
<InfoModal open={open} onClose={closeCreateModal} modalType={"checkDeleteStaff"}></InfoModal>
*/
