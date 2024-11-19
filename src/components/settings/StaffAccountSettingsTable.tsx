import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import palette from "@styles/palette";
import { CComboBox } from "@components/common/atom/C-ComboBox";
import CInput from "@components/common/atom/C-Input";
import { Box, Checkbox, Divider, Typography } from "@mui/material";

import { ReactComponent as Edit } from "@/assets/accountEdit.svg";
import { ReactComponent as Lock } from "@/assets/completedRequests/Interface essential/Lock.svg";
import { ReactComponent as UnLock } from "@/assets/completedRequests/Interface essential/Unlock.svg";
import { ReactComponent as Delete } from "@/assets/completedRequests/accountDelete.svg";
import { ReactComponent as EmptyStaff } from "@/assets/EmptyStaff.svg";
import { ReactComponent as Filter } from "@/assets/filter.svg";
import { ReactComponent as X } from "@/assets/x-Icon.svg";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { editingState, staffListState } from "@libraries/recoil";
import { useGetStaffList } from "@hooks/queries/useGetStaffList";
import { useGetAreaList } from "@hooks/queries/useGetAreaList";
import useCreateArea from "@hooks/mutation/useCreateArea";
import { OPTIONS } from "./const";
import useChangeStaffRole from "@hooks/mutation/useChangeRole";
import useChangeStaffArea from "@hooks/mutation/useChangeArea";
import { toast } from "react-toastify";
import { TimeSince } from "./TimeSince";

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

interface StaffAccountSettingsTableProps {
  onManage: (modalType: string, staffId: number[]) => void;
  isClear: boolean;
  setIsClear: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FilterState {
  menu: string;
  state: boolean;
}

const StaffAccountSettingsTable = ({
  onManage,
  isClear,
  setIsClear,
}: StaffAccountSettingsTableProps) => {
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const [area, setArea] = useState<string[]>([""]);
  const [selectIndex, setSelectIndex] = useState<number[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState<FilterState>({
    menu: "",
    state: false,
  });
  const setIsEditing = useSetRecoilState(editingState);
  const isEditing = useRecoilValue(editingState);
  const setSelectStaffList = useSetRecoilState(staffListState);

  const { mutate: createArea } = useCreateArea();
  const { mutate: changeStaffRole } = useChangeStaffRole();
  const { mutate: changeStaffArea } = useChangeStaffArea();

  const { data: staffList, isLoading: staffLoading } = useGetStaffList();
  const { data: areaList, isLoading: areaLoading } = useGetAreaList();

  const handleCreateArea = (newValue: string) => {
    const areaData = {
      name: newValue,
      wardId: 1,
    };
    createArea(areaData);
  };

  const handleFilterBox = (menu: string) => {
    setIsFilterOpen(prev => ({
      menu: menu,
      state: prev.menu === menu ? !prev.state : true,
    }));
  };

  const handleCheckBox = (index: number) => {
    setSelectIndex(prevList => {
      if (prevList.includes(index)) {
        return prevList.filter(item => item !== index);
      } else {
        return [...prevList, index];
      }
    });
  };

  const handleChangeArea = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const value = event.target.value;
    const areaId = areaList?.find(item => item.name === value)?.id as number;
    // console.log(areaId);
    // console.log(id);
    changeStaffArea(
      {
        userIds: [id],
        areaId: areaId,
      },
      {
        onSuccess: () => {
          setIsClear(true);
          toast.success("구역 변경이 완료되었습니다");
        },
        onError: () => {
          toast.error("구역 변경을 실패했습니다");
        },
      },
    );
  };

  const handleChangeRole = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const value = event.target.value;
    const staffRole = OPTIONS.find(item => item.value === value)?.role as string;
    // console.log(staffRole);
    // console.log(id);

    changeStaffRole(
      {
        userIds: [id],
        staffRole: staffRole,
      },
      {
        onSuccess: () => {
          setIsClear(true);
          toast.success("직업 변경이 완료되었습니다");
        },
        onError: () => {
          toast.error("직업 변경을 실패했습니다");
        },
      },
    );
  };

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
      setArea(areaList.map(item => item.name));
    }
  }, [areaList]);

  useEffect(() => {
    const index = selectIndex.map(item => staffList?.data[item].staffId) as number[];
    setSelectStaffList(index);
  }, [setSelectStaffList, selectIndex, staffList]);

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
                const shouldShowFilter = ["직업", "구역", "계정상태"].includes(column.headerName);

                return (
                  <th key={index}>
                    <>{column.headerName}</>
                    {shouldShowFilter && (
                      <>
                        <span>
                          <Filter onClick={() => handleFilterBox(column.headerName)} />
                        </span>
                        {isFilterOpen.state && isFilterOpen.menu === column.headerName ? (
                          <FilterBox>
                            <SelectArea>선택된 항목이 없습니다.</SelectArea>
                            <FilterList>
                              <li>구역1</li>
                              <li>구역2</li>
                              <li>구역3</li>
                              <li>구역4</li>
                            </FilterList>
                            <Divider sx={{ border: "1px solid #C4C5CC" }} />
                            <FilterList>
                              <div>
                                <li>오름차순</li>
                                <X />
                              </div>
                              <div>
                                <li>내림차순</li>
                                <X />
                              </div>
                            </FilterList>
                          </FilterBox>
                        ) : null}
                      </>
                    )}
                  </th>
                );
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
                        onClick={() => handleCheckBox(index)}
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
                          onChange={e => handleChangeRole(e, row.staffId)}
                        />
                      </ShortComBoxLayout>
                    </td>
                    <td>
                      <LongComBoxLayout>
                        <CComboBox
                          placeholder={"구역"}
                          options={area}
                          value={row.areaName}
                          disabled={row.accountLocked}
                          onChange={e => handleChangeArea(e, row.staffId)}
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
                        {row.isLogIn ? (
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
                          <>
                            {row.timeSinceLogout ? (
                              <Typography>
                                미접속
                                <br />
                                <TimeSince time={row.timeSinceLogout} />
                              </Typography>
                            ) : (
                              // 계정 생성 후 로그인 기록이 없는 경우 처리
                              <Typography>로그인 기록 없음</Typography>
                            )}
                          </>
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
      position: relative;
      padding-bottom: 11.52px;
      color: ${palette.text.primary};
      border-bottom: 1px solid ${palette.divider};

      & span {
        position: absolute;
        top: -2px;
        cursor: pointer;
        &:hover {
          color: #5d6dbe;
        }
      }
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

const FilterBox = styled.div`
  z-index: 10;
  position: absolute;
  top: 30px;
  padding: 8px;
  width: 240px;
  border-radius: 12px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.16);
  background-color: #ffffff;
`;

const SelectArea = styled.div`
  background-color: #eff1f9;
  padding: 4px;
  border-radius: 4px;
  color: #878787;
  text-align: left;
  font-weight: 400;
`;

const FilterList = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  gap: 7px;

  padding: 0;
  width: 100%;
  list-style: none;

  font-size: 14px;

  & div {
    width: 100%;
    display: flex;
    justify-content: space-between;
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
