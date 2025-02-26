import styled from "@emotion/styled";
import palette from "@styles/palette";
import { useEffect, useState } from "react";
import { Checkbox, Typography } from "@mui/material";
import { motion } from "framer-motion";

import { ReactComponent as Leave } from "@/assets/Leave.svg";
import { ReactComponent as Edit } from "@/assets/accountEdit.svg";
import { ReactComponent as Info } from "@assets/alert.svg";
import { ReactComponent as Filter } from "@/assets/filter-icon.svg";
import { ReactComponent as DEFAULT_Array } from "@/assets/filter-vertical-icon.svg";
import { ReactComponent as ASC_Array } from "@/assets/ASC_array.svg";
import { ReactComponent as DESC_Array } from "@/assets/DESC_array.svg";

import { useBooleanState } from "@toss/react";
import { TableStatus, WardTabledListType } from "@hooks/queries/useGetWardTabletList";
import { useRecoilValue, useSetRecoilState } from "recoil";
import PaginationComponent from "@components/common/pagination";
import tabletEditingState from "@libraries/recoil/settings/tabletEdit";
import InfoModal from "./modal/InfoModal";
import TabletLogoutWarning from "./TabletLogoutWarning";
import tabletListState from "@libraries/recoil/settings/tabletList";
import EditTableInfoModal from "./modal/EditTabletInfoModal";
import CFilter from "@components/common/Filter/Filter";
import { formatTimeRange } from "@utils/formatSleepModeTime";
import useTabletLists, { TabletFilter } from "@hooks/mutation/useTabletList";
import { useGetAreaList } from "@hooks/queries/useGetAreaList";

export type Columns = {
  field: string;
  headerName: React.ReactNode;
};

interface TabletManagementTableProps {
  isClear: boolean;
  setIsClear: React.Dispatch<React.SetStateAction<boolean>>;
  searchValue: string;
}

