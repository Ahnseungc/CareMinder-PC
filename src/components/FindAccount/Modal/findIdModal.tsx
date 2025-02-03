import { CMModal, ModalActionButton } from "@components/common";
import styled from "@emotion/styled";

type ModalProps = {
  onClose: (event?: object, reason?: "backdropClick" | "escapeKeyDown") => void;
  setActiveTab: React.Dispatch<React.SetStateAction<"아이디 찾기" | "비밀번호 찾기">>;
  type: "어드민" | "병동" | "스태프";
  id: string;
};

function FindIdModal({ onClose, setActiveTab, type, id, ...props }: ModalProps) {
  console.log(props);

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
            비밀번호 찾기
          </ModalActionButton>
          <ModalActionButton onClick={() => null} color={"primary"}>
            로그인 하러가기
          </ModalActionButton>
        </>
      }
    >
      <Title>
        아이디는 <Point>{id}</Point> 입니다.
      </Title>
    </CMModal>
  );
}
export default FindIdModal;

const Title = styled("div")({
  textAlign: "center",
  margin: "10px 0",
});
const Point = styled("span")(({ theme }) => ({
  color: theme.palette.primary.main,
}));
