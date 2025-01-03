import { CMModal, CMModalProps, ModalActionButton } from "@components/common";
import { styled, Typography } from "@mui/material";
import { Box } from "@mui/system";

interface ChargeModalProps extends Omit<CMModalProps, "title"> {
  modalTitle: string;
}

const DischargeSuccessModal = ({ onClose, modalTitle, ...props }: ChargeModalProps) => {
  return (
    <CMModal
      maxWidth="xs"
      onClose={onClose}
      title={modalTitle}
      footer={
        <>
          <ModalActionButton color="success" onClick={onClose}>
            완료
          </ModalActionButton>
        </>
      }
      {...props}
    >
      <View>
        <Text>퇴원 처리가 완료되었습니다.</Text>
      </View>
    </CMModal>
  );
};

const Text = styled(Typography)(() => ({
  color: "#000000",
  fontWeight: 500,
  fontSize: 18,
  textAlign: "center",
  lineHeight: "26px",
  letterSpacing: "-3%",
}));

const View = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
}));

export default DischargeSuccessModal;
