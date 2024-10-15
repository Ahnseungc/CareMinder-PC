import { NewWard, NewWardField } from "@models/ward";
import { FormControl, FormHelperText, InputLabel, TextField } from "@mui/material";
import { validateBusinessNumber } from "@utils/signin";
import { Controller, UseFormReturn } from "react-hook-form";

type InputFieldProps = { form: UseFormReturn<NewWard>; field: NewWardField };

export default function NewWardInputField({ field, form }: InputFieldProps) {
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
    </FormControl>
  );
}

/** utils */

const validationRules = {
  wardName: { required: "병동명을 입력해주세요." },
  loginId: { required: "아이디를 입력해주세요." },
  password: {
    required: "비밀번호를 입력해주세요.",
    minLength: { value: 8, message: "비밀번호는 최소 8자 이상이어야 합니다." },
  },
  confirmPassword: {
    required: "비밀번호를 재입력해주세요.",
    validate: (value: string, { password }: NewWard) =>
      value === password || "비밀번호가 일치하지 않습니다.",
  },
  manageName: { required: "담당자 이름을 입력해주세요." },
  managePhoneNumber: {
    required: "전화번호를 입력해주세요.",
    pattern: { value: /^\d{3}-\d{4}-\d{4}$/, message: "올바른 전화번호 형식을 입력해주세요." },
  },
  manageEmail: {
    required: "이메일을 입력해주세요.",
    pattern: {
      value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
      message: "올바른 이메일을 입력해주세요.",
    },
  },
};

const inputTypes: { [key in keyof NewWard]: string } = {
  wardName: "text",
  manageName: "text",
  loginId: "text",
  password: "password",
  confirmPassword: "password",
  managePhoneNumber: "tel",
  manageEmail: "email",
};
