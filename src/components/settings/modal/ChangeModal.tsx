import { CMModal, CMModalProps, ModalActionButton } from "@components/common";
import { Box, Stack, styled, Typography } from "@mui/material";
import NewPasswordField from "../NewPasswordInputField";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import { userState } from "@libraries/recoil";
import useChangePassword from "@hooks/mutation/useChangePassword";
import { toast } from "react-toastify";

interface ChangeModalProps extends Omit<CMModalProps, "title"> {
  onConfirm: () => void;
  modalTitle: string;
  subTitle: string | React.ReactNode;
  rightText: string;
  isPasswordChange?: boolean;
}

const defaultValues: NewPassword = {
  password: "",
  confirmPassword: "",
};

export default function ChangeModal({
  onClose,
  onConfirm,
  modalTitle,
  subTitle,
  rightText,
  isPasswordChange = false,
  ...props
}: ChangeModalProps) {
  const [userStatus] = useRecoilState(userState);
  const form = useForm<NewPassword>({
    defaultValues,
    mode: "onChange",
  });
  const { mutate: changePassword } = useChangePassword();
  const { handleSubmit } = form;

  const onSubmit: SubmitHandler<NewPassword> = data => {
    console.log(data);
    console.log(userStatus?.id);

    const newPasswordRequest = {
      userIds: [userStatus?.id as number],
      newPassword: data.confirmPassword,
    };
    changePassword(newPasswordRequest, {
      onSuccess: () => {
        toast.success("비밀번호 변경이 완료되었습니다.");
      },
      onError: error => {
        toast.error(error.message);
      },
    });
  };

  return (
    <CMModal
      maxWidth="sm"
      onClose={onClose}
      title={modalTitle}
      footer={
        <>
          <ModalActionButton color="secondary" onClick={onClose}>
            취소
          </ModalActionButton>
          <ModalActionButton onClick={isPasswordChange ? handleSubmit(onSubmit) : onConfirm}>
            {rightText}
          </ModalActionButton>
        </>
      }
      {...props}
    >
      <ContentLayout>
        <Typography variant="h4">{subTitle}</Typography>
        {isPasswordChange ? (
          <FormLayout>
            <Stack gap={"24px"}>
              {fields.map(field => (
                <NewPasswordField key={field.name} field={field} form={form} />
              ))}
            </Stack>
          </FormLayout>
        ) : null}
      </ContentLayout>
    </CMModal>
  );
}

const ContentLayout = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  padding: "24px 30px",
});

const FormLayout = styled(Box)({
  width: "100%",
  height: "200px",
  padding: "12px 49px 0 49px",
});

/**utils */

export type NewPassword = {
  password: string;
  confirmPassword: string;
};

export type NewPassWordField = {
  name: keyof NewPassword;
  label: string;
  placeholder: string;
};

const fields: NewPassWordField[] = [
  { name: "password", label: "비밀번호", placeholder: "비밀번호를 입력해주세요." },
  { name: "confirmPassword", label: "비밀번호 확인", placeholder: "비밀번호를 재입력해주세요." },
];
