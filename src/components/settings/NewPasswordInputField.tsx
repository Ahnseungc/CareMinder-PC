import { FormControl, FormHelperText, InputLabel, TextField } from "@mui/material";
import { useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { NewPassword, NewPassWordField } from "./modal/PasswordChangeModal";

type InputFieldProps = { form: UseFormReturn<NewPassword>; field: NewPassWordField };

export default function NewPasswordField({ field, form }: InputFieldProps) {
  const [validState, setValidState] = useState<{
    confirmPassword?: {
      isValid: boolean;
      message?: string;
    };
  }>({});

  const validationRules = {
    password: {
      required: "비밀번호를 입력해주세요.",
      minLength: { value: 4, message: "비밀번호는 최소 4자 이상이어야 합니다." },
    },
    confirmPassword: {
      required: "비밀번호를 재입력해주세요.",
      validate: (value: string, { password }: NewPassword) => {
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
        return "비밀번호가 올바르지 않습니다. 확인 후 다시 입력해주세요.";
      },
    },
  };
  const { name, label, placeholder } = field;

  const {
    control,
    formState: { errors },
  } = form;

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
          />
        )}
      />
      {errors[name] && <FormHelperText>{errors[name]?.message}</FormHelperText>}

      {validState.confirmPassword?.isValid && name === "confirmPassword" && (
        <FormHelperText sx={{ color: "#1ADE00" }}>
          {validState.confirmPassword.message}
        </FormHelperText>
      )}
    </FormControl>
  );
}

const inputTypes: { [key in keyof NewPassword]: string } = {
  password: "password",
  confirmPassword: "password",
};
