import { useEffect, useState } from "react";
import { FormControl, FormHelperText, InputLabel, TextField } from "@mui/material";
import { Controller, UseFormReturn } from "react-hook-form";
import styled from "@emotion/styled";
import { EditStaff, EditStaffField } from "@models/ward";
import { useRecoilState } from "recoil";
import { staffListState } from "@libraries/recoil";
import useGetStaffDetail from "@hooks/queries/useGetStaffDetail";
import { SwitchCase } from "@toss/react";
import { CComboBox } from "@components/common/atom/C-ComboBox";
import AreaAutoComplete from "./AreaAutoComplete";
import { OPTIONS } from "./const";
import { StaffListType } from "@hooks/queries/useGetStaffList";

type InputFieldProps = {
  form: UseFormReturn<EditStaff>;
  field: EditStaffField;
  staffInfo?: StaffListType;
};

export default function EditStaffInputField({
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
  const [staffInfo, setStaffInfo] = useState<StaffListType | undefined>(initialStaffInfo);

  const selectStaffList = useRecoilState(staffListState);
  const { mutate: getStaffDetail } = useGetStaffDetail();

  const handleGetStaffDetail = () => {
    if (!initialStaffInfo) {
      getStaffDetail(selectStaffList[0][0], {
        onSuccess: data => {
          // console.log(data);
          setStaffInfo({
            staffId: data.staffId,
            name: data.name,
            loginId: data.loginId,
            phoneNumber: data.phoneNumber,
            email: data.email,
            nfc: "",
            fingerprint: "",
            staffRole: data.staffRole,
            areas: data.areas,
            timeSinceLogout: "",
            accountLocked: false,
            isLogIn: false,
          });
          setStaffRole(OPTIONS.find(option => option.role === data.staffRole)?.value as string);
          setEmail(data.email);
        },
      });
    }
  };

  useEffect(() => {
    handleGetStaffDetail();
  }, []);

  useEffect(() => {
    if (staffInfo) {
      // console.log(staffInfo);
      setValue("name", staffInfo.name || "");
      setValue("id", staffInfo.loginId || "");
      setValue("phoneNumber", staffInfo.phoneNumber || "");
      setValue("email", staffInfo.email || "");
      setValue(
        "staffRole",
        OPTIONS.find(option => option.role === staffInfo.staffRole)?.value || OPTIONS[0].value,
      );
      setValue("area", staffInfo.areas?.[0]?.areaId.toString() || "");
    }
  }, [staffInfo, setValue]);

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

  const handleChangeRole = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStaffRole(event.target.value);
    setValue("staffRole", event.target.value);
  };

  const getDisplayValue = (fieldName: keyof EditStaff): string => {
    if (!staffInfo) {
      return "";
    }

    switch (fieldName) {
      case "name":
        return `${staffInfo.name || ""} (기존 이름은 수정 불가)`;
      case "id":
        return `${staffInfo.loginId || ""} (기존 아이디는 수정 불가)`;
      case "phoneNumber":
        return staffInfo.phoneNumber === null
          ? "없음 (기존 전화번호는 수정 불가)"
          : `${staffInfo.phoneNumber} (기존 전화번호는 수정 불가)`;
      case "email":
        return email;
      default:
        return "";
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
              staffRole: (
                <ComboBoxLayout>
                  <CComboBox
                    placeholder={"간호사"}
                    options={OPTIONS.map(option => option.value)}
                    value={staffRole}
                    onChange={handleChangeRole}
                  />
                </ComboBoxLayout>
              ),
              area: <>{staffInfo && <AreaAutoComplete value={staffInfo?.areas} />}</>,
            }}
            defaultComponent={
              <TextField
                {...field}
                id={name}
                value={getDisplayValue(field.name as keyof EditStaff)}
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

const ComboBoxLayout = styled.div`
  height: 56px;
`;
