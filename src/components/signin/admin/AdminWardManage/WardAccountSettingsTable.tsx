import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import palette from "@styles/palette";
import CInput from "@components/common/atom/C-Input";
import { Box, Checkbox, Typography } from "@mui/material";
import { ReactComponent as Edit } from "@/assets/accountEdit.svg";
import { ReactComponent as Lock } from "@/assets/completedRequests/Interface essential/Lock.svg";
import { ReactComponent as UnLock } from "@/assets/completedRequests/Interface essential/Unlock.svg";
import { ReactComponent as Delete } from "@/assets/completedRequests/accountDelete.svg";
import { ReactComponent as EmptyStaff } from "@/assets/EmptyStaff.svg";
import { useRecoilValue, useSetRecoilState } from "recoil";
import PaginationComponent from "@components/common/pagination";
import { useBooleanState } from "@toss/react";
import { useGetwardList, WardListType } from "@hooks/queries/useGetWardList";
import { TimeSince } from "@components/settings/TimeSince";
import CButton from "@components/common/atom/C-Button";
import CreateWardModal from "@components/admin/adminModal/CreateWardModal";
import wardEditingState from "@libraries/recoil/wardEdit";
import EditWardInfoModal from "@components/admin/adminModal/EditWardInfoModal";
import wardListState from "@libraries/recoil/wardList";

const columns = [
  { field: "check", headerName: "" },
  { field: "WardName", headerName: "병동" },
  { field: "StaffName", headerName: "담당자 이름" },
  { field: "LoginId", headerName: "ID" },
  { field: "Phone", headerName: "담당자 전화번호" },
  { field: "Email", headerName: "담당자 이메일" },
  { field: "AccountStatus", headerName: "계정 상태" },
  { field: "AccountManage", headerName: "계정 관리" },
];

interface WardAccountSettingsTableProps {
  onManage: (modalType: string, staffId: number[]) => void;
  isClear: boolean;
  setIsClear: React.Dispatch<React.SetStateAction<boolean>>;
}

