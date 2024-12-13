import CButton from "@components/common/atom/C-Button";
import { CComboBox } from "@components/common/atom/C-ComboBox";
import doubleCheckState from "@libraries/recoil/staff";
import { NewStaff, NewStaffField } from "@models/staff";
import {
  Autocomplete,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  TextField,
} from "@mui/material";
import axios from "axios";
import { SEVER_URL } from "@constants/baseUrl";
import { useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useGetAreaList } from "@hooks/queries/useGetAreaList";

type InputFieldProps = { form: UseFormReturn<NewStaff>; field: NewStaffField };

const options = [
  { label: "DOCTOR", value: "의사" },
  { label: "NURSE", value: "간호사" },
  { label: "NURSE_ASSISTANT", value: "조무사" },
  { label: "WORKER", value: "직원" },
];

export default function NewStaffInputField({ field, form }: InputFieldProps) {
  const { data: areaList } = useGetAreaList();

  const setDoubleCheck = useSetRecoilState(doubleCheckState);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [option, setOption] = useState<string>("");
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
    areaName: {},
    username: { required: "아이디를 입력해주세요." },
    password: {
      required: "비밀번호를 입력해주세요.",
      minLength: { value: 4, message: "비밀번호는 최소 4자 이상이어야 합니다." },
      pattern: {
        value: /^[A-Za-z0-9]{4,}$/,
        message: "비밀번호 형식이 올바르지 않습니다. 확인 후 다시 입력해 주세요.",
      },
    },
    confirmPassword: {
      required: "비밀번호를 재입력해주세요.",
      validate: (value: string | string[], { password }: NewStaff) => {
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
        return "비밀번호가 일치하지 않습니다. 확인 후 다시 입력해 주세요.";
      },
    },
    confirmPhoneNumber: {
      required: "인증번호를 입력해주세요.",
    },
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
    setValue,
    getValues,
  } = form;

  const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    setOption(value);
    setValue("occupation", options.filter(option => option.value === value)[0].label);
  };
  //@ts-ignore
  const handleAreaChange = (event: React.SyntheticEvent, newValue: typeof areaList) => {
    console.log("Selected areas:", newValue);
    if (!newValue) {
      return;
    }
    setValue(
      "areaName",
      newValue?.map(value => value.name),
    );
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
        if (axios.isAxiosError(err) && err.response) {
          console.error(err.response?.status);
          if (err.response.status === 409) {
            form.setError("username", {
              type: "manual",
              message: "입력하신 아이디가 이미 사용중입니다.",
            });
            setValidState(prev => ({ ...prev, username: undefined }));
          }
        }
      }
    }
  };

  const handleClickShowPassword = () => setShowPassword(show => !show);

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
      <InputLabel htmlFor={name} required={name !== "email"} sx={{ position: "relative" }}>
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
            {field.name === "occupation" ? (
              <div style={{ height: "56px" }}>
                <CComboBox
                  placeholder={"직종을 선택해주세요."}
                  options={options.map(option => option.value)}
                  value={option}
                  onChange={handleRoleChange}
                />
              </div>
            ) : field.name === "areaName" ? (
              <div>
                {areaList && (
                  <Autocomplete
                    multiple
                    limitTags={2}
                    id="multiple-limit-tags"
                    options={areaList}
                    onChange={handleAreaChange}
                    getOptionLabel={option => option.name}
                    renderInput={params => (
                      <TextField
                        {...params}
                        placeholder="구역을 선택해주세요."
                        error={Boolean(errors[name])}
                      />
                    )}
                  />
                )}
              </div>
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
                    setDoubleCheck(false); // 값이 변경되면 doubleCheck 상태를 false로
                    setValidState(prev => ({ ...prev, username: undefined })); // 성공 메시지도 제거
                  }}
                  sx={{ width: "65%" }}
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
                onChange={e => {
                  field.onChange(e);
                }}
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
  );
}

/** style */

const inputTypes: { [key in keyof NewStaff]: string } = {
  name: "text",
  occupation: "text",
  areaName: "text",
  username: "text",
  password: "password",
  confirmPassword: "password",
  email: "email",
};
