import { CMModal, CMModalProps, ModalActionButton } from "@components/common";
import { styled, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  return (
    <CMModal
      maxWidth="sm"
      onClose={onClose}
      title={modalTitle}
      footer={
        <>
          <ModalActionButton hoverColor="#30b3ff55" color="success" onClick={onClose}>
            {t("취소하기")}
          </ModalActionButton>
          <ModalActionButton hoverColor="#19181813" color="secondary" onClick={onDisCharge}>
            {t("퇴원하기")}
          </ModalActionButton>
        </>
      }
      {...props}
    >
      <View>
        <Text>
          {t("퇴원 처리 시 복구가 불가능합니다.")} <br />
          <br />
          {t("해당 환자의 요청은 모두 완료/삭제 처리가 되며,")}
          <br />
          {t("태블릿 내 환자 계정은 로그아웃 및 초기화됩니다.")}
          <br />
          <br />
          {t("퇴원 처리하시겠습니까?")}
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
