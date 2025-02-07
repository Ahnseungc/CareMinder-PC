import styled from "@emotion/styled";
import palette from "@styles/palette";
import { useEffect, useState } from "react";
import { Checkbox, Typography } from "@mui/material";
import { motion } from "framer-motion";

import { ReactComponent as Leave } from "@/assets/Leave.svg";
import { ReactComponent as Edit } from "@/assets/accountEdit.svg";
import { ReactComponent as Info } from "@assets/alert.svg";

import { useBooleanState } from "@toss/react";
import { useGetWardTabletList, WardTabledListType } from "@hooks/queries/useGetWardTabletList";
import { useRecoilValue, useSetRecoilState } from "recoil";
import PaginationComponent from "@components/common/pagination";
import tabletEditingState from "@libraries/recoil/settings/tabletEdit";
import InfoModal from "./modal/InfoModal";
import TabletLogoutWarning from "./TabletLogoutWarning";
import tabletListState from "@libraries/recoil/settings/tabletList";
import EditTableInfoModal from "./modal/EditTabletInfoModal";

const columns = [
  { field: "Check", headerName: "" },
  { field: "Section", headerName: "구역" },
  { field: "TabletName", headerName: "태블릿 이름" },
  { field: "PatientName", headerName: "환자이름" },
  { field: "AdmissionDate", headerName: "입원 일자" },
  { field: "TabletStatus", headerName: "태블릿 상태" },
  { field: "SleepModeControl", headerName: "수면제한" },
  { field: "TabletManageMent", headerName: "태블릿 관리" },
  { field: "Logout", headerName: "환자 로그아웃" },
];

interface TabletManagementTableProps {
  isClear: boolean;
  setIsClear: React.Dispatch<React.SetStateAction<boolean>>;
}

