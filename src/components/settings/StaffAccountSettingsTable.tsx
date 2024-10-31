import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import palette from "@styles/palette";
import { CComboBox } from "@components/common/atom/C-ComboBox";
import CInput from "@components/common/atom/C-Input";
import { Checkbox, Typography } from "@mui/material";

import { ReactComponent as Edit } from "@/assets/accountEdit.svg";
import { ReactComponent as Lock } from "@/assets/completedRequests/Interface essential/Lock.svg";
import { ReactComponent as UnLock } from "@/assets/completedRequests/Interface essential/Unlock.svg";
import { ReactComponent as Delete } from "@/assets/completedRequests/accountDelete.svg";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { editingState } from "@libraries/recoil";
import { GetStaffListResponse } from "@hooks/queries/useGetStaffList";
import { GetAreaListResponse } from "@hooks/queries/useGetAreaList";
import useCreateArea from "@hooks/mutation/useCreateArea";

const columns = [
  { field: "check", headerName: "" },
  { field: "StaffName", headerName: "스태프 이름" },
  { field: "Occupation", headerName: "직업" },
  { field: "Section", headerName: "구역" },
  { field: "LoginId", headerName: "아이디" },
  { field: "Phone", headerName: "전화번호" },
  { field: "Email", headerName: "이메일" },
  { field: "AccountStatus", headerName: "계정상태" },
  { field: "AccountManage", headerName: "계정관리" },
];

const rows = [
  { id: 1, Section: "Snow", TableName: "Jon", PatientName: 35, isLock: true },
  { id: 2, Section: "Snow", TableName: "Jon", PatientName: 35, isLock: false },
  { id: 3, Section: "Snow", TableName: "Jon", PatientName: 35, isLock: true },
  { id: 4, Section: "Snow", TableName: "Jon", PatientName: 35, isLock: true },
  { id: 5, Section: "Snow", TableName: "Jon", PatientName: 35, isLock: false },
  { id: 6, Section: "Snow", TableName: "Jon", PatientName: 35, isLock: false },
  { id: 7, Section: "Snow", TableName: "Jon", PatientName: 35, isLock: true },
  { id: 8, Section: "Snow", TableName: "Jon", PatientName: 35, isLock: true },
  { id: 9, Section: "Snow", TableName: "Jon", PatientName: 35, isLock: false },
];

interface StaffAccountSettingsTableProps {
  onManage: (modalType: string) => void;
  isClear: boolean;
  setIsClear: React.Dispatch<React.SetStateAction<boolean>>;
  staffLists: GetStaffListResponse;
  areaLists: GetAreaListResponse[];
}

/**계정 상태 테스트 변수 */
const isConnecting = true;

