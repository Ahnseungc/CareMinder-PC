import { CMModal, CMModalProps, ModalActionButton } from "@components/common";
import { Box, Checkbox, FormControlLabel, Stack, styled, Typography } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import NewWardInputField from "./NewWardInputField";
import { NewWard, NewWardField, NewWardRequest } from "@models/ward";
import useCreateWard from "@hooks/mutation/useCreateWard";
import InfoModal from "@components/settings/modal/InfoModal";
import { SwitchCase, useBooleanState } from "@toss/react";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { doubleCheckState, wardNameCheckState } from "@libraries/recoil/idDoubleCheck";
import verifyPhoneState from "@libraries/recoil/verifyPhone";

type Step = "병동 계정 생성 약관 동의서" | "병동 계정 생성";

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
  const [step, setStep] = useState<Step>("병동 계정 생성 약관 동의서");
  const [agreementChecked, setChecked] = useState<boolean>(false);
  const [open, openModal, closeModal] = useBooleanState();
  const [isWardNameChecked, setIsWardNameChecked] = useRecoilState(wardNameCheckState);
  const [isLoginIdChecked, setIsLoginIdChecked] = useRecoilState(doubleCheckState);
  const [isVerifyPhoneChecked, setIsVerifyPhoneChecked] = useRecoilState(verifyPhoneState);

  const form = useForm<NewWard>({
    defaultValues,
    mode: "onChange",
  });
  const { handleSubmit, reset } = form;

  const toggle = () => setChecked(prev => !prev);

  const { mutate } = useCreateWard();

  const onSubmit: SubmitHandler<NewWardRequest> = data => {
    const newWardRequesets = {
      wardName: data.wardName,
      loginId: data.loginId,
      password: data.password,
      managerName: data.managerName,
      managerPhoneNumber: data.managerPhoneNumber,
      managerEmail: data.managerEmail,
    };

    mutate(newWardRequesets, {
      onSuccess: () => {
        toast.success("병동 계정 생성이 완료되었습니다.");
        onClose();
        openModal();
        setIsWardNameChecked(false);
        setIsLoginIdChecked(false);
        setIsVerifyPhoneChecked(false);
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
        onClose={() => {
          onClose();
          reset();
          setChecked(false);
          setStep("병동 계정 생성 약관 동의서");
        }}
        maxWidth={step === "병동 계정 생성 약관 동의서" ? "md" : "xs"}
        sx={{
          "height": `${step === "병동 계정 생성" ? "95%" : "100%"}`,
          "margin": "auto",
          "& .MuiDialog-paper": {
            overflowY: "hidden",
          },
        }}
        title={step}
        footer={
          <>
            <SwitchCase
              value={step}
              caseBy={{
                ["병동 계정 생성 약관 동의서"]: (
                  <>
                    <ModalActionButton
                      color="secondary"
                      onClick={() => {
                        onClose();
                        setChecked(false);
                      }}
                      sx={{
                        "&:hover": {
                          backgroundColor: "#5DB8BE3c !important",
                        },
                      }}
                    >
                      취소
                    </ModalActionButton>
                    <ModalActionButton
                      color="info"
                      disabled={!agreementChecked}
                      onClick={() => setStep("병동 계정 생성")}
                    >
                      동의합니다
                    </ModalActionButton>
                  </>
                ),
                ["병동 계정 생성"]: (
                  <>
                    <ModalActionButton
                      color="secondary"
                      onClick={() => {
                        onClose();
                        reset();
                        setChecked(false);
                        setStep("병동 계정 생성 약관 동의서");
                      }}
                      sx={{
                        "&:hover": {
                          backgroundColor: "#5DB8BE3c !important",
                        },
                      }}
                    >
                      취소
                    </ModalActionButton>
                    <ModalActionButton
                      color="info"
                      onClick={handleSubmit(onSubmit)}
                      disabled={!isWardNameChecked || !isLoginIdChecked || !isVerifyPhoneChecked}
                    >
                      완료
                    </ModalActionButton>
                  </>
                ),
              }}
            />
          </>
        }
        {...props}
      >
        <SwitchCase
          value={step}
          caseBy={{
            ["병동 계정 생성 약관 동의서"]: (
              <>
                <TOSContainer sx={{ width: "calc(100% - 24px)" }}>
                  <TOSContentField>
                    <Typography variant="subtitle2" sx={{ fontWeight: "500" }} color="black">
                      약관 동의 조항 제목이 노출됩니다.
                    </Typography>
                  </TOSContentField>
                </TOSContainer>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={agreementChecked || false}
                      onChange={toggle}
                      sx={{
                        "color": "#5DB8BE",
                        "&.Mui-checked": {
                          color: "#5DB8BE",
                        },
                      }}
                    />
                  }
                  label="필수 약관에 동의합니다."
                />
              </>
            ),
            ["병동 계정 생성"]: (
              <Stack gap={"24px"}>
                {fields.map(field => (
                  <NewWardInputField key={field.name} field={field} form={form} />
                ))}
              </Stack>
            ),
          }}
        />
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

const TOSContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.success.main,
  borderRadius: "24px",

  marginBottom: "30px",
  padding: "10px 20px",
}));

const TOSContentField = styled(Box)(({ theme }) => ({
  "height": "488px",
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
    background: "#5DB8BE",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "#5DB8BEcc",
  },
}));
