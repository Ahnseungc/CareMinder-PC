import { SigninFormData } from "@models/signin";
import { styled } from "@mui/material";
import { UseFormReturn } from "react-hook-form";
import TextField from "./TextField";
import CButton from "@components/common/atom/C-Button";
import { userState } from "@libraries/recoil";
import { useRecoilValue } from "recoil";

type SigninFormProps = {
  form: UseFormReturn<SigninFormData>;
  onSubmit: (data: SigninFormData) => void;
  type?: string;
};

export default function SigninForm({ form, onSubmit, type }: SigninFormProps) {
  const { handleSubmit } = form;
  const user = useRecoilValue(userState);

  const userType = type === user?.type ? user?.type : type;

  const handleFormSubmit = (data: SigninFormData) => {
    const updatedData = {
      ...data,
      accountType: userType, // 원하는 accountType 설정
    };
    onSubmit(updatedData);
  };

  return (
    <Container>
      <TextField label="ID" name="loginId" form={form} />
      <TextField label="PW" name="password" form={form} type="password" />
      <CButton
        buttontype="login"
        style={{ marginTop: "43.22px" }}
        onClick={handleSubmit(handleFormSubmit)}
      >
        로그인
      </CButton>
    </Container>
  );
}

/** styles */

const Container = styled("form")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "400px",
});
