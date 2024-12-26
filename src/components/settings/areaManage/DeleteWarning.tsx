import styled from "@emotion/styled";
import { ReactComponent as Warn } from "@/assets/Warning.svg";

const WarningContainer = styled.div`
  text-align: center;
`;

const WarningHeader = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;

  svg {
    margin-right: 8px;
  }
`;

const WarningTitle = styled.span`
  text-align: center;
`;

const WarningText = styled.p`
  margin: 8px 0;
`;

const WarningDescription = styled.p`
  margin: 8px 0;
  line-height: 1.5;
`;

const WarningConfirm = styled.p`
  margin-top: 16px;
  font-weight: 500;
`;

const DeleteWarning = () => {
  return (
    <WarningContainer>
      <WarningHeader>
        <WarningTitle>
          <Warn />
        </WarningTitle>
        경고
      </WarningHeader>
      <WarningText>구역 삭제 시 복구가 불가능합니다</WarningText>
      <WarningDescription>
        해당 구역에 있던 스태프와 테블릿은
        <br />
        구역 '미지정'으로 변경됩니다.
      </WarningDescription>
      <WarningConfirm>정말로 삭제하시겠습니까?</WarningConfirm>
    </WarningContainer>
  );
};

export default DeleteWarning;
