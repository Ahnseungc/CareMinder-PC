import { FC } from "react";
import styled from "@emotion/styled";
import palette from "@styles/palette";
import { CComboBox } from "@components/common/atom/C-ComboBox";
import Checkbox from "@mui/material/Checkbox";
import CInput from "@components/common/atom/C-Input";
import { ReactComponent as CheckedIcon } from "@assets/checked-icon.svg";
import { SvgIcon } from "@mui/material";

const columns = [
  { field: "Section", headerName: "구역" },
  { field: "TableName", headerName: "태블릿 이름" },
  { field: "PatientName", headerName: "환자 이름" },
];

const rows = [
  { id: 1, Section: "Snow", TableName: "Jon", PatientName: 35 },
  { id: 1, Section: "Snow", TableName: "Jon", PatientName: 35 },
  { id: 1, Section: "Snow", TableName: "Jon", PatientName: 35 },
  { id: 1, Section: "Snow", TableName: "Jon", PatientName: 35 },
  { id: 1, Section: "Snow", TableName: "Jon", PatientName: 35 },
  { id: 1, Section: "Snow", TableName: "Jon", PatientName: 35 },
  { id: 1, Section: "Snow", TableName: "Jon", PatientName: 35 },
  { id: 1, Section: "Snow", TableName: "Jon", PatientName: 35 },
  { id: 1, Section: "Snow", TableName: "Jon", PatientName: 35 },
  { id: 1, Section: "Snow", TableName: "Jon", PatientName: 35 },
];

const AdminTable: FC = () => {
  return (
    <StTable>
      <thead>
        {columns.map(column => {
          return <th>{column.headerName}</th>;
        })}
      </thead>
      <tbody>
        {rows.map(row => {
          return (
            <tr>
              <td>
                <ComBoxLayout>
                  <CComboBox
                    placeholder={"구역"}
                    options={["테스트1", "테스트2"]}
                    value={""}
                    onChange={() => null}
                  />
                </ComBoxLayout>
              </td>
              <td>
                <ComBoxLayout>
                  <Checkbox
                    icon={
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          border: `1px solid ${palette.divider}`,
                          borderRadius: "4px",
                        }}
                      />
                    }
                    checkedIcon={
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          backgroundColor: `${palette.primary.main}`,
                          borderRadius: "4px",
                          position: "relative",
                        }}
                      >
                        <SvgIcon
                          component={CheckedIcon}
                          inheritViewBox
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            width: "15px",
                            height: "12px",
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                          }}
                        />
                      </div>
                    }
                    sx={{
                      padding: 0, // 기본 패딩 제거
                      width: "20px",
                      height: "20px",
                    }}
                  />
                  <CInput
                    variant={"outlined"}
                    placeholder={"이름"}
                    onChange={() => null}
                    value={""}
                    disabled={false}
                    id={""}
                  ></CInput>
                </ComBoxLayout>
              </td>
              <td>
                <ComBoxLayout>
                  <CInput
                    variant={"outlined"}
                    placeholder={"태블릿 이름"}
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

export default AdminTable;

const StTable = styled.table`
  width: 100%;
  height: 100%;

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
  width: 224px;
  height: 36px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 13px;
`;
