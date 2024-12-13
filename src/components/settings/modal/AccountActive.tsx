import { CMModal, ModalActionButton } from "@components/common";
import CInput from "@components/common/atom/C-Input";
import { Box, styled, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function AccountActiveModal({ onClose, onCloseAccountModal, ...props }: any) {
  const MINUTES_MS = 3 * 60 * 1000;
  const INTERVAL = 1000;
  const [time, setTime] = useState<number>(MINUTES_MS);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [authNumber, setAuthNumber] = useState<string>("");

  const [isRequestAuth, setIsRequestAuth] = useState(false);

  const minutes = String(Math.floor((time / (1000 * 60)) % 60)).padStart(2, "0");
  const second = String(Math.floor((time / 1000) % 60)).padStart(2, "0");

  //error와 success 예시
  //@ts-ignore
  const [error, isError] = useState(false);
  const [success, isSuccess] = useState(false);

  const requestAuth = () => {
    if (phoneNumber.length !== 13) {
      return;
    }
    setIsRequestAuth(true);
    setTime(MINUTES_MS);
  };

  const onSendAuthNumber = () => {
    if (time <= 0) {
      return;
    }
    console.log(authNumber);
    isSuccess(true);
  };

  useEffect(() => {
    if (!isRequestAuth) {
      return;
    }
    const timer = setInterval(() => {
      setTime(prevTime => prevTime - INTERVAL);
    }, INTERVAL);

    if (time <= 0) {
      clearInterval(timer);
    }

    return () => {
      clearInterval(timer);
    };
  }, [isRequestAuth, time]);

  return (
    <>
      <CMModal
        maxWidth="sm"
        onClose={onClose}
        title={"계정 활성화"}
        footer={
          <>
            <ModalActionButton color="secondary" onClick={() => onCloseAccountModal("취소")}>
              취소
            </ModalActionButton>
            <ModalActionButton color="success" onClick={onSendAuthNumber}>
              완료
            </ModalActionButton>
          </>
        }
        {...props}
      >
        <ContentLayout>
          <Typography variant="h3">
            {"계정을 활성화하기 위해선 휴대전화 번호 본인 인증이 필요합니다."}
          </Typography>

          <FormLayout>
            <Title>전화번호</Title>
            <InputWrapper error={false} success={false}>
              <CInput
                variant={"outlined"}
                placeholder={"010-1234-1234"}
                onChange={e => setPhoneNumber(e.target.value)}
                value={phoneNumber
                  .replace(/[^0-9]/g, "")
                  .replace(/(^02.{0}|^01.{1}|[0-9]{3,4})([0-9]{3,4})([0-9]{4})/g, "$1-$2-$3")}
                disabled={false}
                id={""}
              />
              <Button onClick={requestAuth}>
                {isRequestAuth ? "인증번호 재요청" : "인증번호 요청"}
              </Button>
            </InputWrapper>
            {isRequestAuth && (
              <InputWrapper error={error} success={success}>
                <CInput
                  variant={"outlined"}
                  placeholder={"인증번호를 입력해주세요."}
                  onChange={e => setAuthNumber(e.target.value)}
                  value={authNumber.replace(/[^0-9]/g, "")}
                  disabled={false}
                  id={""}
                />
                <Time>
                  {minutes}:{second}
                </Time>
              </InputWrapper>
            )}
            {!success && !error && isRequestAuth && (
              <Error>
                인증번호는 3분 이내 입력해야 합니다. <br />
                제한시간이 지났을 경우 인증번호를 다시 받아 주세요.
              </Error>
            )}

            {error && isRequestAuth && <Error>인증번호가 올바르지 않습니다.</Error>}
            {success && !error && <Success>인증이 완료되었습니다.</Success>}
          </FormLayout>
        </ContentLayout>
      </CMModal>
    </>
  );
}

const ContentLayout = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  padding: "24px 30px",
  alignItems: "center",
});

const FormLayout = styled(Box)({
  width: "100%",
  padding: "20px 70px 0 70px",
  color: "black",
});
const Title = styled("div")`
  font-weight: 600;
`;
const InputWrapper = styled("div")<{ error: boolean; success: boolean }>`
  height: 40px;
  margin-top: 10px;
  display: flex;
  position: relative;
  border-radius: 6px;
  border: ${({ success }) => success && "#0FBC0C 1px solid"};
  border: ${({ error }) => error && "red 1px solid"};
`;
const Button = styled("button")`
  font-weight: 600;
  padding: 10px 0;
  width: 138px;
  font-size: 14px;
  border-radius: 6px;
  color: ${({ theme }) => theme.palette.secondary.main};
  border: ${({ theme }) => theme.palette.secondary.main} 1px solid;
  background-color: white;
  margin-left: 8px;
  :hover {
    background-color: ${({ theme }) => theme.palette.success.main};
  }
`;
const Error = styled("div")`
  color: red;
  font-size: 12px;
  font-weight: 500;
  padding: 5px;
  line-height: 20px;
`;
const Success = styled("div")`
  color: #0fbc0c;
  font-size: 12px;
  font-weight: 500;
  padding: 5px;
  line-height: 20px;
`;
const Time = styled("div")`
  position: absolute;
  right: 16px;
  top: 10px;
  color: red;
  font-weight: 500;
`;
/**utils */