const WardAccountSettingsTable = ({
  onManage,
  isClear,
  setIsClear,
}: WardAccountSettingsTableProps) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data: wardList, isLoading: wardLoading } = useGetwardList({
    page: currentPage - 1,
    size: 20,
  });
  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  const [selectIndex, setSelectIndex] = useState<number[]>([]);
  const [selectedWard, setSelectedWard] = useState<WardListType>();

  const isEditing = useRecoilValue(wardEditingState);
  const setIsEditing = useSetRecoilState(wardEditingState);
  const setSelectWardList = useSetRecoilState(wardListState);

  const [open, openCreateModal, closeCreateModal] = useBooleanState(false);
  const [editOpen, openEditModal, closeEditModal] = useBooleanState(false);

  const totalItems = wardList?.data?.length ?? 0;
  const selectedItems = selectIndex.length;

  const handleCheckBox = (index: number) => {
    setSelectIndex(prevList => {
      if (prevList.includes(index)) {
        return prevList.filter(item => item !== index);
      } else {
        return [...prevList, index];
      }
    });
  };

  const handleSelectAll = () => {
    if (wardList) {
      if (selectIndex.length === wardList.data.length) {
        setSelectIndex([]);
      } else {
        setSelectIndex(wardList.data.map((_, index) => index));
      }
    }
  };

  const handleChangePage = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
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
    const index = selectIndex.map(item => wardList?.data[item].wardId) as number[];
    setSelectWardList(index);
  }, [setSelectWardList, selectIndex, wardList]);

  if (wardLoading) {
    return <div>로딩 중..</div>;
  }

  return (
    <>
      {/* 병동 계정 정보 편집 모달 */}
      <EditWardInfoModal open={editOpen} onClose={closeEditModal} wardData={selectedWard} />

      {/* 병동 계정 생성 모달 */}
      <CreateWardModal open={open} onClose={closeCreateModal} />

      {wardList?.data.length === 0 ? (
        <EmptyStaffContainer>
          <EmptyStaff />
          <EmptyText>등록된 병동계정이 없습니다.</EmptyText>
          <div style={{ maxWidth: "148px" }}>
            <CButton
              buttontype="primarySpaureWhite"
              onClick={openCreateModal}
              style={{ border: "1px solid #5DB8BE", color: "#5DB8BE" }}
            >
              병동 계정 생성
            </CButton>
          </div>
        </EmptyStaffContainer>
      ) : (
        <TableContainer>
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
                                fill: "#5DB8BE",
                              },
                            },
                          }}
                          checked={selectIndex.length === wardList?.data.length}
                          indeterminate={selectedItems > 0 && selectedItems < totalItems}
                          onClick={handleSelectAll}
                        />
                      </th>
                    );
                  }
                  return (
                    <th key={index}>
                      <>{column.headerName}</>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {wardList &&
                wardList.data.map((row, index) => {
                  return (
                    <tr
                      key={index}
                      style={{
                        backgroundColor: `${selectIndex.includes(index) ? "#E6EFF0" : "white"}`,
                        opacity: `${row.userStatusInfo.accountLocked ? 0.5 : 1}`,
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
                                fill: "#5DB8BE",
                              },
                            },
                          }}
                          checked={selectIndex.includes(index)}
                          onClick={() => handleCheckBox(index)}
                        />
                      </td>
                      <td>
                        <LongComBoxLayout>
                          <CInput
                            variant={"outlined"}
                            placeholder={"병동 이름 입력"}
                            onChange={() => null}
                            value={row.wardName}
                            disabled={row.userStatusInfo.accountLocked}
                            id={""}
                          ></CInput>
                        </LongComBoxLayout>
                      </td>
                      <td>
                        <ShortComBoxLayout>
                          <CInput
                            variant={"outlined"}
                            placeholder={"담당자 이름 입력"}
                            onChange={() => null}
                            value={row.managerName ? row.managerName : "담당자 정보 없음"}
                            disabled={row.userStatusInfo.accountLocked}
                            id={""}
                          ></CInput>
                        </ShortComBoxLayout>
                      </td>
                      <td>
                        <ShortComBoxLayout>
                          <CInput
                            variant={"outlined"}
                            placeholder={"담당자 아이디 입력"}
                            onChange={() => null}
                            value={row.loginId}
                            disabled={row.userStatusInfo.accountLocked}
                            id={""}
                          ></CInput>
                        </ShortComBoxLayout>
                      </td>
                      <td>
                        <ShortComBoxLayout>
                          <CInput
                            variant={"outlined"}
                            placeholder={"담당자 전화번호 입력"}
                            onChange={() => null}
                            value={row.managerPhoneNumber}
                            disabled={row.userStatusInfo.accountLocked}
                            id={""}
                          ></CInput>
                        </ShortComBoxLayout>
                      </td>
                      <td>
                        <LongComBoxLayout>
                          <CInput
                            variant={"outlined"}
                            placeholder={"담당자 이메일 입력"}
                            onChange={() => null}
                            value={row.managerEmail}
                            disabled={row.userStatusInfo.accountLocked}
                            id={""}
                          ></CInput>
                        </LongComBoxLayout>
                      </td>
                      <td>
                        <ShortComBoxLayout>
                          {row.userStatusInfo.isLogIn ? (
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
                              {row.userStatusInfo.timeSinceLogout ? (
                                <Typography>
                                  미접속
                                  <br />
                                  <TimeSince time={row.userStatusInfo.timeSinceLogout} />
                                </Typography>
                              ) : (
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
                              if (!row.userStatusInfo.accountLocked) {
                                setSelectedWard(row);
                                openEditModal();
                                onManage("edit", [row.wardId]);
                              } else {
                                null;
                              }
                            }}
                          />
                          {row.userStatusInfo.accountLocked ? (
                            <div style={{ color: "#73777D" }}>
                              <Lock
                                onClick={() => {
                                  onManage("lock", [row.wardId]);
                                }}
                              />
                            </div>
                          ) : (
                            <UnLock
                              onClick={() => {
                                setSelectWardList([row.wardId]);
                                row.userStatusInfo.accountLocked
                                  ? null
                                  : onManage("unlock", [row.wardId]);
                              }}
                            />
                          )}

                          <Delete
                            onClick={() => {
                              row.userStatusInfo.accountLocked
                                ? null
                                : onManage("delete", [row.wardId]);
                            }}
                          />
                        </AccountMenuLayout>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </StTable>
        </TableContainer>
      )}
      <PaginationContainer>
        <div>
          <PaginationComponent
            totalPage={wardList?.totalPages as number}
            onChange={(e, page) => handleChangePage(e, page)}
            customColor="#5DB8BE"
          />
        </div>
      </PaginationContainer>
    </>
  );
};

export default WardAccountSettingsTable;

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const StTable = styled.table`
  min-width: 100%;
  width: max-content;
  border-collapse: collapse;
  margin-bottom: 20px;

  & thead {
    width: 100%;
    height: 20%;
    & th {
      position: relative;
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

const LongComBoxLayout = styled.div`
  width: 224px;
  height: 36px;
  margin: 0 auto;
`;

const AccountMenuLayout = styled(ShortComBoxLayout)`
  cursor: pointer;
  color: #c4c5cc;
  gap: 28px;
`;

const EmptyStaffContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",

  gap: "32px",

  minHeight: "600px",
  marginBottom: "100px",
});

const EmptyText = styled(Typography)({
  fontSize: "16px",
  lineHeight: "24px",
  fontWeight: "500",
});

const PaginationContainer = styled(Box)({
  marginTop: "60px",
});
