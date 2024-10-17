import { CMModal, CMModalProps, ModalActionButton } from "@components/common";
import CInput from "@components/common/atom/C-Input";
import { Box, styled, Typography } from "@mui/material";

interface ChangeModalProps extends Omit<CMModalProps, "title"> {
  onConfirm: () => void;
  modalTitle: string;
  subTitle: string;
  rightText: string;
}

export default function ChangeModal({
  onClose,
  onConfirm,
  modalTitle,
  subTitle,
  rightText,
  ...props
}: ChangeModalProps) {
  return (
    <CMModal
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
