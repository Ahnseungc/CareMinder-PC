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

const TabletLogoutWarning = () => {
  return (
    <WarningContainer>
      <WarningHeader>
        <WarningTitle>
          <Warn />
        </WarningTitle>
        경고
      </WarningHeader>
      <>
        <WarningText>
          다음 환자 사용을 위해서는
          <br />
          현재 환자의 로그아웃이 필요합니다.
        </WarningText>
        <WarningDescription>
          로그아웃 시, 현재 환자의 정보는
          <br />
          모두 초기화되며, 복구할 수 없습니다.
        </WarningDescription>
        <WarningConfirm>해당 환자를 로그아웃 하시겠습니까?</WarningConfirm>
      </>
    </WarningContainer>
  );
};

export default TabletLogoutWarning;
