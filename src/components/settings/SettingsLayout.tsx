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

type SettingsLayoutProps = {
  onClose: (event?: object, reason?: "backdropClick" | "escapeKeyDown") => void;
};

export default function SettingsLayout({ onClose }: SettingsLayoutProps) {
  const form = useForm<SigninFormData>();
  const { mutate: signin } = useSignin();
  const setSettingsLoginState = useSetRecoilState(settingsLoginState);
  const navigate = useNavigate();
  const user = useRecoilValue(userState);

  const handleLogin = (formData: SigninFormData) => {
    signin(formData, {
      onSuccess: data => {
        console.log("로그인 성공:");
        navigate("/settings");
        setSettingsLoginState(false);
      },
      onError: error => {
        console.error("로그인 실패:", error);
      },
    });
  };

  return (
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
