import { SigninHeader } from "@components/signin";
import SigninForm from "@components/signin/SigninForm";
import UserTypeTag from "@components/signin/UserTypeTag";
import { useSignin } from "@hooks/mutation";
import { SigninFormData } from "@models/signin";
import { UserType } from "@models/user";

import RoutePath from "@routes/routePath";
import { useForm } from "react-hook-form";
import { ReactElement, useEffect, useState } from "react";

import InfoModal, { ModalType } from "@components/settings/modal/InfoModal";

import { Grid, Divider, styled, Stack, Box, Link } from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";

import { SwitchCase, useBooleanState } from "@toss/react";

type SigninLayoutProps = {
  type: UserType;
  footer?: ReactElement | boolean;
  options?: ReactElement;
};

export default function SigninLayout({ type, footer, options }: SigninLayoutProps) {
  const form = useForm<SigninFormData>();
  const { mutate: signin, error } = useSignin();
  const [open, openModal, closeModal] = useBooleanState();

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isModalType, setIsModalType] = useState<ModalType>("waiting");

  /* 어드민 계정 로그인 시 에러 핸들링*/
  useEffect(() => {
    // @ts-ignore
    if (error?.response) {
      // @ts-ignore
      if (error?.response.data.statusCode === "401") {
        // @ts-ignore
        if (error?.response.data.message.includes("비밀번호가 틀립니다.")) {
          // @ts-ignore
          setErrorMessage(error?.response.data.message as string);
          setIsModalType("valueError");
        } else {
          /** 계정 잠김 에러 핸들링 */
          if (type === "WARD") {
            setErrorMessage("계정이 잠겼습니다. 관리자에게 문의하세요.");
            setIsModalType("accountLock");
          } else if (type === "STAFF") {
            // onOpenAccountModal();
            setErrorMessage("계정이 잠겼습니다. 관리자에게 문의하세요.");
            setIsModalType("accountLock");
          }
        }
        // @ts-ignore
      } else if (error?.response.data.statusCode === "404") {
        /** 존재하지 않는 계정 에러 핸들링 */
        setIsModalType("noResult");
      } else {
        setIsModalType("error");
      }
      openModal();
    }
  }, [error]);

  const onSubmit = signin;

  return (
    <>
      {/* 비밀번호 오류, 계정 잠금, 존재하지 않는 계정 에러 표시 모달 */}
      <InfoModal open={open} onClose={closeModal} modalType={isModalType} message={errorMessage} />

      <Container item xs>
        {/* <SwitchCase
          value={type}
          caseBy={{
            ADMIN: <Tag>어드민</Tag>,
            WARD: <Tag>병동</Tag>,
          }}
        /> */}
        <Tag>
          <PublicIcon fontSize="small" color="disabled" /> <span> ko | en</span>
        </Tag>
        <Content>
          <SigninHeader />
          <UserTypeTag type={type} />
          <SigninForm form={form} onSubmit={onSubmit} type={type} />
          {options}
        </Content>
        {footer && (
          <Footer divider={<Divider orientation="vertical" />}>
            {/* Todo */}
            <Link href={`${RoutePath.FindAccount}?type=${type}`} variant="h3">
              ID / PW 찾기
            </Link>
            {footer}
          </Footer>
        )}
      </Container>
    </>
  );
}

/** styles */

const Container = styled(Grid)({
  minWidth: "fit-content",

  padding: "24px",
  paddingBottom: "50px",

  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
});

const Tag = styled(Box)({
  "position": "absolute",
  "right": "23px",

  "display": "flex",
  "alignItems": "center",
  "height": "36px",
  "padding": "4px 20px 4px 16px",

  "backgroundColor": "#5d6dbe",
  "borderRadius": "100px",
  "color": "#d8d6d6",
  "fontSize": "16px",

  "fontWeight": "500",
  "cursor": "pointer",
  "&>span": {
    marginLeft: "10px",
    marginTop: "2px",
    fontWeight: "600",
  },
});

const Content = styled(Stack)({
  margin: "30px 0 60px 0",
  flex: 1,

  alignItems: "center",
  justifyContent: "center",
});

const Footer = styled(Stack)({
  height: "24px",
  gap: "14px",

  flexDirection: "row",

  justifyContent: "center",
  alignItems: "center",
});
