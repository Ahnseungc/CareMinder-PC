import { CMModal, CMModalProps, ModalActionButton } from "@components/common";
import CInput from "@components/common/atom/C-Input";
import { Box, styled, Typography } from "@mui/material";

interface ChangeModalProps extends Omit<CMModalProps, "title"> {
  onConfirm: () => void;
  modalTitle: string;
  subTitle: string | React.ReactNode;
  rightText: string;
  isPasswordChange?: boolean;
}

export default function ChangeModal({
  onClose,
  onConfirm,
  modalTitle,
  subTitle,
  rightText,
  isPasswordChange = false,
  ...props
}: ChangeModalProps) {
  return (
    <CMModal
      maxWidth={isPasswordChange ? "sm" : "xs"}
      onClose={onClose}
      title={modalTitle}
      footer={
        <>
          <ModalActionButton color="secondary" onClick={onClose}>
            취소
          </ModalActionButton>
          <ModalActionButton onClick={onConfirm}>{rightText}</ModalActionButton>
        </>
      }
      {...props}
    >
      <ContentLayout>
        <Typography variant="h4">{subTitle}</Typography>
        {!isPasswordChange ? (
          <InputLayout>
            <CInput
              variant={"outlined"}
              placeholder={"입력해주세요."}
              onChange={() => null}
              value={""}
              disabled={false}
              id={""}
            />
          </InputLayout>
        ) : null}
      </ContentLayout>
    </CMModal>
  );
}

const ContentLayout = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  padding: "24px 30px",
});

const InputLayout = styled(Box)({
  width: "349px",
  height: "40px",
});