const TabletManagementTable = ({ isClear, setIsClear }: TabletManagementTableProps) => {
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const [selectIndex, setSelectIndex] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedTabletId, setSelectedTabletId] = useState<number | null>(null);
  const [selectedTabletData, setSelectedTabletData] = useState<WardTabledListType | null>(null);

  const [isLogoutModalOpen, openLogoutModal, closeLogoutModal] = useBooleanState();
  const [isTabletEditModalOpen, openTabletEditModal, closeTabletEditModal] = useBooleanState();

  const setIsEditing = useSetRecoilState(tabletEditingState);
  const isEditing = useRecoilValue(tabletEditingState);
  const setSelectTabletList = useSetRecoilState(tabletListState);

  const { data: wardTabletList } = useGetWardTabletList({
    myArea: false,
    page: currentPage - 1,
    size: 20,
  });

  const totalItems = wardTabletList?.data?.length ?? 0;
  const selectedItems = selectIndex.length;

  const handleSelectAll = () => {
    if (wardTabletList) {
      if (selectIndex.length === wardTabletList.data.length) {
        setSelectIndex([]);
      } else {
        setSelectIndex(wardTabletList.data.map((_, index) => index));
      }
    }
  };

  //@ts-ignore
  const handleChangePage = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleEditTablet = (tabletId: number) => {
    setSelectedTabletId(tabletId);
    openTabletEditModal();
  };

  const handleTabletLogout = (tabletId: number) => {
    setSelectedTabletId(tabletId);
    openLogoutModal();
  };

  useEffect(() => {
    if (isClear) {
      setIsClear(false);
      setSelectIndex([]);
    }
  }, [isEditing, isClear, setIsClear]);

  useEffect(() => {
    if (selectIndex.length === 0) {
      setIsEditing([]);
    } else {
      setIsEditing(selectIndex);
    }
  }, [selectIndex, setIsEditing]);

  useEffect(() => {
    const index = selectIndex.map(item => wardTabletList?.data[item].tabletId) as number[];
    setSelectTabletList(index);
  }, [setSelectTabletList, selectIndex, wardTabletList]);

  return (
    <>
      {/* 태블릿 로그아웃 설정 모달/ */}
      <InfoModal
        open={isLogoutModalOpen}
        onClose={closeLogoutModal}
        modalType="checkDelete"
        leftText="취소"
        rightText="중단"
        userType={"WARD"}
        onConfirm={() => null}
        message={<TabletLogoutWarning />}
      />

      {/* 태블릿 정보 변경 설정 모달 */}
      <EditTableInfoModal
        open={isTabletEditModalOpen}
        onClose={closeTabletEditModal}
        tabletId={selectedTabletId as number}
        tabletData={selectedTabletData as WardTabledListType}
      />

      {wardTabletList?.data.length === 0 ? (
        <></>
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
                                fill: "#B4C0FF",
                              },
                            },
                          }}
                          checked={selectIndex.length === wardTabletList?.data.length}
                          indeterminate={selectedItems > 0 && selectedItems < totalItems}
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
              {wardTabletList?.data.map((row, index) => {
                return (
                  <StyledTr key={index} isSelected={selectIndex.includes(index)}>
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
                        <Typography variant="body2">{row.areaName}</Typography>
                      </ShortComBoxLayout>
                    </td>
                    <td>
                      <LongComBoxLayout>
                        <TabletName>
                          {row.tabletName}
                          <SerialNumberContainer whileHover="hover" initial="initial">
                            <Info />
                            <SerialNumber
                              variants={{
                                initial: { opacity: 0, x: -10 },
                                hover: { opacity: 1, x: 0 },
                              }}
                              transition={{ duration: 0.2 }}
                            >
                              {row.serialNumber || "식별번호없음"}
                            </SerialNumber>
                          </SerialNumberContainer>
                        </TabletName>
                      </LongComBoxLayout>
                    </td>
                    <td>
                      <LongComBoxLayout>
                        <Typography variant="body2">{row.patientName || "미배정"}</Typography>
                      </LongComBoxLayout>
                    </td>
                    <td>
                      <LongComBoxLayout>
                        <Typography variant="body2">
                          {row.createdAt ? row.createdAt.substring(0, 10) : row.createdAt}
                        </Typography>
                      </LongComBoxLayout>
                    </td>
                    <td>
                      <LongComBoxLayout>
                        <Typography>태블릿 상태</Typography>
                      </LongComBoxLayout>
                    </td>
                    <td>
                      <LongComBoxLayout>
                        <Typography>수면 제한</Typography>
                      </LongComBoxLayout>
                    </td>
                    <td>
                      <ShortComBoxLayout>
                        <Edit
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            handleEditTablet(row.tabletId);
                            setSelectedTabletData(row);
                          }}
                        />
                      </ShortComBoxLayout>
                    </td>
                    <td>
                      <ShortComBoxLayout>
                        <Leave
                          style={{ cursor: "pointer" }}
                          onClick={() => handleTabletLogout(row.tabletId)}
                        />
                      </ShortComBoxLayout>
                    </td>
                  </StyledTr>
                );
              })}
            </tbody>
          </StTable>
        </TableContainer>
      )}
      <PaginationContainer>
        <div>
          <PaginationComponent
            totalPage={wardTabletList?.totalPages as number}
            onChange={(e, page) => handleChangePage(e, page)}
          />
        </div>
      </PaginationContainer>
    </>
  );
};

export default TabletManagementTable;

/** styles */

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const StTable = styled.table`
  cursor: pointer;
  min-width: 100%;
  width: max-content;
  border-collapse: collapse;
  margin-bottom: 20px;

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

const StyledTr = styled.tr<{ isSelected: boolean }>`
  background-color: ${props => (props.isSelected ? "#EFF0F8" : "white")};
  &:hover {
    background-color: #eff0f8;
  }
`;

const ShortComBoxLayout = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 138px;
  height: 36px;
  margin: 0 auto;
  gap: 20px;
`;

const LongComBoxLayout = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 0 20px;
  width: 224px;
  height: 36px;
  margin: 0 auto;
`;

const TabletName = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SerialNumberContainer = styled(motion.div)`
  position: relative;
  display: flex;
  align-items: center;
`;

const SerialNumber = styled(motion.div)`
  position: absolute;
  top: 30px;
  left: -30px;
  z-index: 10;
  background-color: #00000099;
  color: #ffffff;
  padding: 4px 8px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
`;

const PaginationContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  margin-top: 60px;
`;
