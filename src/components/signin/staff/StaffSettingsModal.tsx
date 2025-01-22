import { CMModal, CMModalProps, ModalActionButton } from "@components/common";
import { Box, Stack, styled } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import EditStaffInfoInputField from "./EditStaffInfoInputField";
import { GetStaffInfoResponse } from "@hooks/queries/useGetStaffInfo";
import { useRecoilValue } from "recoil";
import { selectAreaState } from "@libraries/recoil";
import useChangeStaffSettingInfo from "@hooks/mutation/usePatchStaffInfo";
import { toast } from "react-toastify";

interface StaffSettingsModalProps extends CMModalProps {
  staffInfo: GetStaffInfoResponse;
}

export default function StaffSettingsModal({
  onClose,
  staffInfo,
  ...props
}: StaffSettingsModalProps) {
  const { mutate: changeStaffSettingInfo } = useChangeStaffSettingInfo();
  const selectAreaList = useRecoilValue(selectAreaState);

  const form = useForm<EditStaffInfo>({
    defaultValues: {
      name: "",
      staffRole: "DOCTOR",
      wardName: "",
      area: [],
      id: "",
      phoneNumber: "",
      password: "",
      confirmpassword: "",
      email: "",
    },
    mode: "onChange",
  });
  const { handleSubmit } = form;

  const onSubmit: SubmitHandler<EditStaffInfo> = data => {
    const patchData = {
      staffId: staffInfo.staffId,
      staffRole: data.staffRole,
      areaIds: selectAreaList,
      password: data.password,
      email: data.email,
    };
    console.log(patchData);
    changeStaffSettingInfo(patchData, {
      onSuccess: () => {
        toast.success("계정 정보 변경 완료");
        onClose();
      },
      onError: () => toast.error("계정 정보 변경 실패"),
    });
  };

  return (
    <CMModal
      {...props}
      maxWidth="xs"
      title={"계정 정보 변경"}
      onClose={() => {
        onClose();
      }}
      sx={{
        "height": "100%",
        "margin": "auto auto",
        "& .MuiDialog-paper": {
          overflowY: "hidden",
        },
      }}
      footer={
        <>
          <ModalActionButton
            hoverColor="#19181813"
            color="secondary"
            onClick={() => {
              onClose();
            }}
          >
            취소
          </ModalActionButton>
          <ModalActionButton
            hoverColor="#30b3ff55"
            color="success"
            onClick={handleSubmit(onSubmit)}
          >
            변경하기
          </ModalActionButton>
        </>
      }
    >
      <AdminFormContainer>
        <Stack gap={"24px"}>
          <>
            {fields.map(field => (
              <EditStaffInfoInputField
                key={field.name}
                field={field}
                form={form}
                staffInfo={staffInfo}
              />
            ))}
          </>
        </Stack>
      </AdminFormContainer>
    </CMModal>
  );
}

/** utils */

export type EditStaffInfo = {
  name: string;
  staffRole: string;
  wardName: string;
  area: string[];
  id: string;
  password: string;
  confirmpassword: string;
  phoneNumber: string;
  email: string;
};

export type EditStaffInfoField = {
  name: keyof EditStaffInfo;
  label: string;
  placeholder: string;
};

const fields: EditStaffInfoField[] = [
  { name: "name", label: "이름", placeholder: "" },
  { name: "staffRole", label: "직업", placeholder: "" },
  { name: "wardName", label: "소속 병동", placeholder: "" },
  { name: "area", label: "구역", placeholder: "" },
  { name: "id", label: "아이디", placeholder: "" },
  { name: "password", label: "비밀번호", placeholder: "" },
  { name: "confirmpassword", label: "비밀번호 확인", placeholder: "" },
  { name: "phoneNumber", label: "전화번호", placeholder: "" },
  { name: "email", label: "이메일", placeholder: "이메일을 입력해주세요." },
];

/** styles */

const AdminFormContainer = styled(Box)(({ theme }) => ({
  "height": "calc(100vh - 250px)",
  "overflowY": "auto",
  "paddingRight": "20px",

  "&::-webkit-scrollbar": {
    width: "6px",
  },
  "&::-webkit-scrollbar-track": {
    background: theme.palette.background.default,
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: theme.palette.secondary.main,
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "#30b3ff55",
  },
}));
