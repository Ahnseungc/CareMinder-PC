import CButton from "@components/common/atom/C-Button";
import doubleCheckState from "@libraries/recoil/staff";
import { AdminUserField, NewAdminUser } from "@models/user";
import {
  Box,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  styled,
  TextField,
  Typography,
} from "@mui/material";
// import axiosInstance from "@utils/axios/axiosInstance";
import axios from "axios";
import { SEVER_URL } from "@constants/baseUrl";
import { useState } from "react";
// import { validateBusinessNumber } from "@utils/signin";
import { Controller, UseFormReturn } from "react-hook-form";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useBooleanState } from "@toss/react";
import DaumPostModal from "./DaumPostModal";
import addressState from "@libraries/recoil/address";
import verifyPhoneState from "@libraries/recoil/verifyPhone";
import useTimer from "@utils/useTimer";

type InputFieldProps = { form: UseFormReturn<NewAdminUser>; field: AdminUserField };

const INITIAL_TIMER_SECONDS = 180; // 인증번호 타이머

export default function InputField({ field, form }: InputFieldProps) {
  const setDoubleCheck = useSetRecoilState(doubleCheckState);
  const verifyPhone = useRecoilValue(verifyPhoneState);
  const setVerifyPhone = useSetRecoilState(verifyPhoneState);
  const addressValue = useRecoilValue(addressState);

  const [isDaumPostOpen, openDaumPost, closeDaumPost] = useBooleanState();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showVerifyCode, setShowVerifyCode] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [verifyCode, setVerifyCode] = useState<string>("");
  const [detailAddressValue, setDetailAddressValue] = useState<string>("");
  const [validState, setValidState] = useState<{
    username?: {
      isValid: boolean;
      message?: string;
    };
    confirmPassword?: {
      isValid: boolean;
      message?: string;
    };
    phoneNumber?: {
      isValid: boolean;
      message?: string;
    };
  }>({});

  const validationRules = {
    name: { required: "이름을 입력해주세요." },
    hospitalName: { required: "병원명을 입력해주세요." },
    postalCode: { required: "병원 주소를 입력해주세요." },
    mainAddress: { required: "병원 주소를 입력해주세요." },
    detailAddress: { required: "정보를 입력해주세요." },
    registrationNumber: {
      required: "사업자등록번호를 입력해주세요.",
      // validate: (value: string) =>
      //   validateBusinessNumber(value) || "올바른 사업자등록번호를 입력해주세요.",
    },
    username: { required: "아이디를 입력해주세요." },
    password: {
      required: "비밀번호를 입력해주세요.",
      minLength: { value: 4, message: "비밀번호는 최소 4자 이상이어야 합니다." },
    },
    confirmPassword: {
      required: "비밀번호를 재입력해주세요.",
      validate: (value: string, { password }: NewAdminUser) => {
        if (value === password) {
          setValidState(prev => ({
            ...prev,
            confirmPassword: {
              isValid: true,
              message: "비밀번호가 올바르게 확인되었습니다.",
            },
          }));
          return true;
        }

        setValidState(prev => ({
          ...prev,
          confirmPassword: undefined,
        }));
        return "비밀번호가 올바르지 않습니다.";
      },
    },
    phoneNumber: {
      required: "전화번호를 입력해주세요.",
      pattern: { value: /^\d{3}-\d{4}-\d{4}$/, message: "올바른 전화번호 형식을 입력해주세요." },
      validate: (value: string, { phoneNumber }: NewAdminUser) => {
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
    verifyCode: { required: "인증번호를 입력해주세요." },
    email: {
      pattern: {
        value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
        message: "이메일 형식이 올바르지 않습니다.",
      },
    },
  };
  const { name, label, placeholder } = field;

  const {
    control,
    formState: { errors },
    getValues,
    setValue,
  } = form;

  const doubleCheck = async () => {
    const username = getValues("username");
    if (!username) {
      form.setError("username", {
        type: "manual",
        message: "아이디를 입력해주세요.",
      });
      return;
    } else {
      try {
        const doubleCheck = {
          loginId: username,
          accountType: "ADMIN",
        };
        const res = await axios.post(`${SEVER_URL}/users/check-login-id`, doubleCheck);
        if (res.data === "사용 가능한 아이디입니다.") {
          setDoubleCheck(true);
          form.clearErrors("username");
          setValidState({
            username: {
              isValid: true,
              message: "사용 가능한 아이디입니다.",
            },
          });
        }
      } catch (err) {
        console.log(err);
        if (axios.isAxiosError(err) && err.response) {
          console.error(err.response?.status);
          if (err.response.status === 409) {
            form.setError("username", {
              type: "manual",
              message: "이미 사용중인 아이디입니다.",
            });
            setValidState(prev => ({ ...prev, username: undefined }));
          }
        }
      }
    }
  };

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
    try {
      const _phoneNumber = phoneNumber.replace(/-/g, "");
      const res = await axios.post(`${SEVER_URL}/sms/verify`, {
        phoneNumber: _phoneNumber,
        verifyCode: verifyCode,
      });

      if (res.data.isVerified) {
        setVerifyPhone(true);
        stopTimer();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickShowPassword = () => setShowPassword(show => !show);

  return (
    <>
      <DaumPostModal open={isDaumPostOpen} onClose={closeDaumPost} setValue={setValue} />
      <FormControl
        key={name}
        error={Boolean(errors[name])}
        sx={{
          "gap": "3px",
          "& .MuiInputLabel-asterisk": {
            color: "#FF7253 !important",
          },
          "display": `${
            addressValue === null && (name === "mainAddress" || name === "detailAddress")
              ? "none"
              : "block"
          }`,
        }}
      >
        <InputLabel
          htmlFor={name}
          required={name !== "email"}
          sx={{
            position: "relative",
            display: `${name === "mainAddress" || name === "detailAddress" ? "none" : "block"}`,
          }}
        >
          {label}
        </InputLabel>
        <span style={{ position: "absolute", top: "0px", right: "0", fontSize: "10px" }}>
          {label === "비밀번호" ? "4자 이상의 영문(대/소문자)또는 숫자" : ""}
        </span>
        <Controller
          name={name}
          control={control}
          rules={validationRules[name]}
          render={({ field }) => (
            <div style={{ position: "relative" }}>
              {field.name === "postalCode" ? (
                <>
                  <TextField
                    {...field}
                    id={name}
                    placeholder={placeholder}
                    type={inputTypes[name] || "text"}
                    error={Boolean(errors[name])}
                    sx={{ width: "60%" }}
                    value={addressValue?.zonecode}
                    onClick={openDaumPost}
                  />
                  <CButtonWrapper type="hospitalAddress">
                    <CButton
                      buttontype="primarySpaureWhite"
                      sx={{
                        height: "56px",
                      }}
                      onClick={openDaumPost}
                    >
                      우편번호 찾기
                    </CButton>
                  </CButtonWrapper>
                </>
              ) : field.name === "mainAddress" ? (
                <TextField
                  {...field}
                  id={name}
                  placeholder={"도로명 주소를 입력해주세요"}
                  type={inputTypes[name] || "text"}
                  error={Boolean(errors[name])}
                  value={addressValue?.roadAddress}
                  sx={{
                    width: "100%",
                    display: `${addressValue === null ? "none" : "flex"}`,
                  }}
                />
              ) : field.name === "detailAddress" ? (
                <TextField
                  {...field}
                  id={name}
                  placeholder={"상세 주소를 입력해주세요"}
                  type={inputTypes[name] || "text"}
                  error={Boolean(errors[name])}
                  value={detailAddressValue}
                  sx={{
                    width: "100%",
                    display: `${addressValue === null ? "none" : "flex"}`,
                  }}
                  onChange={e => {
                    setValue("detailAddress", e.target.value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                    setDetailAddressValue(e.target.value);
                  }}
                />
              ) : field.name === "username" ? (
                <>
                  <TextField
                    {...field}
                    id={name}
                    placeholder={placeholder}
                    type={inputTypes[name] || "text"}
                    error={Boolean(errors[name])}
                    onChange={e => {
                      field.onChange(e);
                      setDoubleCheck(false);
                      setValidState(prev => ({ ...prev, username: undefined }));
                    }}
                    sx={{ width: "65%" }}
                  />
                  <CButtonWrapper type="username">
                    <CButton
                      buttontype="primarySpaureWhite"
                      sx={{
                        height: "56px",
                      }}
                      onClick={doubleCheck}
                    >
                      중복 확인
                    </CButton>
                  </CButtonWrapper>
                </>
              ) : field.name === "phoneNumber" ? (
                <>
                  <TextField
                    {...field}
                    id={name}
                    placeholder={placeholder}
                    type={inputTypes[name] || "text"}
                    error={Boolean(errors[name])}
                    onChange={e => {
                      field.onChange(e);
                      setPhoneNumber(e.target.value);
                      setVerifyPhone(false);
                      setValidState(prev => ({ ...prev, phoneNumber: undefined }));
                    }}
                    sx={{ width: "60%" }}
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
              ) : (
                <TextField
                  {...field}
                  id={name}
                  placeholder={placeholder}
                  type={showPassword ? "text" : inputTypes[name]}
                  error={Boolean(errors[name])}
                  onChange={e => {
                    field.onChange(e);
                  }}
                  sx={{ width: "100%" }}
                  InputProps={{
                    endAdornment:
                      name === "password" || name === "confirmPassword" ? (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ) : null,
                  }}
                />
              )}
            </div>
          )}
        />
        {errors[name] && <FormHelperText>{errors[name]?.message}</FormHelperText>}
        {validState.username?.isValid && name === "username" && (
          <FormHelperText sx={{ color: "#1ADE00" }}>{validState.username.message}</FormHelperText>
        )}
        {validState.confirmPassword?.isValid && name === "confirmPassword" && (
          <FormHelperText sx={{ color: "#1ADE00" }}>
            {validState.confirmPassword.message}
          </FormHelperText>
        )}
      </FormControl>
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
            sx={{ width: "60%" }}
            onChange={e => setVerifyCode(e.target.value)}
          />
          <Timer>{formatTime()}</Timer>
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

/** style */

const inputTypes: { [key in keyof NewAdminUser]: string } = {
  name: "text",
  hospitalName: "text",
  postalCode: "text",
  mainAddress: "text",
  detailAddress: "text",
  registrationNumber: "text",
  username: "text",
  password: "password",
  confirmPassword: "password",
  phoneNumber: "tel",
  email: "email",
};

const CButtonWrapper = styled(Box)<{ type: string }>`
  cursor: pointer;
  width: ${(props: { type: string }) => (props.type === "username" ? "110px" : "130px")};
  position: absolute;
  top: 0;
  right: 0;
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
  left: 180px;
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
