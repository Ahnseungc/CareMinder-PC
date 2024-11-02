import CButton from "@components/common/atom/C-Button";
import doubleCheckState from "@libraries/recoil/staff";
import { AdminUserField, NewAdminUser } from "@models/user";
import { FormControl, FormHelperText, InputLabel, TextField } from "@mui/material";
// import axiosInstance from "@utils/axios/axiosInstance";
import axios from "axios";
import { SEVER_URL } from "@constants/baseUrl";
import { useState } from "react";
// import { validateBusinessNumber } from "@utils/signin";
import { Controller, UseFormReturn } from "react-hook-form";
import { useSetRecoilState } from "recoil";

type InputFieldProps = { form: UseFormReturn<NewAdminUser>; field: AdminUserField };

export default function InputField({ field, form }: InputFieldProps) {
  const setDoubleCheck = useSetRecoilState(doubleCheckState);
  const [validState, setValidState] = useState<{
    username?: {
      isValid: boolean;
      message?: string;
    };
    confirmPassword?: {
      isValid: boolean;
      message?: string;
    };
  }>({});
  const validationRules = {
    name: { required: "이름을 입력해주세요." },
    hospitalName: { required: "병원명을 입력해주세요." },
    hospitalAddress: { required: "병원 주소를 입력해주세요." },
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
    },
    email: {
      required: "이메일을 입력해주세요.",
      pattern: {
        value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
        message: "올바른 이메일을 입력해주세요.",
      },
    },
  };
  const { name, label, placeholder } = field;

  const {
    control,
    formState: { errors },
    getValues,
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
        // const res = await axiosInstance.post("/users/check-login-id", doubleCheck);
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

  return (
    <FormControl key={name} error={Boolean(errors[name])} sx={{ gap: "3px" }}>
      <InputLabel htmlFor={name} required>
        {label}
      </InputLabel>
      <Controller
        name={name}
        control={control}
        rules={validationRules[name]}
        render={({ field }) => (
          <TextField
            {...field}
            id={name}
            placeholder={placeholder}
            type={inputTypes[name] || "text"}
            error={Boolean(errors[name])}
            onChange={e => {
              field.onChange(e);
              if (field.name === "username") {
                setDoubleCheck(false); // 값이 변경되면 doubleCheck 상태를 false로
                setValidState(prev => ({ ...prev, username: undefined })); // 성공 메시지도 제거
              }
            }}
            InputProps={{
              endAdornment:
                field.name === "username" ? (
                  <div style={{ width: "150px", cursor: "pointer" }}>
                    <CButton
                      buttontype="primary"
                      sx={{
                        "&:hover": {
                          backgroundColor: "#4759b2", // hover 시 더 진한 빨간색
                        },
                      }}
                      onClick={doubleCheck}
                    >
                      중복확인
                    </CButton>
                  </div>
                ) : null,
            }}
          />
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
  );
}

/** style */

const inputTypes: { [key in keyof NewAdminUser]: string } = {
  name: "text",
  hospitalName: "text",
  hospitalAddress: "text",
  registrationNumber: "text",
  username: "text",
  password: "password",
  confirmPassword: "password",
  phoneNumber: "tel",
  email: "email",
};
