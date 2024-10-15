import { CMModal, CMModalProps, ModalActionButton } from "@components/common";
import { Stack } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import NewWardInputField from "./NewWardInputField";
import { NewWard, NewWardField } from "@models/ward";
import useCreateWard from "@hooks/mutation/useCreateWard";

const defaultValues: NewWard = {
  wardName: "",
  manageName: "",
  loginId: "",
  password: "",
  confirmPassword: "",
  managePhoneNumber: "",
  manageEmail: "",
};

export default function CreateWardModal({ onClose, ...props }: CMModalProps) {
  const { mutate, isPending } = useCreateWard();

  const form = useForm<NewWard>({
    defaultValues,
    mode: "onChange",
  });
  const { handleSubmit } = form;

  const onSubmit: SubmitHandler<NewWard> = data => {
    mutate(data, {
      onSuccess: () => {
        toast.success("어드민 계정 생성이 완료되었습니다.");
        onClose();
      },
      onError: error => {
        toast.error(error.message);
      },
    });
  };

  return (
    <CMModal
      onClose={onClose}
      title={"병동 계정 생성"}
      footer={
        <>
          <ModalActionButton color="secondary" onClick={onClose}>
            취소
          </ModalActionButton>
          <ModalActionButton disabled={isPending} onClick={handleSubmit(onSubmit)}>
            다음
          </ModalActionButton>
        </>
      }
      {...props}
    >
      <Stack gap={"24px"}>
        {fields.map(field => (
          <NewWardInputField key={field.name} field={field} form={form} />
        ))}
      </Stack>
    </CMModal>
  );
}

/** utils */

const fields: NewWardField[] = [
  { name: "wardName", label: "병동명", placeholder: "병동명을 입력해주세요." },
  { name: "loginId", label: "아이디", placeholder: "아이디를 입력해주세요." },
  { name: "password", label: "비밀번호", placeholder: "비밀번호를 입력해주세요." },
  { name: "confirmPassword", label: "비밀번호 확인", placeholder: "비밀번호를 재입력해주세요." },
  { name: "manageName", label: "담당자 이름", placeholder: "담당자 이름을 입력해주세요." },
  {
    name: "managePhoneNumber",
    label: "담당자 전화번호",
    placeholder: "담당자 전화번호를 입력해주세요.",
  },
  { name: "manageEmail", label: "담당자 이메일", placeholder: "담당자 이메일을 입력해주세요." },
];

/** styles */
