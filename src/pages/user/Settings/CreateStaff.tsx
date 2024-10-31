// 스태프 계정 설정

import CButton from "@components/common/atom/C-Button";
import NewStaffInputField from "@components/settings/NewStaffInputField";
import useCreateStaff from "@hooks/mutation/useCreateStaff";
import doubleCheckState from "@libraries/recoil/staff";
import { NewStaff, NewStaffField, QuickRegisterNewStaff } from "@models/staff";
import { Box, Typography } from "@mui/material";
import { Stack, styled } from "@mui/system";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";

const defaultValues: NewStaff = {
  name: "",
  occupation: "DOCTOR",
  username: "",
  password: "",
  confirmPassword: "",
  phoneNumber: "",
  email: "",
};

const quickRegisters: QuickRegisterNewStaff[] = [
  { label: "NFC", value: "NFC 등록" },
  { label: "지문 입력", value: "지문 등록" },
];

interface CreateStaffProps {
  onCreate: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CreateStaff = ({ onCreate }: CreateStaffProps) => {
  const [isDoubleChecked, setIsDoubleCheckd] = useRecoilState(doubleCheckState);
  const navigate = useNavigate();

  const { mutate } = useCreateStaff();

  const form = useForm<NewStaff>({
    defaultValues,
    mode: "onChange",
  });

  const { handleSubmit } = form;

  const onSubmit: SubmitHandler<NewStaff> = data => {
    // console.log(data);
    const newStaffRequesets = {
      name: data.name,
      loginId: data.username,
      password: data.password,
      phoneNumber: data.phoneNumber,
      email: data.email,
      nfc: "",
      fingerprint: "",
      staffRole: data.occupation,
    };

    mutate(newStaffRequesets, {
      onSuccess: () => {
        toast.success("스태프 계정 생성이 완료되었습니다.");
        navigate("/");
        setIsDoubleCheckd(false);
      },
      onError: error => {
        toast.error(error.message);
      },
    });
  };
  return (
    <>
      <BodyTitleContainer>
        <Title variant="h1">스태프 계정 생성</Title>
      </BodyTitleContainer>
      <StaffInputLayout>
        <Stack gap={"24px"} style={{ width: "343px" }}>
          {fields.map(field => (
            <NewStaffInputField key={field.name} field={field} form={form} />
          ))}
          <Stack gap={"24px"}>
            {quickRegisters.map(quickReg => (
              <Stack gap={"3px"}>
                <Typography variant="h3">{quickReg.label}</Typography>
                <CButton buttontype="primarySpaureWhite" style={{ height: "50px" }}>
                  {quickReg.value}
                </CButton>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </StaffInputLayout>
      <ConfirmLayout>
        <CButton
          buttontype="primaryWhite"
          onClick={() => onCreate(false)}
          style={{ width: "134px", height: "45px" }}
        >
          이전으로
        </CButton>
        <CButton
          buttontype="primary"
          onClick={handleSubmit(onSubmit)}
          style={{ width: "134px", height: "45px" }}
          sx={{
            "&:hover": {
              backgroundColor: "#4759b2", // hover 시 더 진한 빨간색
            },
          }}
          disabled={!isDoubleChecked}
        >
          다음
        </CButton>
      </ConfirmLayout>
    </>
  );
};

/** utils */

const fields: NewStaffField[] = [
  { name: "name", label: "이름", placeholder: "이름을 입력해주세요." },
  { name: "occupation", label: "직종 선택", placeholder: "의사" },
  { name: "username", label: "아이디", placeholder: "아이디를 입력해주세요." },
  { name: "password", label: "비밀번호", placeholder: "비밀번호를 입력해주세요.(4자 이상)" },
  {
    name: "confirmPassword",
    label: "비밀번호 확인",
    placeholder: "비밀번호를 다시 한번 입력해주세요.",
  },
  { name: "phoneNumber", label: "전화번호", placeholder: "010-0000-0000" },
  { name: "email", label: "이메일", placeholder: "이메일을 입력해주세요." },
];

/** styles */

const BodyTitleContainer = styled(Box)({
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: "60px 0 40px 0",
});

const Title = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.dark,
  textTransform: "uppercase",
  lineHeight: "24px",
  letterSpacing: "-3%",
}));

const StaffInputLayout = styled(Box)(({ theme }) => ({
  "display": "flex",
  "justifyContent": "center",

  "margin": "0 auto",
  "maxWidth": "400px",
  "maxHeight": "700px",

  "overflowY": "scroll",
  "&::-webkit-scrollbar": {
    width: "5px",
  },
  "&::-webkit-scrollbar-track": {
    background: theme.palette.background.default,
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: theme.palette.primary.main,
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: theme.palette.primary.light,
  },
}));

const ConfirmLayout = styled(Box)({
  display: "flex",
  justifyContent: "center",
  gap: "40px",

  marginTop: "80px",
});
