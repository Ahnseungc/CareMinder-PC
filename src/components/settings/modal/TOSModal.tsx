import React, { useState } from "react";
import { CMModal, CMModalProps, ModalActionButton } from "@components/common";
import { Box, Checkbox, styled, Typography } from "@mui/material";
import InfoModal from "./InfoModal";
import { useBooleanState } from "@toss/react";

interface TOSModalProps extends Omit<CMModalProps, "title"> {
  onConfirm?: () => void;
}

const label = { inputProps: { "aria-label": "Checkbox demo" } };

export default function TOSModal({ onClose, onConfirm, ...props }: TOSModalProps) {
  const [isChecked, setIsChecked] = useState(false);
  const [open, openTOSModal, closeCreateModal] = useBooleanState(false);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  const handleConfirm = () => {
    if (isChecked) {
      onConfirm?.();
    } else {
      openTOSModal();
    }
  };

  const closeModal = () => {
    onClose();
    setIsChecked(false);
  };

  return (
    <>
      <InfoModal open={open} onClose={closeCreateModal} modalType={"checkTOS"}></InfoModal>
      <CMModal
        maxWidth="sm"
        onClose={closeModal}
        title={"개인정보수집 및 이용 동의서"}
        footer={
          <>
            <ModalActionButton color="secondary" onClick={closeModal}>
              취소
            </ModalActionButton>
            <ModalActionButton onClick={handleConfirm}>동의합니다</ModalActionButton>
          </>
        }
        {...props}
      >
        <ContentLayout>
          <TOSContainer sx={{ width: "calc(100% - 24px)" }}>
            <TOSContentField>
              <Typography variant="subtitle2" sx={{ fontWeight: "500" }} color="black">
                개인정보수집 및 이용 동의서
              </Typography>
              <Typography variant="body2">
                주식회사 케어마인더(이하 “회사”라 함)는 개인정보 보호법 및 관련 법령에 따라
                정보주체의 개인정보를 보호하며, 아래와 같이 개인정보 수집 및 이용에 대한 동의를
                요청드립니다. 동의를 거부할 권리가 있으나, 동의하지 않으실 경우 서비스 제공에 제한이
                있을 수 있습니다.
                <br />
                <br />
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: "500" }} color="black">
                제 1 조. 개인정보의 수집 및 이용 목적
              </Typography>
              <br />
              <Typography variant="body2">
                회사는 ‘케어보이스’ 서비스 제공 및 개선을 위하여 아래와 같은 목적으로 개인정보를
                수집 및 이용합니다.
                <br />
                <br />
                서비스 제공 및 운영: 임직원 계정 생성 및 관리, 요청 분류 및 적합한 병원 직원과의
                연결, 실시간 채팅 지원 등.
                <br />
                <br />
                서비스 품질 개선: 요청별 처리 시간 분석, 요청 유형 통계화 및 서비스 개선을 위한
                데이터 활용.
                <br />
                <br />
                고객 관리 및 법적 의무 준수: 계정 관리, 문의 및 민원 처리, 법령에 따른 의무 이행.
                <br />
                <br />
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: "500" }} color="black">
                제 2 조. 수집하는 개인정보의 항목 <br />
                <br />
              </Typography>
              <Typography variant="body2">
                회사는 다음과 같은 개인정보를 수집합니다:
                <br />
                <br />
                필수 항목: 성명, 직종, 병원명, 아이디, 비밀번호, 주소, 이메일.
                <br />
                <br />
                생성 정보: 요청 처리 시간, 요청 유형, 실시간 채팅 기록(요청 처리 관련 대화 내용).
                <br />
                <br />
                자동 수집 항목: 서비스 이용 기록, 접속 로그, 접속 IP 정보.
                <br />
                <br />
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: "500" }} color="black">
                제 3 조. 개인정보의 처리 및 보유 기간
                <br />
                <br />
              </Typography>
              <Typography variant="body2">
                회사는 정보주체의 동의 하에 수집된 개인정보를 다음 기간 동안 보유 및 이용합니다:
                <br />
                <br />
                보유 기간: 서비스 제공 기간 동안 보유. 단, 법령에 따른 보존이 필요한 경우 해당 기간
                동안 보유.
                <br />
                <br />
                파기 시점: 동의 철회 또는 서비스 탈퇴 시 지체 없이 파기.
                <br />
                <br />
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: "500" }} color="black">
                제 4 조. 개인정보의 제3자 제공
                <br />
                <br />
              </Typography>
              <Typography variant="body2">
                회사는 수집된 개인정보를 제3자에게 제공하지 않습니다. 단, 아래의 경우는 예외로
                합니다:
                <br />
                <br />
                정보주체의 사전 동의를 받은 경우.
                <br />
                <br />
                법령에 따라 요구되는 경우.
                <br />
                <br />
                생명, 신체 또는 재산 보호를 위해 긴급히 필요한 경우.
                <br />
                <br />
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: "500" }} color="black">
                제 5 조. 개인정보의 처리 위탁
                <br />
                <br />
              </Typography>
              <Typography variant="body2">
                회사는 원활한 서비스 운영을 위해 개인정보 처리 업무를 다음과 같이 외부에 위탁할 수
                있습니다:
                <br />
                <br />
                위탁받는 자:  (위탁 업체 명시)
                <br />
                <br />
                위탁하는 업무의 내용: 서버 관리 및 유지보수, 고객 상담 지원 등.
                <br />
                <br />
                위탁 계약 시 개인정보보호법에 따른 보호 조치를 계약서에 명시하여 관리 및 감독합니다.
                <br />
                <br />
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: "500" }} color="black">
                제 6 조. 정보주체의 권리 및 행사 방법
                <br />
                <br />
              </Typography>
              <Typography variant="body2">
                정보주체는 개인정보 열람, 정정, 삭제, 처리 정지 요청 등의 권리를 행사할 수 있으며,
                아래 연락처를 통해 요청할 수 있습니다. 회사는 이에 대해 지체 없이 조치합니다.
                <br />
                <br />
                문의처:  (문의처 정보 명시)
                <br />
                <br />
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: "500" }} color="black">
                제 7 조. 개인정보의 파기 절차 및 방법
                <br />
                <br />
              </Typography>
              <Typography variant="body2">
                회사는 수집된 개인정보의 보유 기간이 경과하거나 처리 목적이 달성된 경우 지체 없이
                개인정보를 파기합니다.
                <br />
                <br />
                파기 절차: 개인정보 파기사유 발생 시 내부 방침에 따라 파기 절차를 진행합니다.
                <br />
                <br />
                파기 방법: 전자적 파일 형태의 정보는 복구할 수 없도록 영구 삭제하며, 종이 문서는
                분쇄기로 분쇄 또는 소각하여 파기합니다.
              </Typography>
            </TOSContentField>
          </TOSContainer>
          <div style={{ display: "flex" }}>
            <Checkbox
              {...label}
              checked={isChecked}
              onChange={handleCheckboxChange}
              size="medium"
              color="primary"
            />
            <Typography variant="subtitle1">필수 약관에 동의합니다.</Typography>
          </div>
        </ContentLayout>
      </CMModal>
    </>
  );
}

const ContentLayout = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px 0 10px 0",
});

const TOSContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.success.main,
  borderRadius: "24px",
  marginBottom: "30px",
  padding: "10px 20px",
}));

const TOSContentField = styled(Box)(({ theme }) => ({
  "maxHeight": "282px",
  "overflowY": "auto",
  "paddingRight": "20px",
  "&::-webkit-scrollbar": {
    width: "6px",
  },
  "&::-webkit-scrollbar-track": {
    background: theme.palette.background.default,
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: theme.palette.primary.main,
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: theme.palette.primary.light,
  },
}));
