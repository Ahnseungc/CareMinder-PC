import CButton from "@components/common/atom/C-Button";
import { doubleCheckState, wardNameCheckState } from "@libraries/recoil/idDoubleCheck";
import { NewWard, NewWardField } from "@models/ward";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import axios from "axios";
import { SEVER_URL } from "@constants/baseUrl";

type InputFieldProps = { form: UseFormReturn<NewWard>; field: NewWardField };

export default function NewWardInputField({ field, form }: InputFieldProps) {
  const { name, label, placeholder } = field;
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const setDoubleCheck = useSetRecoilState(doubleCheckState);
  const setWardNameDoubleCheck = useSetRecoilState(wardNameCheckState);
  const handleClickShowPassword = () => setShowPassword(show => !show);
  const [validState, setValidState] = useState<{
    wardName?: {
      isValid: boolean;
      message?: string;
    };
    loginId?: {
      isValid: boolean;
      message?: string;
    };
    confirmPassword?: {
      isValid: boolean;
      message?: string;
    };
  }>({});

  const validationRules = {
    wardName: { required: "병동명을 입력해주세요." },
    loginId: { required: "아이디를 입력해주세요." },
    password: {
      required: "비밀번호를 입력해주세요.",
      minLength: {
        value: 4,
        message: "비밀번호 형식이 올바르지 않습니다. 확인 후 다시 입력해 주세요.",
      },
    },
    confirmPassword: {
      required: "비밀번호를 재입력해주세요.",
      validate: (value: string, { password }: NewWard) => {
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
    managerName: { required: "담당자 이름을 입력해주세요." },
    managerPhoneNumber: {
      required: "전화번호를 입력해주세요.",
      pattern: { value: /^\d{3}-\d{4}-\d{4}$/, message: "올바른 전화번호 형식을 입력해주세요." },
    },
    managerEmail: {
      required: "이메일을 입력해주세요.",
      pattern: {
        value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
        message: "올바른 이메일을 입력해주세요.",
      },
    },
  };

  const {
    control,
    formState: { errors },
    getValues,
  } = form;

  /** 병돔명 중복 체크 로직 */
  const doubleCheckWardName = async () => {
    const wardName = getValues("wardName");
    if (!wardName) {
      form.setError("wardName", {
        type: "manual",
        message: "병동명을 입력해주세요.",
      });
      return;
    } else {
      try {
        const doubleCheckWardName = {
          wardName: wardName,
        };
        const res = await axios.post(`${SEVER_URL}/wards/check-ward-name`, doubleCheckWardName);
        if (res.data === "사용 가능한 병동명입니다.") {
          setWardNameDoubleCheck(true);
          form.clearErrors("wardName");
          setValidState({
            wardName: {
              isValid: true,
              message: "사용 가능한 병동명입니다.",
            },
          });
        }
      } catch (err) {
        console.log(err);
        if (axios.isAxiosError(err) && err.response) {
          console.error(err.response?.status);
          if (err.response.status === 409) {
            form.setError("wardName", {
              type: "manual",
              message: "이미 사용중인 병동명입니다.",
            });
            setValidState(prev => ({ ...prev, wardName: undefined }));
          }
        }
      }
    }
  };

  /** 병동 아이디 중복 체크 로직 */
  const doubleCheck = async () => {
    const username = getValues("loginId");
    if (!username) {
      form.setError("loginId", {
        type: "manual",
        message: "아이디를 입력해주세요.",
      });
      return;
    } else {
      try {
        const doubleCheck = {
          loginId: username,
          accountType: "WARD",
        };
        const res = await axios.post(`${SEVER_URL}/users/check-login-id`, doubleCheck);
        if (res.data === "사용 가능한 아이디입니다.") {
          setDoubleCheck(true);
          form.clearErrors("loginId");
          setValidState({
            loginId: {
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
            form.setError("loginId", {
              type: "manual",
              message: "이미 사용중인 아이디입니다.",
            });
            setValidState(prev => ({ ...prev, loginId: undefined }));
          }
        }
      }
    }
  };

  return (
    <FormControl
      key={name}
      error={Boolean(errors[name])}
      sx={{
        "gap": "3px",
        "& .MuiInputLabel-asterisk": {
          color: "#FF7253 !important",
        },
      }}
    >
      <InputLabel htmlFor={name} required>
        {label}
      </InputLabel>
      <span style={{ position: "absolute", right: "0", fontSize: "10px" }}>
        {label === "비밀번호" ? "4자 이상의 영문(대/소문자)또는 숫자" : ""}
      </span>
      <Controller
        name={name}
        control={control}
        rules={validationRules[name]}
        render={({ field }) => (
          <div style={{ position: "relative" }}>
            {field.name === "wardName" ? (
              <>
                <TextField
                  {...field}
                  id={name}
                  placeholder={placeholder}
                  type={inputTypes[name] || "text"}
                  error={Boolean(errors[name])}
                  onChange={e => {
                    field.onChange(e);
                    setWardNameDoubleCheck(false);
                    setValidState(prev => ({ ...prev, wardName: undefined }));
                  }}
                  sx={{ width: "70%" }}
                />
                <div
                  style={{
                    width: "110px",
                    cursor: "pointer",
                    position: "absolute",
                    top: 0,
                    right: 0,
                  }}
                >
                  <CButton
                    buttontype="primarySpaureWhite"
                    sx={{
                      height: "56px",
                      border: "1px solid #5DB8BE",
                      color: "#5DB8BE",
                    }}
                    onClick={doubleCheckWardName}
                  >
                    중복 확인
                  </CButton>
                </div>
              </>
            ) : field.name === "loginId" ? (
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
                    setValidState(prev => ({ ...prev, loginId: undefined }));
                  }}
                  sx={{ width: "70%" }}
                />
                <div
                  style={{
                    width: "110px",
                    cursor: "pointer",
                    position: "absolute",
                    top: 0,
                    right: 0,
                  }}
                >
                  <CButton
                    buttontype="primarySpaureWhite"
                    sx={{
                      height: "56px",
                      border: "1px solid #5DB8BE",
                      color: "#5DB8BE",
                    }}
                    onClick={doubleCheck}
                  >
                    중복 확인
                  </CButton>
                </div>
              </>
            ) : (
              <TextField
                {...field}
                id={name}
                placeholder={placeholder}
                type={showPassword ? "text" : inputTypes[name]}
                error={Boolean(errors[name])}
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
      {validState.loginId?.isValid && name === "loginId" && (
        <FormHelperText sx={{ color: "#1ADE00" }}>{validState.loginId.message}</FormHelperText>
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

const inputTypes: { [key in keyof NewWard]: string } = {
  wardName: "text",
  managerName: "text",
  loginId: "text",
  password: "password",
  confirmPassword: "password",
  managerPhoneNumber: "tel",
  managerEmail: "email",
};
