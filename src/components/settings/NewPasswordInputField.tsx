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
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { NewPassword, NewPassWordField } from "@models/ward";

type InputFieldProps = { form: UseFormReturn<NewPassword>; field: NewPassWordField };

export default function NewPasswordField({ field, form }: InputFieldProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [validState, setValidState] = useState<{
    confirmPassword?: {
      isValid: boolean;
      message?: string;
    };
  }>({});

  const handleClickShowPassword = () => setShowPassword(show => !show);

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
      <Controller
        name={name}
        control={control}
        rules={validationRules[name]}
        render={({ field }) => (
          <TextField
            {...field}
            id={name}
            placeholder={placeholder}
            type={showPassword ? "text" : inputTypes[name]}
            error={Boolean(errors[name])}
            onChange={e => {
              field.onChange(e);

              if (name === "confirmPassword" && !e.target.value) {
                setValidState(prev => ({
                  ...prev,
                  confirmPassword: undefined,
                }));
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
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
