import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import palette from "@styles/palette";
import { CComboBox } from "@components/common/atom/C-ComboBox";
import CInput from "@components/common/atom/C-Input";
import { Box, Checkbox, Typography } from "@mui/material";

import { ReactComponent as Edit } from "@/assets/accountEdit.svg";
import { ReactComponent as Lock } from "@/assets/completedRequests/Interface essential/Lock.svg";
import { ReactComponent as UnLock } from "@/assets/completedRequests/Interface essential/Unlock.svg";
import { ReactComponent as Delete } from "@/assets/completedRequests/accountDelete.svg";
import { ReactComponent as EmptyStaff } from "@/assets/EmptyStaff.svg";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { editingState } from "@libraries/recoil";
import { useGetStaffList } from "@hooks/queries/useGetStaffList";
import { useGetAreaList } from "@hooks/queries/useGetAreaList";
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

const OPTIONS = [
  {
    role: "NURSE",
    value: "간호사",
  },
  {
    role: "DOCTOR",
    value: "의사",
  },
  {
    role: "NURSE_ASSISTANT",
    value: "조무사",
  },
  {
    role: "WORKER",
    value: "직원",
  },
];

interface StaffAccountSettingsTableProps {
  onManage: (modalType: string, staffId: number[]) => void;
  isClear: boolean;
  setIsClear: React.Dispatch<React.SetStateAction<boolean>>;
}

/**계정 상태 테스트 변수 */
const isConnecting = true;

const StaffAccountSettingsTable = ({
  onManage,
  isClear,
  setIsClear,
}: StaffAccountSettingsTableProps) => {
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const [_, setOption] = useState<string>();
  const [options, setOptions] = useState<string[]>([""]);
  const [selectIndex, setSelectIndex] = useState<number[]>([]);
  const setIsEditing = useSetRecoilState(editingState);
  const isEditing = useRecoilValue(editingState);

  const { mutate: createArea } = useCreateArea();

  const { data: staffList, isLoading: staffLoading } = useGetStaffList();
  const { data: areaList, isLoading: areaLoading } = useGetAreaList();

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
    if (areaList) {
      setOptions(areaList.map(item => item.name));
    }
  }, [areaList]);

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

  if (staffLoading && areaLoading) {
    return <div>로딩 중..</div>;
  }

  return (
    <>
      {staffList?.data.length === 0 ? (
        <EmptyStaffContainer>
          <EmptyStaff />
          <p>등록된 스태프가 없습니다.</p>
        </EmptyStaffContainer>
      ) : (
        <StTable>
          <thead>
            <tr>
              {columns.map((column, index) => {
                return <th key={index}>{column.headerName}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {staffList &&
              staffList.data.map((row, index) => {
                return (
                  <tr
                    key={index}
                    style={{
                      backgroundColor: `${selectIndex.includes(index) ? "#EFF0F8" : "white"}`,
                      opacity: `${row.accountLocked ? 0.5 : 1}`,
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
                          value={row.name}
                          disabled={row.accountLocked}
                          id={""}
                        ></CInput>
                      </ShortComBoxLayout>
                    </td>
                    <td>
                      <ShortComBoxLayout>
                        <CComboBox
                          placeholder={"간호사"}
                          options={OPTIONS.map(option => option.value)}
                          value={
                            OPTIONS.find(option => option.role === row.staffRole)?.value as string
                          }
                          disabled={row.accountLocked}
                          onChange={() => null}
                        />
                      </ShortComBoxLayout>
                    </td>
                    <td>
                      <LongComBoxLayout>
                        <CComboBox
                          placeholder={"구역"}
                          options={options}
                          value={row.areaName}
                          disabled={row.accountLocked}
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
                          value={row.loginId}
                          disabled={row.accountLocked}
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
                          value={row.phoneNumber}
                          disabled={row.accountLocked}
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
                          value={row.email}
                          disabled={row.accountLocked}
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
                            row.accountLocked ? null : onManage("edit", [row.staffId]);
                          }}
                        />
                        {row.accountLocked ? (
                          <div style={{ color: "#73777D" }}>
                            <Lock
                              onClick={() => {
                                onManage("lock", [row.staffId]);
                              }}
                            />
                          </div>
                        ) : (
                          <UnLock
                            onClick={() => {
                              row.accountLocked ? null : onManage("unlock", [row.staffId]);
                            }}
                          />
                        )}

                        <Delete
                          onClick={() => {
                            row.accountLocked ? null : onManage("delete", [row.staffId]);
                          }}
                        />
                      </AccountMenuLayout>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </StTable>
      )}
    </>
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

const EmptyStaffContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",

  minHeight: "600px",
  marginBottom: "100px",
});
