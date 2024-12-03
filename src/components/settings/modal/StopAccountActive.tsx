import { CMModal, ModalActionButton } from "@components/common";
import { Box, styled } from "@mui/material";
import { ReactComponent as StopIcon } from "@assets/stop.svg";

export default function StopAccountActiveModal({ onClose, onCloseAccountModal, ...props }: any) {
  return (
    <>
      <CMModal
        onClose={onClose}
        footer={
          <>
            <ModalActionButton color="success" onClick={onClose}>
              취소하기
            </ModalActionButton>
            <ModalActionButton color="secondary" onClick={() => onCloseAccountModal("중단하기")}>
              중단하기
            </ModalActionButton>
          </>
        }
        {...props}
      >
        <ContentLayout>
          <Title>
            <StopIcon /> <div> 경고</div>
          </Title>
          <Text>
            본인 인증이 완료되지 않았습니다.
            <br />
            <br />
            본인 인증을 완료하지 않으면 <br />
            계정을 사용할 수 없습니다.
            <br />
            <br />
            계정을 활성화를 중단하시겠습니까?
          </Text>
        </ContentLayout>
      </CMModal>
    </>
  );
}

const ContentLayout = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  padding: "24px 20px 10px 20px",
  alignItems: "center",
});

const Title = styled("div")`
  font-weight: 700;
  font-size: 18px;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.palette.secondary.main};
  margin-bottom: 10px;
  & > div {
    margin-left: 7px;
    margin-top: 2px;
  }
`;
const Text = styled("div")`
  font-size: 18px;
  font-weight: 500;
  color: black;
  text-align: center;
`;
