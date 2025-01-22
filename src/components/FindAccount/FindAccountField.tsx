import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, UseFormReturn } from "react-hook-form";
import CButton from "@components/common/atom/C-Button";
import { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import verifyPhoneState from "@libraries/recoil/verifyPhone";
import useTimer from "@utils/useTimer";
import axios from "axios";
import { SEVER_URL } from "@constants/baseUrl";
import { FindAccount, FindAccountFieldType } from "@pages/find_account/FindAccountPage";
import { SwitchCase } from "@toss/react";

type FindAccountProps = {
  form: UseFormReturn<FindAccount>;
  field: FindAccountFieldType;
  type: "id" | "password";
};

const INITIAL_TIMER_SECONDS = 180; // 인증번호 타이머

export default function FindAccountField({ field, form, type }: FindAccountProps) {
  const { name, label, placeholder } = field;

  const {
    control,
    formState: { errors },
    getValues,
  } = form;

  const validationRules = {
    name: {
      required: "이름을 입력해주세요.",
    },
    id: {
      required: "아이디를 입력해주세요.",
    },
    phoneNumber: {
      required: "전화번호를 입력해주세요.",
      pattern: { value: /^\d{3}-\d{4}-\d{4}$/, message: "올바른 전화번호 형식을 입력해주세요." },
      validate: (value: string, { phoneNumber }: FindAccount) => {
        if (value === phoneNumber) {
          setValidState(prev => ({
            ...prev,
            phoneNumber: {
              isValid: true,
              message: "",
            },
          }));
          return true;
        }

        setValidState(prev => ({
          ...prev,
          phoneNumber: undefined,
        }));
        return "전화번호를 올바르게 입력해주세요.";
      },
    },
  };

  const verifyPhone = useRecoilValue(verifyPhoneState);
  const setVerifyPhone = useSetRecoilState(verifyPhoneState);

  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [verifyCode, setVerifyCode] = useState<string>("");
  const [showVerifyCode, setShowVerifyCode] = useState<boolean>(false);

  //@ts-ignore
  const [_, setValidState] = useState<{
    phoneNumber?: {
      isValid: boolean;
      message?: string;
    };
  }>({});

  const { timer, resetTimer, stopTimer } = useTimer(INITIAL_TIMER_SECONDS);

  // 타이머 함수
  const formatTime = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `0${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const verifyPhoneNumber = async () => {
    const phoneNumber = getValues("phoneNumber");
    if (!phoneNumber) {
      form.setError("phoneNumber", {
        type: "required",
        message: "전화번호를 입력해주세요.",
      });
      return;
    }

    const phonePattern = /^\d{3}-\d{4}-\d{4}$/;
    if (!phonePattern.test(phoneNumber)) {
      form.setError("phoneNumber", {
        type: "pattern",
        message: "올바른 전화번호 형식을 입력해주세요.",
      });
      return;
    }

    try {
      resetTimer();
      const _phoneNumber = phoneNumber.replace(/-/g, "");
      const res = await axios.post(`${SEVER_URL}/sms/send`, {
        phoneNumber: _phoneNumber,
      });
      console.log(res.data);
      setShowVerifyCode(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCheckVerifyCode = async () => {
    if (verifyPhone) {
      return;
    }
    try {
      const _phoneNumber = phoneNumber.replace(/-/g, "");
      const res = await axios.post(`${SEVER_URL}/sms/verify`, {
        phoneNumber: _phoneNumber,
        verifyCode: verifyCode,
      });

      if (res.data.isVerified) {
        setVerifyPhone(true);
        stopTimer();
      } else {
        alert("인증번호가 일치하지 않습니다.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {!(type === "id" && field.name === "id") && (
        <FormControl
          key={name}
          error={Boolean(errors[name])}
          sx={{ "gap": "3px", "& .MuiInputLabel-asterisk": { color: "#FF7253 !important" } }}
        >
          <InputLabel htmlFor={name} required>
            {label}
          </InputLabel>
          <Controller
            name={name}
            control={control}
            rules={validationRules[name]}
            render={({ field }) => (
              <SwitchCase
                value={field.name}
                caseBy={{
                  phoneNumber: (
                    <>
                      <TextField
                        {...field}
                        id={name}
                        placeholder={placeholder}
                        type={"text"}
                        error={Boolean(errors[name])}
                        onChange={e => {
                          const inputValue = e.target.value;
                          const isDeleting = inputValue.length < phoneNumber.length;

                          let value = inputValue.replace(/[^0-9]/g, "");

                          if (isDeleting && phoneNumber.endsWith("-")) {
                            value = value.slice(0, -1);
                          }

                          let formattedValue = value;
                          if (value.length >= 3) {
                            formattedValue = value.slice(0, 3) + "-" + value.slice(3);
                          }
                          if (value.length >= 7) {
                            formattedValue = formattedValue.slice(0, 8) + "-" + value.slice(7);
                          }

                          formattedValue = formattedValue.slice(0, 13);

                          field.onChange({ ...e, target: { ...e.target, value: formattedValue } });
                          setPhoneNumber(formattedValue);
                          setVerifyPhone(false);
                          setValidState(prev => ({ ...prev, phoneNumber: undefined }));
                        }}
                        sx={{
                          width: "65%",
                        }}
                      />
                      <CButtonWrapper type="phoneNumber">
                        <CButton
                          buttontype="primarySpaureWhite"
                          sx={{
                            height: "56px",
                          }}
                          onClick={verifyPhoneNumber}
                        >
                          {showVerifyCode ? "인증번호 재요청" : "인증번호 요청"}
                        </CButton>
                      </CButtonWrapper>
                    </>
                  ),
                }}
                defaultComponent={
                  <>
                    {type === "id" ? (
                      <TextField
                        {...field}
                        id={name}
                        placeholder={placeholder}
                        value={""}
                        onChange={() => null}
                        error={Boolean(errors[name])}
                        sx={{ width: "420px", display: field.name === "id" ? "none" : "flex" }}
                      />
                    ) : (
                      <TextField
                        {...field}
                        id={name}
                        placeholder={placeholder}
                        value={""}
                        onChange={() => null}
                        error={Boolean(errors[name])}
                        sx={{
                          width: "420px",
                        }}
                      />
                    )}
                  </>
                }
              />
            )}
          />
          {errors[name] && <FormHelperText>{errors[name]?.message}</FormHelperText>}
        </FormControl>
      )}

      {showVerifyCode && (
        <div
          style={{
            position: "relative",
            width: "100%",
            marginBottom: `${verifyPhone ? "20px" : "50px"}`,
          }}
        >
          <TextField
            placeholder="인증번호를 입력하세요"
            sx={{
              width: "65%",
            }}
            onChange={e => setVerifyCode(e.target.value)}
          />
          {!verifyPhone && <Timer>{formatTime()}</Timer>}
          <VerifyCodeButtonWrapper>
            <CButton
              buttontype="primarySpaureWhite"
              sx={{
                height: "56px",
              }}
              onClick={handleCheckVerifyCode}
            >
              인증번호 확인
            </CButton>
          </VerifyCodeButtonWrapper>
          {verifyPhone ? (
            <SuccessText>인증이 완료되었습니다.</SuccessText>
          ) : (
            <VerifyText>
              인증번호는 3분 이내 입력해야 합니다. <br />
              제한시간이 지났을 경우 인증번호를 다시 받아 주세요.
            </VerifyText>
          )}
        </div>
      )}
    </>
  );
}

/** styles */

const CButtonWrapper = styled(Box)<{ type: string }>`
  cursor: pointer;
  width: ${(props: { type: string }) => (props.type === "username" ? "110px" : "130px")};
  position: absolute;
  top: 23px;
  right: 0px;
`;

const VerifyCodeButtonWrapper = styled(Box)`
  cursor: pointer;
  width: 130px;
  position: absolute;
  top: 0;
  right: 0;
`;

const Timer = styled(Typography)`
  position: absolute;
  top: 19px;
  left: 225px;
  font-size: 14px;
  font-weight: 600;
  color: #ff0000;
`;

const VerifyText = styled(Typography)`
  position: absolute;
  width: 80%;
  left: 10px;
  top: 60px;
  font-size: 12px;
  font-weight: 600;
  color: #ff0000;
`;

const SuccessText = styled(VerifyText)`
  color: #0fbc0c;
`;
