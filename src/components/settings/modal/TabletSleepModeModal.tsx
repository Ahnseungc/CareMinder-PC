import { CMModal, CMModalProps, ModalActionButton } from "@components/common";
import { ReactComponent as X } from "@/assets/x-Icon.svg";
// import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import styled from "@emotion/styled";

export default function TabletSleepModeModal({ onClose, ...props }: CMModalProps) {
  return (
    <CMModal
      maxWidth="md"
      title={"수면 모드 설정"}
      onClose={onClose}
      footer={
        <>
          <ModalActionButton color="secondary" onClick={onClose}>
            취소
          </ModalActionButton>
          <ModalActionButton onClick={() => null}>변경하기</ModalActionButton>
        </>
      }
      {...props}
    >
      <X
        style={{ position: "absolute", right: "24px", top: "28px", cursor: "pointer" }}
        onClick={onClose}
      />
      <ContentWrapper>
        <p>기능 설명</p>
        <p>현재 입원중인 모든 환자들에게 공통으로 적용됩니다.</p>
        <p>시간 설정</p>
        <div style={{ display: "flex", gap: "43px" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <p>시작 시간</p>
          </div>
          <p>종료 시간</p>
        </div>
      </ContentWrapper>
    </CMModal>
  );
}

const ContentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-bottom: 40px;
`;
