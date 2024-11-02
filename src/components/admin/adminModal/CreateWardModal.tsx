import { CMModal, CMModalProps, ModalActionButton } from "@components/common";
import { Stack } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import NewWardInputField from "./NewWardInputField";
import { NewWard, NewWardField, NewWardRequest } from "@models/ward";
import useCreateWard from "@hooks/mutation/useCreateWard";
import InfoModal from "@components/settings/modal/InfoModal";
import { useBooleanState } from "@toss/react";

const defaultValues: NewWard = {
  wardName: "",
  loginId: "",
  password: "",
  confirmPassword: "",
  managerName: "",
  managerPhoneNumber: "",
  managerEmail: "",
};

export default function CreateWardModal({ onClose, ...props }: CMModalProps) {
  const [open, openModal, closeModal] = useBooleanState();
  const { mutate, isPending } = useCreateWard();

  const form = useForm<NewWard>({
    defaultValues,
    mode: "onChange",
  });
  const { handleSubmit } = form;

  const onSubmit: SubmitHandler<NewWardRequest> = data => {
    const newWardRequesets = {
      wardName: data.wardName,
      loginId: data.loginId,
      password: data.password,
      managerName: data.managerPhoneNumber,
      managerPhoneNumber: data.managerPhoneNumber,
      managerEmail: data.managerEmail,
    };
    console.log(newWardRequesets);
    mutate(newWardRequesets, {
      onSuccess: () => {
        toast.success("병동 계정 생성이 완료되었습니다.");
        onClose();
        openModal();
      },
      onError: error => {
        toast.error(error.message);
      },
    });
  };

  return (
    <>
      <InfoModal open={open} onClose={closeModal} modalType={"createSuccess"}></InfoModal>
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
    </>
  );
}

/** utils */

const fields: NewWardField[] = [
  { name: "wardName", label: "병동명", placeholder: "병동명을 입력해주세요." },
  { name: "loginId", label: "아이디", placeholder: "아이디를 입력해주세요." },
  { name: "password", label: "비밀번호", placeholder: "비밀번호를 입력해주세요." },
  { name: "confirmPassword", label: "비밀번호 확인", placeholder: "비밀번호를 재입력해주세요." },
  { name: "managerName", label: "담당자 이름", placeholder: "담당자 이름을 입력해주세요." },
  {
    name: "managerPhoneNumber",
    label: "담당자 전화번호",
    placeholder: "담당자 전화번호를 입력해주세요.",
  },
  { name: "managerEmail", label: "담당자 이메일", placeholder: "담당자 이메일을 입력해주세요." },
];

/** styles */
