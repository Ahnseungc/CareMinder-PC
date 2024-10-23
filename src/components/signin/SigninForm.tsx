import { SigninFormData } from "@models/signin";
import { styled } from "@mui/material";
import { UseFormReturn } from "react-hook-form";
import TextField from "./TextField";
import CButton from "@components/common/atom/C-Button";
import { reqUserType } from "@models/user";

type SigninFormProps = {
  form: UseFormReturn<SigninFormData>;
  onSubmit: (data: SigninFormData) => void;
  type: reqUserType;
};

export default function SigninForm({ form, onSubmit, type }: SigninFormProps) {
  const { handleSubmit } = form;

  const handleFormSubmit = (data: SigninFormData) => {
    const updatedData = {
      ...data,
      accountType: type, // 원하는 accountType 설정
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
