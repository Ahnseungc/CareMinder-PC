import styled from "@emotion/styled";
import { ReactComponent as Warn } from "@/assets/Warning.svg";
import { UserType } from "@models/user";

const WarningContainer = styled.div`
  text-align: center;
`;

const WarningHeader = styled.p<{ userType: UserType }>`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: ${props =>
    props.userType === "ADMIN" ? "#5DB8BE" : props.userType === "WARD" ? "#5D6DBE" : "#30b4ff"};
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
  font-size: 14px;
  color: #ff0000;
`;

type AutoLogoutMessageProps = {
  userType: UserType;
};

const AutoLogoutMessage = ({ userType }: AutoLogoutMessageProps) => {
  return (
    <WarningContainer>
      <WarningHeader userType={userType}>
        <WarningTitle>
          <Warn />
        </WarningTitle>
        경고
      </WarningHeader>
      <>
        <WarningText>
          30분 이상 활동이 없어,
          <br />
          정보 보호를 위해 자동으로 로그아웃됩니다.
        </WarningText>
        <WarningDescription>사용을 계속하시겠습니까?</WarningDescription>
        <WarningConfirm>10초 후 자동 로그아웃됩니다.</WarningConfirm>
      </>
    </WarningContainer>
  );
};

export default AutoLogoutMessage;
