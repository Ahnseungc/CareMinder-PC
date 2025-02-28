import { Controller, UseFormReturn } from "react-hook-form";
import { EditStaffInfo, EditStaffInfoField } from "./StaffSettingsModal";
import { useCallback, useEffect, useState } from "react";
import { OPTIONS } from "@components/settings/const";
import styled from "@emotion/styled";
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  TextField,
} from "@mui/material";
import { SwitchCase } from "@toss/react";
import AreaAutoComplete from "@components/settings/AreaAutoComplete";
import { CComboBox } from "@components/common/atom/C-ComboBox";
import { GetStaffInfoResponse } from "@hooks/queries/useGetStaffInfo";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

type InputFieldProps = {
  form: UseFormReturn<EditStaffInfo>;
  field: EditStaffInfoField;
  staffInfo: GetStaffInfoResponse;
};

export default function EditStaffInfoInputField({
  field,
  form,
  staffInfo: initialStaffInfo,
}: InputFieldProps) {
  const { name, label, placeholder } = field;
  const {
    control,
    formState: { errors },
    setValue,
  } = form;

  const [staffRole, setStaffRole] = useState<string>(
    OPTIONS.find(option => option.role === initialStaffInfo?.staffRole)?.value || OPTIONS[0].value,
  );
  const [email, setEmail] = useState<string>(initialStaffInfo?.email || "");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [validState, setValidState] = useState<{
    confirmpassword?: {
      isValid: boolean;
      message?: string;
    };
  }>({});

  const validationRules = {
    name: {},
    staffRole: {},
    wardName: {},
    area: {},
    id: {},
    phoneNumber: {},
    password: {
      validate: (value: string | string[]) => {
        if (!value) {
          return true;
        }
        if (value.length < 4) {
          return "비밀번호는 최소 4자 이상이어야 합니다.";
        }
        return true;
      },
    },
    confirmpassword: {
      validate: (value: string | string[], { password }: EditStaffInfo) => {
        if (!password) {
          return true;
        }
        if (value === password) {
          setValidState(prev => ({
            ...prev,
            confirmpassword: {
              isValid: true,
              message: "비밀번호가 올바르게 확인되었습니다.",
            },
          }));
          return true;
        }
        setValidState(prev => ({
          ...prev,
          confirmpassword: undefined,
        }));
        return "비밀번호가 일치하지 않습니다.";
      },
    },
    email: {
      pattern: {
        value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
        message: "이메일 형식이 올바르지 않습니다.",
      },
    },
  };

  useEffect(() => {
    setValue("name", initialStaffInfo.staffName);
    setValue("wardName", initialStaffInfo.waraName);
    setValue("id", initialStaffInfo.loginId);
    setValue("phoneNumber", initialStaffInfo.phoneNumber);
    setValue("email", initialStaffInfo.email);
    setValue(
      "area",
      initialStaffInfo.areas
        .map(area => area.areaId)
        .toString()
        .split(","),
    );
  }, [initialStaffInfo, setValue]);

  const handleChangeRole = (event: React.ChangeEvent<HTMLInputElement>) => {
    const roleValue = event.target.value;
    setStaffRole(roleValue);
    setValue("staffRole", OPTIONS.find(option => option.value === roleValue)?.role as string);
  };

  const setDefaultValue = useCallback(
    (fieldName: keyof EditStaffInfo) => {
      switch (fieldName) {
        case "name":
          return `${initialStaffInfo.staffName} ${t("(기존 이름은 수정 불가)")}`;
        case "wardName":
          return `${initialStaffInfo.waraName} ${t("(기존 소속 병동은 수정 불가)")}`;
        case "id":
          return `${initialStaffInfo.loginId} ${t("(기존 아이디는 수정 불가)")}`;
        case "phoneNumber":
          return `${initialStaffInfo.phoneNumber} ${t("(기존 전화번호는 수정 불가)")}`;
        case "email":
          return email;
        default:
          return "";
      }
    },
    [initialStaffInfo, email],
  );

  const handleClickShowPassword = () => setShowPassword(show => !show);

  const { t } = useTranslation();

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
      <InputLabel
        htmlFor={name}
        required={
          name !== "password" &&
          name !== "confirmpassword" &&
          name !== "phoneNumber" &&
          name !== "email"
        }
      >
        {t(label)}
      </InputLabel>
      <Controller
        name={name}
        control={control}
        rules={validationRules[name]}
        render={({ field }) => (
          <SwitchCase
            value={field.name}
            caseBy={{
              staffRole: (
                <ComboBoxLayout>
                  <CComboBox
                    placeholder={"간호사"}
                    options={OPTIONS.map(option => option.value)}
                    value={staffRole}
                    isStaff={true}
                    onChange={handleChangeRole}
                  />
                </ComboBoxLayout>
              ),
              area: (
                <>
                  {initialStaffInfo && (
                    <AreaAutoComplete value={initialStaffInfo.areas} type="STAFF" />
                  )}
                </>
              ),
            }}
            defaultComponent={
              field.name === "password" || field.name === "confirmpassword" ? (
                <TextField
                  {...field}
                  id={name}
                  placeholder={placeholder}
                  type={showPassword ? "text" : "password"}
                  error={Boolean(errors[name])}
                  onChange={e => {
                    field.onChange(e);
                  }}
                  sx={{
                    "width": "100%",
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: "#30B4FF",
                      },
                    },
                    "& .Mui-focused .MuiInputLabel-root": {
                      color: "#30B4FF",
                    },
                  }}
                  InputProps={{
                    endAdornment:
                      name === "password" || name === "confirmpassword" ? (
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
              ) : (
                <TextField
                  {...field}
                  id={name}
                  value={setDefaultValue(field.name)}
                  placeholder={placeholder}
                  type={"text"}
                  error={Boolean(errors[name])}
                  onChange={e => {
                    if (field.name === "email") {
                      setEmail(e.target.value);
                      setValue("email", e.target.value);
                    }
                  }}
                  disabled={
                    field.name === "name" ||
                    field.name === "wardName" ||
                    field.name === "id" ||
                    field.name === "phoneNumber"
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: "#30B4FF",
                      },
                    },
                    "& .Mui-focused .MuiInputLabel-root": {
                      color: "#30B4FF",
                    },
                  }}
                />
              )
            }
          />
        )}
      />
      {errors[name] && <FormHelperText>{errors[name]?.message}</FormHelperText>}
      {validState.confirmpassword?.isValid && name === "confirmpassword" && (
        <FormHelperText sx={{ color: "#1ADE00" }}>
          {validState.confirmpassword.message}
        </FormHelperText>
      )}
    </FormControl>
  );
}

const ComboBoxLayout = styled.div`
  height: 56px;
`;
