import { FormControl, FormHelperText, InputLabel, TextField } from "@mui/material";
import { Controller, UseFormReturn } from "react-hook-form";
import { EditStaff, EditStaffField } from "./modal/PasswordChangeModal";
import { StaffListType } from "@hooks/queries/useGetStaffList";
import { SwitchCase } from "@toss/react";

type InputFieldProps = {
  form: UseFormReturn<EditStaff>;
  field: EditStaffField;
  staffInfo: StaffListType;
};

export default function NewPasswordField({ field, form, staffInfo }: InputFieldProps) {
  const validationRules = {
    name: {},
    staffRole: {},
    area: {},
    id: {},
    phoneNumber: {},
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
      <InputLabel htmlFor={name} required={name !== "email"}>
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
              staffRole: <div>직업 드롭다운</div>,
              area: <div>구역 드롭다운</div>,
            }}
            defaultComponent={
              <TextField
                {...field}
                id={name}
                value={
                  field.name === "name"
                    ? staffInfo.name + " (기존 이름은 수정 불가)"
                    : field.name === "id"
                      ? staffInfo.loginId + " (기존 아이디는 수정 불가)"
                      : field.name === "phoneNumber"
                        ? staffInfo.phoneNumber + " (기존 전화번호는 수정 불가)"
                        : field.name === "email"
                          ? staffInfo.email
                          : ""
                }
                placeholder={placeholder}
                type={"text"}
                error={Boolean(errors[name])}
                disabled={
                  field.name === "name" || field.name === "id" || field.name === "phoneNumber"
                }
              />
            }
          />
        )}
      />
      {errors[name] && <FormHelperText>{errors[name]?.message}</FormHelperText>}
    </FormControl>
  );
}
