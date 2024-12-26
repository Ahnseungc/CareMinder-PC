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

type DeleteWarningProps = {
  isLock?: boolean;
};

const DeleteWarning = (props: DeleteWarningProps) => {
  return (
    <WarningContainer>
      <WarningHeader>
        <WarningTitle>
          <Warn />
        </WarningTitle>
        경고
      </WarningHeader>
      {props.isLock ? (
        <>
          <WarningText>
            계정 잠금 시 해당 인력은
            <br />
            더이상 계정에 접근할 수 없게 됩니다.
          </WarningText>
          <WarningDescription>
            현재 접속 중인 경우
            <br />
            강제 로그아웃은 되지 않습니다.
          </WarningDescription>
          <WarningConfirm>정말로 해당 계정을 잠그시겠습니까?</WarningConfirm>
        </>
      ) : (
        <>
          <WarningText>구역 삭제 시 복구가 불가능합니다</WarningText>
          <WarningDescription>
            해당 구역에 있던 스태프와 테블릿은
            <br />
            구역 '미지정'으로 변경됩니다.
          </WarningDescription>
          <WarningConfirm>정말로 삭제하시겠습니까?</WarningConfirm>
        </>
      )}
    </WarningContainer>
  );
};

export default DeleteWarning;
