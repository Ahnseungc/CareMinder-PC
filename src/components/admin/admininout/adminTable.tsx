import { Dispatch, FC, SetStateAction } from "react";
import styled from "@emotion/styled";
import palette from "@styles/palette";
import { CComboBox } from "@components/common/atom/C-ComboBox";
import Checkbox from "@mui/material/Checkbox";
import CInput from "@components/common/atom/C-Input";
import { ReactComponent as CheckedIcon } from "@assets/checked-icon.svg";
import { FormControl, SvgIcon } from "@mui/material";
import { WardTabletType } from "@models/ward-tablet";
import { UseFormReturn } from "react-hook-form";

const columns = [
  { id: 0, field: "Section", headerName: "구역" },
  { id: 1, field: "TableName", headerName: "태블릿 이름" },
  { id: 2, field: "PatientName", headerName: "환자 이름" },
];

interface AdminTableProps {
  getTablet: Array<WardTabletType>;
  form: UseFormReturn<WardTabletType>;
  onChangeSelected: (index: any) => void;
}

const AdminTable: FC<AdminTableProps> = ({ getTablet, form, onChangeSelected }) => {
  // const { control } = form;
  return (
    <StTable>
      <thead>
        {columns.map(column => {
          return <th key={column.id}>{column.headerName}</th>;
        })}
      </thead>
      <tbody>
        <FormControl>
          {getTablet?.map(tablet => {
            return (
              <tr>
                <td>
                  <ComBoxLayout>
                    <CComboBox
                      placeholder={"구역"}
                      options={[tablet.areaName]}
                      value={tablet.areaName}
                      onChange={() => null}
                    />
                  </ComBoxLayout>
                </td>
                <td>
                  <ComBoxLayout>
                    <Checkbox
                      checked={true}
                      value={tablet.tabletId}
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
                      placeholder={"태블릿 이름"}
                      onChange={() => null}
                      value={tablet.tabletName}
                      disabled={true}
                      id={""}
                    ></CInput>
                  </ComBoxLayout>
                </td>
                <td>
                  <ComBoxLayout>
                    <CInput
                      variant={"outlined"}
                      placeholder={"환자 이름"}
                      onChange={() => null}
                      value={tablet.patientName}
                      disabled={true}
                      id={""}
                    ></CInput>
                  </ComBoxLayout>
                </td>
              </tr>
            );
          })}
        </FormControl>
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
