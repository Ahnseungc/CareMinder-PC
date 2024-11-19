import SigninForm from "@components/signin/SigninForm";
import { useSignin } from "@hooks/mutation";
import { SigninFormData } from "@models/signin";
import { Grid, Divider, styled, Stack, Link } from "@mui/material";
import { useForm } from "react-hook-form";
import { Close } from "@mui/icons-material";
import { SettingsHeader } from ".";
import { useSetRecoilState } from "recoil";
import settingsLoginState from "@libraries/recoil/settings/login";
import { useNavigate } from "react-router-dom";
import { userState } from "@libraries/recoil";
import { useRecoilValue } from "recoil";
import InfoModal, { ModalType } from "./modal/InfoModal";
import { useBooleanState } from "@toss/react";
import { useState } from "react";

type SettingsLayoutProps = {
  onClose: (event?: object, reason?: "backdropClick" | "escapeKeyDown") => void;
};

export default function SettingsLayout({ onClose }: SettingsLayoutProps) {
  const form = useForm<SigninFormData>();
  const { mutate: signin } = useSignin();
  const setSettingsLoginState = useSetRecoilState(settingsLoginState);
  const navigate = useNavigate();
  const user = useRecoilValue(userState);
  const [isAccountModalOpen, openAccountModal, closeAccountModal] = useBooleanState();
  const [error, setError] = useState<ModalType>("valueError");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleLogin = (formData: SigninFormData) => {
    signin(formData, {
      onSuccess: () => {
        console.log("로그인 성공:");
        navigate("/settings");
        setSettingsLoginState(false);
      },
      onError: error => {
        console.error("로그인 실패:", error);
        // @ts-ignore
        const errorRes = error.response.data;
        if (errorRes.statusCode === "401") {
          if (errorRes.message === "비밀번호를 5번 틀려서 계정이 잠겼습니다.") {
            setError("accountLock");
            setErrorMessage(errorRes.message as string);
          } else {
            setError("valueError");
            setErrorMessage(errorRes.message as string);
          }
          openAccountModal();
        }
      },
    });
  };

  return (
    <>
      <InfoModal
        open={isAccountModalOpen}
        onClose={closeAccountModal}
        modalType={error}
        message={errorMessage}
      ></InfoModal>
      <Container item xs>
        <Content>
          <CloseButton onClick={onClose} />
          <SettingsHeader />
          <SigninForm form={form} onSubmit={handleLogin} type={user?.type} />
        </Content>
        <Footer divider={<Divider orientation="vertical" />}>
          <Link href="#" variant="h3">
            ID / PW 찾기
          </Link>
        </Footer>
      </Container>
    </>
  );
}

const Container = styled(Grid)({
  position: "relative",
  minWidth: "fit-content",

  padding: "24px",
  paddingBottom: "50px",

  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
});

const CloseButton = styled(Close)({
  position: "absolute",
  top: "0",
  right: "0",
  cursor: "pointer",
});

const Content = styled(Stack)({
  margin: "30px 0 30px 0",
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
