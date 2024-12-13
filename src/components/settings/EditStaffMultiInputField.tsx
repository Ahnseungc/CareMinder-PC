import { FormControl, FormHelperText, InputLabel } from "@mui/material";
import { Controller, UseFormReturn } from "react-hook-form";
import { SwitchCase } from "@toss/react";
import { CComboBox } from "@components/common/atom/C-ComboBox";
import { OPTIONS } from "./const";
import styled from "@emotion/styled";
import AreaAutoComplete from "./AreaAutoComplete";
import { useEffect, useState } from "react";
import { EditMultiStaff, EditMultiStaffField } from "@models/ward";
import { useGetAreaList } from "@hooks/queries/useGetAreaList";
import { Areas } from "@hooks/queries/useGetStaffList";

type InputFieldProps = {
  form: UseFormReturn<EditMultiStaff>;
  field: EditMultiStaffField;
};

export default function EditStaffMultiField({ field, form }: InputFieldProps) {
  const { data: areaList } = useGetAreaList();
  const [areaData, setAreaData] = useState<Areas[]>();

  useEffect(() => {
    if (areaList) {
      const transformedAreas: Areas[] = areaList.map(area => ({
        areaId: area.id,
        areaName: area.name,
      }));
      setAreaData(transformedAreas);
    }
  }, [areaList]);

  const { name, label } = field;

  const {
    control,
    formState: { errors },
    setValue,
  } = form;

  const [staffRole, setStaffRole] = useState<string>("");

  const validationRules = {
    staffRole: {},
    area: {},
  };

  const handleChangeRole = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStaffRole(event.target.value);
    setValue("staffRole", event.target.value);
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
              area: <>{areaData && <AreaAutoComplete value={areaData} />}</>,
            }}
            defaultComponent={<></>}
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