const TabletManagementTable = ({
  isClear,
  setIsClear,
  searchValue,
}: TabletManagementTableProps) => {
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const [selectIndex, setSelectIndex] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedTabletId, setSelectedTabletId] = useState<number | null>(null);
  const [selectedTabletData, setSelectedTabletData] = useState<WardTabledListType | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<TabletFilter>({});

  const [isLogoutModalOpen, openLogoutModal, closeLogoutModal] = useBooleanState();
  const [isTabletEditModalOpen, openTabletEditModal, closeTabletEditModal] = useBooleanState();

  const setIsEditing = useSetRecoilState(tabletEditingState);
  const isEditing = useRecoilValue(tabletEditingState);
  const setSelectTabletList = useSetRecoilState(tabletListState);

  const {
    mutate: tabletListsMutation,
    data: wardTabletList,
    isPending: isLoading,
  } = useTabletLists();

  const { data: areaList } = useGetAreaList();

  const removeDefaultFilters = (filter: TabletFilter) => {
    const filteredObj = { ...filter };

    Object.keys(filteredObj).forEach(key => {
      const typedKey = key as keyof TabletFilter;
      const value = filteredObj[typedKey];

      if (value === "DEFAULT" || value === undefined || value === null) {
        delete filteredObj[typedKey];
      }
    });

    return filteredObj;
  };

  useEffect(() => {
    const currentFilter: TabletFilter = {
      ...filter,
      patientNameFilter: searchValue || undefined,
    };

    const processedFilter = removeDefaultFilters(currentFilter);

    tabletListsMutation({
      page: currentPage - 1,
      size: 20,
      filter: processedFilter,
    });
  }, [tabletListsMutation, currentPage, searchValue, filter]);

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

  const handleFilter = () => {
    setIsFilterOpen(prev => !prev);
  };

  const handleChangePage = (_: React.ChangeEvent<unknown> | null, page: number) => {
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

  const handleSort = (field: string) => {
    let newFilter = { ...filter };

    if (field === "PatientName") {
      const currentSort = filter.patientNameSort;
      newFilter = {
        ...filter,
        patientNameSort:
          currentSort === "ASC" ? "DESC" : currentSort === "DESC" ? "DEFAULT" : "ASC",
      };
    } else if (field === "TabletName") {
      const currentSort = filter.tabletNameSort;
      newFilter = {
        ...filter,
        tabletNameSort: currentSort === "ASC" ? "DESC" : currentSort === "DESC" ? "DEFAULT" : "ASC",
      };
    } /**else if (field === "AdmissionDate") {
      const currentSort = filter.admissionDateSort;
      newFilter = {
        ...filter,
        admissionDateSort: currentSort === "ASC" ? "DESC" : "ASC",
      };
    }*/

    setFilter(newFilter);
  };

  const handleAreaFilter = (selectedAreas: string[]) => {
    const areaIds = areaList
      ?.filter(area => selectedAreas.includes(area.name))
      .map(area => area.id) as number[];

    setFilter({
      ...filter,
      areaFilter: areaIds.length > 0 ? areaIds : undefined,
    });
    setIsFilterOpen(false);
  };

  useEffect(() => {
    console.log(filter);
  }, [filter]);

  const columns: Columns[] = [
    { field: "check", headerName: "" },
    {
      field: "Section",
      headerName: (
        <ColumnName onClick={handleFilter}>
          <span>구역</span>
          <Filter />
        </ColumnName>
      ),
    },
    {
      field: "TabletName",
      headerName: (
        <ColumnName onClick={() => handleSort("TabletName")}>
          <span>태블릿 이름</span>
          <span style={{ color: `${palette.primary.main}` }}>
            {filter.tabletNameSort === "ASC" ? (
              <ASC_Array />
            ) : filter.tabletNameSort === "DESC" ? (
              <DESC_Array />
            ) : (
              <DEFAULT_Array />
            )}
          </span>
        </ColumnName>
      ),
    },
    {
      field: "PatientName",
      headerName: (
        <ColumnName onClick={() => handleSort("PatientName")}>
          <span>환자 이름</span>
          <span style={{ color: `${palette.primary.main}` }}>
            {filter.patientNameSort === "ASC" ? (
              <ASC_Array />
            ) : filter.patientNameSort === "DESC" ? (
              <DESC_Array />
            ) : (
              <DEFAULT_Array />
            )}
          </span>
        </ColumnName>
      ),
    },
    {
      field: "AdmissionDate",
      headerName: (
        <ColumnName /**onClick={() => handleSort("AdmissionDate")}*/>
          <span>입원 일자</span>
          {/* <Array /> */}
        </ColumnName>
      ),
    },
    { field: "TabletStatus", headerName: "태블릿 상태" },
    { field: "SleepModeControl", headerName: "수면제한" },
    { field: "TabletManageMent", headerName: "태블릿 관리" },
    { field: "Logout", headerName: "환자 로그아웃" },
  ];

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

  if (isLoading) {
    return <div>로딩 중</div>;
  }

  if (!wardTabletList) {
    return null;
  }

  if (!areaList) {
    return null;
  }

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
                      {isFilterOpen && (
                        <div style={{ position: "absolute", zIndex: 10 }}>
                          <CFilter
                            options={areaList.map(area => area.name)}
                            type={"WARD"}
                            onApply={handleAreaFilter}
                            prevFilter={areaList
                              .filter(area => filter.areaFilter?.includes(area.id))
                              .map(area => area.name)}
                          />
                        </div>
                      )}
                    </th>
                  );
                }
                return <th key={index}>{column.headerName}</th>;
              })}
            </tr>
          </thead>
          {wardTabletList.data.length === 0 ? (
            <tbody>
              {Array.from(Array(9).keys()).map((_, index) => (
                <td key={index} style={{ textAlign: "center", paddingTop: "20px" }}>
                  -
                </td>
              ))}
            </tbody>
          ) : (
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
                          {row.admissionAt ? row.admissionAt.substring(0, 10) : row.admissionAt}
                        </Typography>
                      </LongComBoxLayout>
                    </td>
                    <td>
                      <LongComBoxLayout>
                        <TabletTypography status={row.featureRestrictionType}>
                          {row.featureRestrictionType === "FULL_ACCESS"
                            ? "● 전체가능"
                            : row.featureRestrictionType === "REQUEST_ONLY"
                              ? "● 요청가능"
                              : "● 강제종료"}
                        </TabletTypography>
                      </LongComBoxLayout>
                    </td>
                    <td>
                      <LongComBoxLayout>
                        {row.sleepModeSimple.type === null ? (
                          "사용 안함"
                        ) : (
                          <>
                            <TabletTypography
                              status={row.sleepModeSimple.type}
                              sx={{ marginRight: "8px" }}
                            >
                              {row.sleepModeSimple.type === "FULL_ACCESS"
                                ? "● 전체가능"
                                : row.sleepModeSimple.type === "REQUEST_ONLY"
                                  ? "● 요청가능"
                                  : "● 강제종료"}
                            </TabletTypography>
                            <span>
                              {formatTimeRange({
                                startHour: row.sleepModeSimple.startHour,
                                startMinute: row.sleepModeSimple.startMinute,
                                endHour: row.sleepModeSimple.endHour,
                                endMinute: row.sleepModeSimple.endMinute,
                              })}
                            </span>
                          </>
                        )}
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
                        <span
                          style={{
                            color: row.patientName
                              ? `${palette.primary.main}`
                              : `${palette.action.disabled}`,
                          }}
                        >
                          <Leave
                            style={{ cursor: "pointer" }}
                            onClick={() => handleTabletLogout(row.tabletId)}
                          />
                        </span>
                      </ShortComBoxLayout>
                    </td>
                  </StyledTr>
                );
              })}
            </tbody>
          )}
        </StTable>
      </TableContainer>

      {wardTabletList?.data.length === 0 ? null : (
        <PaginationContainer>
          <div>
            <PaginationComponent
              totalPage={wardTabletList?.totalPages as number}
              onChange={(e, page) => handleChangePage(e, page)}
            />
          </div>
        </PaginationContainer>
      )}
    </>
  );
};

export default TabletManagementTable;

/** styles */

const ColumnName = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

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

const TabletTypography = styled(Typography)<{ status: TableStatus }>`
  color: ${props =>
    props.status === "FULL_ACCESS"
      ? palette.tablet.main
      : props.status === "REQUEST_ONLY"
        ? palette.tablet.light
        : palette.tablet.dark};
`;

const PaginationContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  margin-top: 60px;
`;
