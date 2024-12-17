import { CMModal, CMModalProps, ModalActionButton } from "@components/common";
import InputField from "@components/signin/admin/InputField";
import { useCreateAdmin } from "@hooks/mutation";
import doubleCheckState from "@libraries/recoil/staff";
import { AdminUserField, NewAdminUser } from "@models/user";
import { Box, Checkbox, FormControlLabel, Stack, styled, Typography } from "@mui/material";
import { SwitchCase } from "@toss/react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { toast } from "react-toastify";
import { useRecoilState } from "recoil";
type Step = "어드민 계정 생성 약관 동의서" | "어드민 계정 생성";

const defaultValues: NewAdminUser = {
  name: "",
  hospitalName: "",
  hospitalAddress: "",
  registrationNumber: "",
  username: "",
  password: "",
  confirmPassword: "",
  phoneNumber: "",
  email: "",
};

export default function CreateAdminModal({ onClose, ...props }: CMModalProps) {
  const [step, setStep] = useState<Step>("어드민 계정 생성 약관 동의서");
  const [agreementChecked, setChecked] = useState<boolean>(false);
  const [isDoubleChecked, setIsDoubleCheckd] = useRecoilState(doubleCheckState);

  const form = useForm<NewAdminUser>({
    defaultValues,
    mode: "onChange",
  });
  const { handleSubmit } = form;

  const toggle = () => setChecked(prev => !prev);

  const { mutate } = useCreateAdmin();

  const onSubmit: SubmitHandler<NewAdminUser> = data => {
    const defaultAdminRequest = {
      adminSignUpRequest: {
        loginId: data.username,
        password: data.password,
        managerName: data.name,
        managerPhoneNumber: data.phoneNumber,
        managerEmail: data.email,
        nfc: "",
        fingerprint: "",
      },
      hospitalCreateRequest: {
        name: data.hospitalName,
        address: data.hospitalAddress,
        businessRegistrationNumber: data.registrationNumber,
      },
    };

    console.log(defaultAdminRequest);
    mutate(defaultAdminRequest, {
      onSuccess: () => {
        console.log("어드민 회원가입 성공");
        toast.success("어드민 계정 생성이 완료되었습니다.");
        setIsDoubleCheckd(false);
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
      maxWidth={step === "어드민 계정 생성 약관 동의서" ? "lg" : "xs"}
      title={step}
      footer={
        <SwitchCase
          value={step}
          caseBy={{
            ["어드민 계정 생성 약관 동의서"]: (
              <>
                <ModalActionButton color="secondary" onClick={onClose}>
                  취소
                </ModalActionButton>
                <ModalActionButton
                  disabled={!agreementChecked}
                  onClick={() => setStep("어드민 계정 생성")}
                >
                  다음
                </ModalActionButton>
              </>
            ),
            ["어드민 계정 생성"]: (
              <>
                <ModalActionButton
                  color="secondary"
                  onClick={() => setStep("어드민 계정 생성 약관 동의서")}
                >
                  취소
                </ModalActionButton>
                <ModalActionButton disabled={!isDoubleChecked} onClick={handleSubmit(onSubmit)}>
                  추가하기
                </ModalActionButton>
              </>
            ),
          }}
        />
      }
      {...props}
    >
      <SwitchCase
        value={step}
        caseBy={{
          ["어드민 계정 생성 약관 동의서"]: (
            <>
              <TOSContainer sx={{ width: "calc(100% - 24px)" }}>
                <TOSContentField>
                  <Typography variant="subtitle2" sx={{ fontWeight: "500" }} color="black">
                    약관 동의 조항 제목이 노출됩니다.
                  </Typography>
                  <Typography variant="body2">
                    약관 동의 조항 상세내용이 노출됩니다. 약관 동의 조항 상세내용이 노출됩니다. 약관
                    동의 조항 상세내용이 노출됩니다. 약관 동의 조항 상세내용이 노출됩니다. 약관 동의
                    조항 상세내용이 노출됩니다.
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: "500" }} color="black">
                    약관 동의 조항 제목이 노출됩니다.
                  </Typography>
                  <Typography variant="body2">
                    약관 동의 조항 상세내용이 노출됩니다. 약관 동의 조항 상세내용이 노출됩니다. 약관
                    동의 조항 상세내용이 노출됩니다. 약관 동의 조항 상세내용이 노출됩니다. 약관 동의
                    조항 상세내용이 노출됩니다.
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: "500" }} color="black">
                    약관 동의 조항 제목이 노출됩니다.
                  </Typography>
                  <Typography variant="body2">
                    약관 동의 조항 상세내용이 노출됩니다. 약관 동의 조항 상세내용이 노출됩니다. 약관
                    동의 조항 상세내용이 노출됩니다. 약관 동의 조항 상세내용이 노출됩니다. 약관 동의
                    조항 상세내용이 노출됩니다.
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: "500" }} color="black">
                    약관 동의 조항 제목이 노출됩니다.
                  </Typography>
                </TOSContentField>
              </TOSContainer>
              <FormControlLabel
                control={<Checkbox checked={agreementChecked || false} onChange={toggle} />}
                label="필수 약관에 동의합니다."
              />
            </>
          ),
          ["어드민 계정 생성"]: (
            <Stack gap={"24px"}>
              {fields.map(field => (
                <InputField key={field.name} field={field} form={form} />
              ))}
            </Stack>
          ),
        }}
      />
    </CMModal>
  );
}

/** utils */

const fields: AdminUserField[] = [
  { name: "name", label: "이름", placeholder: "이름을 입력해주세요." },
  { name: "hospitalName", label: "병원명", placeholder: "병원명을 입력해주세요." },
  { name: "hospitalAddress", label: "병원 주소", placeholder: "병원 주소를 입력해주세요." },
  {
    name: "registrationNumber",
    label: "사업자등록번호",
    placeholder: "사업자등록번호를 입력해주세요.",
  },
  { name: "username", label: "아이디", placeholder: "아이디를 입력해주세요." },
  { name: "password", label: "비밀번호", placeholder: "비밀번호를 입력해주세요." },
  { name: "confirmPassword", label: "비밀번호 확인", placeholder: "비밀번호를 재입력해주세요." },
  { name: "phoneNumber", label: "전화번호", placeholder: "010-0000-0000" },
  { name: "email", label: "이메일", placeholder: "이메일을 입력해주세요." },
];

/** styles */

const TOSContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.success.main,
  borderRadius: "24px",

  marginBottom: "30px",
  padding: "10px 20px",
}));

const TOSContentField = styled(Box)(({ theme }) => ({
  "height": "688px",
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
    background: theme.palette.primary.main,
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: theme.palette.primary.light,
  },
}));
