import { FC, useState } from "react";
import styled from "@emotion/styled";
import palette from "@styles/palette";
import { CComboBox } from "@components/common/atom/C-ComboBox";
import CInput from "@components/common/atom/C-Input";

import { ReactComponent as Leave } from "@/assets/Leave.svg";
import { ReactComponent as Sleep } from "@/assets/sleep.svg";
import { Checkbox, Typography } from "@mui/material";

const columns = [
  { field: "check", headerName: "" },
  { field: "Section", headerName: "구역" },
  { field: "TabletName", headerName: "태블릿 이름" },
  { field: "identificationNum", headerName: "식별번호" },
  { field: "PatientName", headerName: "환자이름" },
];

const rows = [
  { id: 1, Section: "Snow", TableName: "Jon", PatientName: 35 },
  { id: 2, Section: "Snow", TableName: "Jon", PatientName: 35 },
  { id: 3, Section: "Snow", TableName: "Jon", PatientName: 35 },
  { id: 4, Section: "Snow", TableName: "Jon", PatientName: 35 },
  { id: 5, Section: "Snow", TableName: "Jon", PatientName: 35 },
  { id: 6, Section: "Snow", TableName: "Jon", PatientName: 35 },
  { id: 7, Section: "Snow", TableName: "Jon", PatientName: 35 },
  { id: 8, Section: "Snow", TableName: "Jon", PatientName: 35 },
  { id: 9, Section: "Snow", TableName: "Jon", PatientName: 35 },
];

const TabletManagementTable: FC = () => {
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const [options, setOptions] = useState<string[]>(["구역1", "구역2", "구역3", "구역4"]);
  const [selectIndex, setSelectIndex] = useState<number[]>([]);

  const handleSelectAll = () => {
    if (selectIndex.length === rows.length) {
      setSelectIndex([]);
    } else {
      setSelectIndex(rows.map((_, index) => index));
    }
  };

  return (
    <StTable>
      <thead>
        <tr>
          {columns.map((column, index) => {
            if (column.field === "check") {
              return (
                <th key={index}>
                  <Checkbox
                    {...label}
                    sx={{
                      "&.MuiCheckbox-root": {
                        color: "#ECECEC",
                      },
                      "& .MuiSvgIcon-root": {
                        fontSize: 28,
                      },
                      "&.Mui-checked": {
                        "& .MuiSvgIcon-root": {
                          fill: "#B4C0FF",
                        },
                      },
                    }}
                    checked={selectIndex.length === rows.length}
                    indeterminate={selectIndex.length > 0 && selectIndex.length < rows.length}
                    onClick={handleSelectAll}
                  />
                </th>
              );
            }
            return <th key={index}>{column.headerName}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => {
          return (
            <tr
              key={index}
              style={{ backgroundColor: `${selectIndex.includes(index) ? "#EFF0F8" : "white"}` }}
            >
              <td>
                <ComBoxLayout>
                  <Checkbox
                    {...label}
                    sx={{
                      "&.MuiCheckbox-root": {
                        color: "#ECECEC",
                      },
                      "& .MuiSvgIcon-root": {
                        fontSize: 28,
                      },
                      "&.Mui-checked": {
                        "& .MuiSvgIcon-root": {
                          fill: "#B4C0FF",
                        },
                      },
                    }}
                    checked={selectIndex.includes(index)}
                    onClick={() => {
                      setSelectIndex(prevList => {
                        if (prevList.includes(index)) {
                          return prevList.filter(item => item !== index);
                        } else {
                          return [...prevList, index];
                        }
                      });
                    }}
                  />
                </ComBoxLayout>
              </td>

              <td>
                <ComBoxLayout>
                  <CComboBox
                    placeholder={"구역"}
                    options={options}
                    value={""}
                    onChange={() => null}
                    allowCustomInput={true}
                    onCustomInputAdd={newValue => {
                      setOptions([...options, newValue]);
                    }}
                  />
                </ComBoxLayout>
              </td>
              <td>
                <ComBoxLayout>
                  <CInput
                    variant={"outlined"}
                    placeholder={"태블릿이름"}
                    onChange={() => null}
                    value={""}
                    disabled={false}
                    id={""}
                  ></CInput>
                  <TabletButtonLayout>
                    <Leave />
                    <Sleep />
                  </TabletButtonLayout>
                </ComBoxLayout>
              </td>
              <td>
                <ComBoxLayout>
                  <Typography>식별번호</Typography>
                </ComBoxLayout>
              </td>
              <td>
                <ComBoxLayout>
                  <CInput
                    variant={"outlined"}
                    placeholder={"환자 이름"}
                    onChange={() => null}
                    value={""}
                    disabled={false}
                    id={""}
                  ></CInput>
                </ComBoxLayout>
              </td>
            </tr>
          );
        })}
      </tbody>
    </StTable>
  );
};

export default TabletManagementTable;

const StTable = styled.table`
  width: 100%;
  height: 100%;
  border-collapse: collapse;
  & thead {
    width: 100%;
    height: 20%;
    & th {
      padding-bottom: 11.52px;
      color: ${palette.text.primary};
      border-bottom: 1px solid ${palette.divider};
    }
  }
  & tbody {
    width: 100%;
    & tr > td {
      padding-bottom: 11.52px;
      padding-top: 11.52px;
      text-align: center;
      border-bottom: 1px solid ${palette.divider};
    }
  }
`;

const ComBoxLayout = styled.div`
  position: relative;
  width: 224px;
  height: 36px;
  margin: 0 auto;
`;

const TabletButtonLayout = styled.div`
  position: absolute;
  top: 4px;
  right: -70px;

  display: flex;
  gap: 5px;
`;
