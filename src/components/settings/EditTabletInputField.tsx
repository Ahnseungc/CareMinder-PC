import { Controller, UseFormReturn } from "react-hook-form";
import { EditTablet, EditTabletField } from "./modal/EditTabletInfoModal";
import { Box, FormControl, FormHelperText, InputLabel, styled, TextField } from "@mui/material";
import { useGetAreaList, useGetStaffAreaList } from "@hooks/queries/useGetAreaList";
import { CComboBox } from "@components/common/atom/C-ComboBox";
import { useEffect, useState } from "react";
import { WardTabledListType } from "@hooks/queries/useGetWardTabletList";

type InputFieldProps = {
  form: UseFormReturn<EditTablet>;
  field: EditTabletField;
  tabletData: WardTabledListType | null;
};

export default function EditTabletInputField({ field, form, tabletData }: InputFieldProps) {
  // const { data: areaList } = useGetAreaList();
  const { data: areaList } = useGetStaffAreaList();

  const [area, setArea] = useState<string>(tabletData ? tabletData.areaName : "");
  const [patientName, setPatientName] = useState<string>(tabletData ? tabletData.patientName : "");
  const [tabletName, setTabletName] = useState<string>(tabletData ? tabletData.tabletName : "");

  const { name, label, placeholder } = field;

  const {
    control,
    formState: { errors },
    setValue,
  } = form;

  useEffect(() => {
    if (!tabletData) {
      return;
    }

    setValue("area", areaList?.find(area => area.name === tabletData.areaName)?.id as number);
    setValue("patientName", tabletData.patientName);
    setValue("tabletName", tabletData.tabletName);
  }, []);

  const validationRules = {
    area: { required: "구역을 선택해주세요" },
    patientName: { required: "정보가 입력되지 않았습니다." },
    tabletName: { required: "정보가 입력되지 않았습니다." },
  };

  if (!areaList) {
    return;
  }

  const handleChangeArea = (event: React.ChangeEvent<HTMLInputElement>) => {
    setArea(event.target.value);
    setValue("area", areaList.find(area => area.name === event.target.value)?.id as number);
  };

  const handleChangeName = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldName: string,
  ) => {
    if (fieldName === "patientName") {
      setPatientName(event.target.value);
      setValue("patientName", event.target.value);
    } else {
      setTabletName(event.target.value);
      setValue("tabletName", event.target.value);
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
      <Controller
        name={name}
        control={control}
        rules={validationRules[name]}
        render={({ field }) => (
          <>
            {field.name === "area" ? (
              <CComboBoxLayout>
                <CComboBox
                  placeholder="구역 정보를 입력하세요"
                  options={areaList.map(area => area.name)}
                  value={area}
                  onChange={handleChangeArea}
                />
              </CComboBoxLayout>
            ) : (
              <TextField
                {...field}
                id={name}
                placeholder={placeholder}
                value={field.name === "patientName" ? patientName : tabletName}
                onChange={e => handleChangeName(e, field.name)}
                error={Boolean(errors[name])}
              />
            )}
          </>
        )}
      />
      {errors[name] && <FormHelperText>{errors[name]?.message}</FormHelperText>}
    </FormControl>
  );
}

const CComboBoxLayout = styled(Box)({
  height: "56px",
});
