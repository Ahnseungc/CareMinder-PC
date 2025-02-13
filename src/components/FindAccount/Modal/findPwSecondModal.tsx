import { CMModal, ModalActionButton } from "@components/common";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type ModalProps = {
  onClose: (event?: object, reason?: "backdropClick" | "escapeKeyDown") => void;
  type: "어드민" | "병동" | "스태프";
};

function FindPwSecond({ onClose, type, ...props }: ModalProps) {
  const navigate = useNavigate();
  const [prevType, setPrevType] = useState<
    "/sign-in" | "/sign-in/admin" | "/staff/inout" | undefined
  >(undefined);

  useEffect(() => {
    if (type === "병동") {
      setPrevType("/sign-in");
    } else if (type === "스태프") {
      setPrevType("/staff/inout");
    } else {
      setPrevType("/sign-in/admin");
    }
  }, [type]);

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
            onClick={() => navigate(prevType!)}
          >
            로그인하기
          </ModalActionButton>
          <ModalActionButton
            onClick={() => {
              onClose();
            }}
            color={"primary"}
          >
            닫기
          </ModalActionButton>
        </>
      }
    ></CMModal>
  );
}
export default FindPwSecond;
