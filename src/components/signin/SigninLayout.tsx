import InfoModal from "@components/settings/modal/InfoModal";
import { SigninHeader } from "@components/signin";
import SigninForm from "@components/signin/SigninForm";
import UserTypeTag from "@components/signin/UserTypeTag";
import { useSignin } from "@hooks/mutation";
import { SigninFormData } from "@models/signin";
import { UserType } from "@models/user";
import { Grid, Divider, styled, Stack } from "@mui/material";
import { useBooleanState } from "@toss/react";
import { ReactElement, useEffect } from "react";
import { useForm } from "react-hook-form";

type SigninLayoutProps = {
  type: UserType;
  footer?: ReactElement;
  options?: ReactElement;
};

export default function SigninLayout({ type, footer, options }: SigninLayoutProps) {
  const form = useForm<SigninFormData>();
  const { mutate: signin, error } = useSignin();
  const [open, openModal, closeModal] = useBooleanState();

  /* 어드민 계정 로그인 시 슈퍼 어드민 계정에 의해 수락되지 않은 경우 에러 처리*/
  // useEffect(() => {
  //   if (error?.response.data.statusCode) {
  //     openModal();
  //     console.log(error?.response.data.statusCode);
  //   }
  // }, [error]);

  const onSubmit = signin;

  return (
    <>
      <InfoModal open={open} onClose={closeModal} modalType={"waiting"}></InfoModal>
      <Container item xs>
        <Content>
          <SigninHeader />
          <UserTypeTag type={type} />
          <SigninForm form={form} onSubmit={onSubmit} type={type} />
          {options}
        </Content>
        {footer && (
          <Footer divider={<Divider orientation="vertical" />}>
            {/* Todo */}
            {/* <Link href="#" variant="h3">
            ID / PW 찾기
          </Link> */}
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
