import CButton from "@components/common/atom/C-Button";
import { CComboBox } from "@components/common/atom/C-ComboBox";
import doubleCheckState from "@libraries/recoil/staff";
import { NewStaff, NewStaffField } from "@models/staff";
import { FormControl, FormHelperText, InputLabel, TextField } from "@mui/material";
import axios from "axios";
import axiosInstance from "@utils/axios/axiosInstance";
import { useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { useSetRecoilState } from "recoil";

type InputFieldProps = { form: UseFormReturn<NewStaff>; field: NewStaffField };
const options = [
  { label: "DOCTOR", value: "의사" },
  { label: "NURSE", value: "간호사" },
  { label: "NURSE_ASSISTANT", value: "조무사" },
  { label: "WORKER", value: "직원" },
];

export default function NewStaffInputField({ field, form }: InputFieldProps) {
  const setDoubleCheck = useSetRecoilState(doubleCheckState);
  const [option, setOption] = useState<string>(options[0].value);
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
    occupation: {},
    username: { required: "아이디를 입력해주세요." },
    password: {
      required: "비밀번호를 입력해주세요.",
      minLength: { value: 4, message: "비밀번호는 최소 4자 이상이어야 합니다." },
    },
    confirmPassword: {
      required: "비밀번호를 재입력해주세요.",
      validate: (value: string, { password }: NewStaff) => {
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
    setValue,
    getValues,
  } = form;

  const handleChange = (event: any) => {
    const value = event.target.value;
    setOption(value);
    setValue("occupation", options.filter(option => option.value === value)[0].label);
  };

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
          accountType: "STAFF",
        };
        const res = await axiosInstance.post("/users/check-login-id", doubleCheck);
        // console.log(res);
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
      <InputLabel htmlFor={name} required={name !== "email"}>
        {label}
      </InputLabel>
      <Controller
        name={name}
        control={control}
        rules={validationRules[name]}
        render={({ field }) => (
          <>
            {field.name === "occupation" ? (
              <div style={{ height: "56px" }}>
                <CComboBox
                  placeholder={"의사"}
                  options={options.map(option => option.value)}
                  value={option}
                  onChange={handleChange}
                />
              </div>
            ) : (
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
          </>
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

/** utils */

const inputTypes: { [key in keyof NewStaff]: string } = {
  name: "text",
  occupation: "text",
  username: "text",
  password: "password",
  confirmPassword: "password",
  phoneNumber: "tel",
  email: "email",
};