const StaffAccountSettingsTable = ({
  onManage,
  isClear,
  setIsClear,
  staffLists,
  areaLists,
}: StaffAccountSettingsTableProps) => {
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const [option, setOption] = useState<string>();
  const [options, setOptions] = useState<string[]>([]);
  const [selectIndex, setSelectIndex] = useState<number[]>([]);
  const setIsEditing = useSetRecoilState(editingState);
  const isEditing = useRecoilValue(editingState);

  const { mutate: createArea } = useCreateArea();

  useEffect(() => {
    if (selectIndex.length === 0) {
      setIsEditing([]);
    } else {
      setIsEditing(selectIndex);
    }
  }, [selectIndex, setIsEditing]);

  useEffect(() => {
    if (isClear) {
      setIsClear(false);
      setSelectIndex([]);
    }
  }, [isEditing, isClear, setIsClear]);

  useEffect(() => {
    if (areaLists) {
      setOptions(areaLists.map(item => item.name));
    }
  }, [areaLists]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setOption(value);
  };

  const handleCreateArea = (newValue: string) => {
    const areaData = {
      name: newValue,
      wardId: 1,
    };
    createArea(areaData);
  };

  return (
    <StTable>
      <thead>
        <tr>
          {columns.map((column, index) => {
            return <th key={index}>{column.headerName}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => {
          return (
            <tr
              key={index}
              style={{
                backgroundColor: `${selectIndex.includes(index) ? "#EFF0F8" : "white"}`,
                opacity: `${row.isLock ? 0.5 : 1}`,
              }}
            >
              <td>
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
              </td>
              <td>
                <ShortComBoxLayout>
                  <CInput
                    variant={"outlined"}
                    placeholder={"스태프"}
                    onChange={() => null}
                    value={"홍길동"}
                    disabled={row.isLock}
                    id={""}
                  ></CInput>
                </ShortComBoxLayout>
              </td>
              <td>
                <ShortComBoxLayout>
                  <CComboBox
                    placeholder={"간호사"}
                    options={["간호사", "의사", "조무사", "직원"]}
                    value={""}
                    disabled={row.isLock}
                    onChange={() => null}
                  />
                </ShortComBoxLayout>
              </td>
              <td>
                <LongComBoxLayout>
                  <CComboBox
                    placeholder={"구역"}
                    options={options}
                    value={option as string}
                    disabled={row.isLock}
                    onChange={handleChange}
                    allowCustomInput={true}
                    onCustomInputAdd={handleCreateArea}
                  />
                </LongComBoxLayout>
              </td>
              <td>
                <LongComBoxLayout>
                  <CInput
                    variant={"outlined"}
                    placeholder={"아이디"}
                    onChange={() => null}
                    value={"User1234"}
                    disabled={row.isLock}
                    id={""}
                  ></CInput>
                </LongComBoxLayout>
              </td>
              <td>
                <LongComBoxLayout>
                  <CInput
                    variant={"outlined"}
                    placeholder={"전화번호"}
                    onChange={() => null}
                    value={"010-0000-0000"}
                    disabled={row.isLock}
                    id={""}
                  ></CInput>
                </LongComBoxLayout>
              </td>
              <td>
                <LongComBoxLayout>
                  <CInput
                    variant={"outlined"}
                    placeholder={"이메일"}
                    onChange={() => null}
                    value={"User1234@naver.com"}
                    disabled={row.isLock}
                    id={""}
                  ></CInput>
                </LongComBoxLayout>
              </td>
              <td>
                <ShortComBoxLayout>
                  {isConnecting ? (
                    <>
                      <div
                        style={{
                          width: "6px",
                          height: "6px",
                          backgroundColor: "#1ADE00",
                          borderRadius: "50%",
                          boxShadow: "0px 0px 2px rgba(26,222,0,0.5)",
                          marginRight: "7px",
                        }}
                      ></div>
                      <Typography sx={{ color: "#1ADE00" }}>접속중</Typography>
                    </>
                  ) : (
                    <Typography>
                      미접속
                      <br />
                      3시간전
                    </Typography>
                  )}
                </ShortComBoxLayout>
              </td>
              <td>
                <AccountMenuLayout>
                  <Edit
                    onClick={() => {
                      row.isLock ? null : onManage("edit");
                    }}
                  />
                  {row.isLock ? (
                    <div style={{ color: "#73777D" }}>
                      <Lock
                        onClick={() => {
                          onManage("lock");
                        }}
                      />
                    </div>
                  ) : (
                    <UnLock
                      onClick={() => {
                        row.isLock ? null : onManage("unlock");
                      }}
                    />
                  )}

                  <Delete
                    onClick={() => {
                      row.isLock ? null : onManage("delete");
                    }}
                  />
                </AccountMenuLayout>
              </td>
            </tr>
          );
        })}
      </tbody>
    </StTable>
  );
};

export default StaffAccountSettingsTable;

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

const ShortComBoxLayout = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 138px;
  height: 36px;
  margin: 0 auto;
`;

const AccountMenuLayout = styled(ShortComBoxLayout)`
  color: #c4c5cc;
  gap: 28px;
`;

const LongComBoxLayout = styled.div`
  width: 224px;
  height: 36px;
  margin: 0 auto;
`;
