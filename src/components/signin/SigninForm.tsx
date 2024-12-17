import { SigninFormData } from "@models/signin";
import { styled } from "@mui/material";
import { UseFormReturn } from "react-hook-form";
import TextField from "./TextField";
import CButton from "@components/common/atom/C-Button";
import { userState } from "@libraries/recoil";
import { useRecoilValue } from "recoil";
import autoCompleteIdState from "@libraries/recoil/autoCompleteId";

type SigninFormProps = {
  form: UseFormReturn<SigninFormData>;
  onSubmit: (data: SigninFormData) => void;
  type?: string;
};

export default function SigninForm({ form, onSubmit, type }: SigninFormProps) {
  const { handleSubmit, watch } = form;
  const user = useRecoilValue(userState);
  const autoCompleteId = useRecoilValue(autoCompleteIdState);

  const userType = type === user?.type ? user?.type : type;

  const handleFormSubmit = (data: SigninFormData) => {
    const updatedData = {
      ...data,
      accountType: userType,
    };
    onSubmit(updatedData);
  };

  const loginId = watch("loginId");
  const password = watch("password");

  const isButtonDisabled = !loginId || !password;

  return (
    <Container>
      <TextField label="ID" name="loginId" form={form} value={autoCompleteId} />
      <TextField label="PW" name="password" form={form} type="password" />
      <CButton
        buttontype="login"
        style={{ marginTop: "43.22px" }}
        onClick={handleSubmit(handleFormSubmit)}
        disabled={isButtonDisabled}
      >
        LOGIN
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
