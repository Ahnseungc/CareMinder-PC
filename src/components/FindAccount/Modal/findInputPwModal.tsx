import { CMModal, ModalActionButton } from "@components/common";
import NewPasswordField from "@components/settings/NewPasswordInputField";
import styled from "@emotion/styled";
import { Stack } from "@mui/system";
import { NewPassWordField } from "@models/ward";
import { NewPassword } from "@models/ward";
import { SubmitHandler, useForm } from "react-hook-form";

type ModalProps = {
  onClose: (event?: object, reason?: "backdropClick" | "escapeKeyDown") => void;
  setActiveTab: React.Dispatch<React.SetStateAction<"아이디 찾기" | "비밀번호 찾기">>;
  type: "어드민" | "병동" | "스태프";
  id: string;
};

function FindInputPwModal({ onClose, setActiveTab, type, id, ...props }: ModalProps) {
  console.log(props);

  const defaultValuesPW: NewPassword = {
    password: "",
    confirmPassword: "",
  };

  const form = useForm<NewPassword>({
    defaultValues: defaultValuesPW,
    mode: "onChange",
  });

  const { handleSubmit } = form;

  const onSubmit = async (data: any) => {
    console.log(data);
  };

  const fields: NewPassWordField[] = [
    { name: "password", label: "신규 비밀번호", placeholder: "비밀번호를 입력해주세요." },
    {
      name: "confirmPassword",
      label: "신규 비밀번호 확인",
      placeholder: "비밀번호를 재입력해주세요.",
    },
  ];

  return (
    <CMModal
      open={true}
      maxWidth="xs"
      onClose={onClose}
      title={"비밀번호 변경"}
      footer={
        <>
          <ModalActionButton
            color="secondary"
            hoverColor="#30B4FF22"
            onClick={() => {
              onClose(), setActiveTab("비밀번호 찾기");
            }}
          >
            취소
          </ModalActionButton>
          <ModalActionButton onClick={handleSubmit(onSubmit)} color={"primary"}>
            완료하기
          </ModalActionButton>
        </>
      }
    >
      <Title>새로운 비밀번호를 입력해주세요.</Title>
      <Stack gap={"25px"} sx={{ padding: "20px 10px" }}>
        {fields.map(field => (
          <NewPasswordField key={field.name} field={field} form={form} />
        ))}
      </Stack>
    </CMModal>
  );
}
export default FindInputPwModal;

const Title = styled("div")({
  textAlign: "center",
  marginBottom: "20px",
});
