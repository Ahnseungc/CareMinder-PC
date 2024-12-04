import { CMModal, CMModalProps, ModalActionButton } from "@components/common";
import { Stack } from "@mui/material";
import NewStaffInputField from "../NewStaffInputField";
import { NewStaff, NewStaffField } from "@models/staff";
import { useRecoilState } from "recoil";
import doubleCheckState from "@libraries/recoil/staff";
import useCreateStaff from "@hooks/mutation/useCreateStaff";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import InfoModal from "./InfoModal";
import { useBooleanState } from "@toss/react";

const defaultValues: NewStaff = {
  name: "",
  occupation: "DOCTOR",
  areaName: "",
  username: "",
  password: "",
  confirmPassword: "",
  email: "",
};

export default function CreateStaffModal({ onClose, ...props }: CMModalProps) {
  const [isDoubleChecked, setIsDoubleCheckd] = useRecoilState(doubleCheckState);
  const [isSuccessModalOpen, openSuccessModal, closeSuccessModal] = useBooleanState();

  const { mutate } = useCreateStaff();

  const form = useForm<NewStaff>({
    defaultValues,
    mode: "onChange",
  });

  const { handleSubmit, reset } = form;

  const onSubmit: SubmitHandler<NewStaff> = data => {
    const newStaffRequesets = {
      name: data.name,
      staffRole: data.occupation,
      areaId: 1,
      loginId: data.username,
      password: data.password,
      email: data.email,
    };

    mutate(newStaffRequesets, {
      onSuccess: () => {
        onClose();
        reset();
        openSuccessModal();
        setIsDoubleCheckd(false);
      },
      onError: error => {
        toast.error(error.message);
      },
    });
  };

  return (
    <>
      {/* 계정 관리 등 정보 모달 */}
      <InfoModal
        open={isSuccessModalOpen}
        onClose={closeSuccessModal}
        modalType={"createSuccess"}
        onConfirm={() => null}
      />
      <CMModal
        maxWidth="xs"
        onClose={() => {
          reset();
          onClose();
        }}
        title={"스태프 계정 생성"}
        footer={
          <>
            <ModalActionButton
              color="secondary"
              onClick={() => {
                onClose();
                reset();
              }}
            >
              취소
            </ModalActionButton>
            <ModalActionButton onClick={handleSubmit(onSubmit)} disabled={!isDoubleChecked}>
              완료
            </ModalActionButton>
          </>
        }
        {...props}
      >
        <Stack gap={"24px"} sx={{ marginTop: "24px" }}>
          {fields.map(field => (
            <NewStaffInputField key={field.name} field={field} form={form} />
          ))}
        </Stack>
      </CMModal>
    </>
  );
}

/** utils */

const fields: NewStaffField[] = [
  { name: "name", label: "이름", placeholder: "이름을 입력해주세요." },
  { name: "occupation", label: "직종 선택", placeholder: "직종을 선택해주세요." },
  { name: "areaName", label: "구역명", placeholder: "구역을 선택해주세요." },
  { name: "username", label: "아이디", placeholder: "아이디를 입력해주세요." },
  { name: "password", label: "비밀번호", placeholder: "비밀번호를 입력해주세요." },
  {
    name: "confirmPassword",
    label: "비밀번호 확인",
    placeholder: "비밀번호를 재입력해주세요.",
  },

  { name: "email", label: "이메일", placeholder: "이메일을 입력해주세요." },
];
