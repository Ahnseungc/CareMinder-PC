import { CMModal, ModalActionButton } from "@components/common";

type ModalProps = {
  onClose: (event?: object, reason?: "backdropClick" | "escapeKeyDown") => void;
  type: "어드민" | "병동" | "스태프";
};

function FindPwSecond({ onClose, type, ...props }: ModalProps) {
  return (
    <CMModal
      open={true}
      maxWidth="xs"
      onClose={onClose}
      title={"비밀번호 변경이 완료되었습니다."}
      footer={
        <>
          <ModalActionButton
            color="secondary"
            hoverColor="#30B4FF22"
            onClick={() => {
              onClose();
            }}
          >
            로그인하기
          </ModalActionButton>
          <ModalActionButton onClick={() => null} color={"primary"}>
            닫기
          </ModalActionButton>
        </>
      }
    ></CMModal>
  );
}
export default FindPwSecond;
