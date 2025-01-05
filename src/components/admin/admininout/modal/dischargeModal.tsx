import { CMModal, CMModalProps, ModalActionButton } from "@components/common";
import { styled, Typography } from "@mui/material";
import { Box } from "@mui/system";

interface ChargeModalProps extends Omit<CMModalProps, "title"> {
  modalTitle: string;
  subTitle: string | React.ReactNode;
  onDisCharge: any;
}

const DischargeModal = ({
  onClose,
  modalTitle,
  subTitle,
  onDisCharge,
  ...props
}: ChargeModalProps) => {
  return (
    <CMModal
      maxWidth="sm"
      onClose={onClose}
      title={modalTitle}
      footer={
        <>
          <ModalActionButton hoverColor="#30b3ff55" color="success" onClick={onClose}>
            취소하기
          </ModalActionButton>
          <ModalActionButton hoverColor="#19181813" color="secondary" onClick={onDisCharge}>
            퇴원하기
          </ModalActionButton>
        </>
      }
      {...props}
    >
      <View>
        <Text>
          퇴원 처리 시 복구가 불가능합니다. <br />
          <br />
          해당 환자의 요청은 모두 완료/삭제 처리가 되며,
          <br />
          태블릿 내 환자 계정은 로그아웃 및 초기화됩니다.
          <br />
          <br /> 퇴원 처리하시겠습니까?
        </Text>
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

export default DischargeModal;
