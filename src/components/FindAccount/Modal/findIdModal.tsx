import { CMModal, ModalActionButton } from "@components/common";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

type ModalProps = {
  onClose: (event?: object, reason?: "backdropClick" | "escapeKeyDown") => void;
  setActiveTab: React.Dispatch<React.SetStateAction<"아이디 찾기" | "비밀번호 찾기">>;
  type: "어드민" | "병동" | "스태프";
  id: string;
};

function FindIdModal({ onClose, setActiveTab, type, id }: ModalProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

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

  console.log(prevType);

  return (
    <CMModal
      open={true}
      maxWidth="xs"
      onClose={onClose}
      title={"아이디 찾기를 완료하였습니다."}
      footer={
        <>
          <ModalActionButton
            color="secondary"
            hoverColor="#30B4FF22"
            onClick={() => {
              onClose(), setActiveTab("비밀번호 찾기");
            }}
          >
            {t("비밀번호 찾기")}
          </ModalActionButton>
          <ModalActionButton onClick={() => navigate(prevType!)} color={"primary"}>
            {t("로그인 하러가기")}
          </ModalActionButton>
        </>
      }
    >
      <Title>
        {t("아이디는")} <Point>{id}</Point> {t("입니다.")}
      </Title>
    </CMModal>
  );
}
export default FindIdModal;

const Title = styled("div")({
  textAlign: "center",
  margin: "10px 0",
});
const Point = styled("span")({
  color: "#5D6DBE",
});
