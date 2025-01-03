import CButton from "@components/common/atom/C-Button";
import { WardListType } from "@hooks/queries/useGetWardList";
import { EditWard, EditWardField } from "@models/admin";
import { FormControl, FormHelperText, InputLabel, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import axios from "axios";
import { SEVER_URL } from "@constants/baseUrl";
import Cookies from "js-cookie";
import { useSetRecoilState } from "recoil";
import { wardNameCheckState } from "@libraries/recoil/idDoubleCheck";

type InputFieldProps = {
  form: UseFormReturn<EditWard>;
  field: EditWardField;
  wardData: WardListType;
};

export default function EditWardInfoField({ field, form, wardData }: InputFieldProps) {
  const [newWardName, setNewWardName] = useState<string>(wardData.wardName);
  const [newManagerName, setNewManagerName] = useState<string>(wardData.managerName || "");
  const [newManagerEmail, setNewManagerEmial] = useState<string>(wardData.managerEmail);
  const setWardNameDoubleCheck = useSetRecoilState(wardNameCheckState);

  const [validState, setValidState] = useState<{
    wardName?: {
      isValid: boolean;
      message?: string;
    };
  }>({});

  const { name, label, placeholder } = field;

  const {
    control,
    formState: { errors },
    setValue,
    getValues,
  } = form;

  useEffect(() => {
    setValue("wardname", wardData.wardName);
    setValue("id", wardData.loginId);
    setValue("managerName", wardData.managerName || "");
    setValue("managerEmail", wardData.managerEmail);
  }, []);

  const validationRules = {
    wardname: { required: "병동명을 입력해주세요." },
    id: { required: "아이디를 입력해주세요." },
    managerName: { required: "담당자 이름을 입력해주세요." },
    managerEmail: {
      pattern: {
        value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
        message: "이메일 형식이 올바르지 않습니다.",
      },
    },
  };

  /** 병돔명 중복 체크 로직 */
  const doubleCheckWardName = async () => {
    const wardName = getValues("wardname");
    if (!wardName) {
      form.setError("wardname", {
        type: "manual",
        message: "병동명을 입력해주세요.",
      });
      return;
    } else {
      try {
        setWardNameDoubleCheck(true);
        const res = await axios.get(`${SEVER_URL}/wards/check-ward-name`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessTokenAdmin")}`,
          },
          params: {
            wardName: wardName,
          },
        });
        if (res.data === "사용 가능한 병동 이름 입니다.") {
          setWardNameDoubleCheck(true);
          form.clearErrors("wardname");
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
            form.setError("wardname", {
              type: "manual",
              message: "이미 사용중인 병동명입니다.",
            });
            setValidState(prev => ({ ...prev, wardName: undefined }));
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
      <InputLabel htmlFor={name} required={name !== "managerEmail"}>
        {label}
      </InputLabel>
      <Controller
        name={name}
        control={control}
        rules={validationRules[name]}
        render={({ field }) => (
          <div style={{ position: "relative" }}>
            {field.name === "wardname" ? (
              <>
                <TextField
                  {...field}
                  id={name}
                  placeholder={placeholder}
                  type={inputTypes[name] || "text"}
                  value={newWardName}
                  error={Boolean(errors[name])}
                  onChange={e => {
                    field.onChange(e);
                    setNewWardName(e.target.value);
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
                      border: "1px solid #5DB8BE",
                      color: "#5DB8BE",
                    }}
                    onClick={doubleCheckWardName}
                    disabled={wardData.wardName === newWardName}
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
                type={inputTypes[name]}
                error={Boolean(errors[name])}
                disabled={name === "id"}
                value={
                  name === "id"
                    ? `${wardData.loginId} (기존 아이디는 수정 불가)`
                    : name === "managerName"
                      ? newManagerName
                      : newManagerEmail
                }
                onChange={e => {
                  field.onChange(e);
                  if (name === "managerName") {
                    setNewManagerName(e.target.value);
                  } else {
                    setNewManagerEmial(e.target.value);
                  }
                }}
                sx={{ width: "100%" }}
              />
            )}
          </div>
        )}
      />
      {errors[name] && <FormHelperText>{errors[name]?.message}</FormHelperText>}
      {validState.wardName?.isValid && name === "wardname" && (
        <FormHelperText sx={{ color: "#1ADE00" }}>{validState.wardName.message}</FormHelperText>
      )}
    </FormControl>
  );
}

/** utils */
const inputTypes: { [key in keyof EditWard]: string } = {
  wardname: "text",
  id: "text",
  managerName: "text",
  managerEmail: "email",
};
