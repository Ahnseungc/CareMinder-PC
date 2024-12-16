import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import palette from "@styles/palette";
import { CComboBox } from "@components/common/atom/C-ComboBox";
import CInput from "@components/common/atom/C-Input";

import { ReactComponent as Leave } from "@/assets/Leave.svg";
import { ReactComponent as Alert } from "@/assets/alert.svg";
import { Checkbox, Typography } from "@mui/material";
import { useGetWardTabletList } from "@hooks/queries/useGetWardTabletList";
import { useGetAreaList } from "@hooks/queries/useGetAreaList";
import useChangeTabletArea from "@hooks/mutation/useChangeWardTabletArea";
import { toast } from "react-toastify";
import PaginationComponent from "@components/common/pagination";
import { useRecoilValue, useSetRecoilState } from "recoil";
import tabletEditingState from "@libraries/recoil/settings/tabletEdit";

const columns = [
  { field: "check", headerName: "" },
  { field: "Section", headerName: "구역" },
  { field: "TabletName", headerName: "태블릿 이름" },
  { field: "identificationNum", headerName: "식별번호" },
  { field: "PatientName", headerName: "환자이름" },
  { field: "AdmissionDate", headerName: "입원 일자" },
  { field: "Logout", headerName: "환자 로그아웃" },
];

interface TabletManagementTableProps {
  isClear: boolean;
  setIsClear: React.Dispatch<React.SetStateAction<boolean>>;
}

const TabletManagementTable = ({ isClear, setIsClear }: TabletManagementTableProps) => {
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const [area, setArea] = useState<string[]>([""]);
  const [selectIndex, setSelectIndex] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const setIsEditing = useSetRecoilState(tabletEditingState);
  const isEditing = useRecoilValue(tabletEditingState);

  const { data: wardTabletList, isLoading: wardTabletLoading } = useGetWardTabletList({
    myArea: false,
    page: currentPage - 1,
    size: 20,
  });
  const { data: areaList, isLoading: areaLoading } = useGetAreaList();
  const { mutate: changeTabletArea } = useChangeTabletArea();

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

  const handleChangeArea = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const value = event.target.value;
    const areaId = areaList?.find(item => item.name === value)?.id as number;
    console.log(areaId);
    console.log(id);
    changeTabletArea(
      {
        userIds: [id],
        areaId: areaId,
      },
      {
        onSuccess: () => {
          toast.success("구역 변경이 완료되었습니다");
        },
        onError: () => {
          toast.error("구역 변경을 실패했습니다");
        },
      },
    );
  };
  //@ts-ignore
  const handleChangePage = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    console.log(page);
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
    if (areaList) {
      setArea(areaList.map(item => item.name));
    }
  }, [areaList]);

  if (wardTabletLoading && areaLoading) {
    return <div>로딩 중..</div>;
  }

  return (
    <>
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
                  <tr
                    key={index}
                    style={{
                      backgroundColor: `${selectIndex.includes(index) ? "#EFF0F8" : "white"}`,
                    }}
                  >
                    <td>
                      <ShortComBoxLayout>
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
                      </ShortComBoxLayout>
                    </td>
                    <td>
                      <LongComBoxLayout>
                        <CComboBox
                          placeholder={"구역"}
                          options={area}
                          value={row.areaName}
                          onChange={e => handleChangeArea(e, row.tabletId)}
                          // allowCustomInput={true}
                          // onCustomInputAdd={newValue => {
                          //   setOptions([...options, newValue]);
                          // }}
                        />
                      </LongComBoxLayout>
                    </td>
                    <td>
                      <LongComBoxLayout>
                        <CInput
                          variant={"outlined"}
                          placeholder={"태블릿이름"}
                          onChange={() => null}
                          value={row.tabletName}
                          disabled={false}
                          id={""}
                        ></CInput>
                        <TabletButtonLayout>
                          <Alert />
                        </TabletButtonLayout>
                      </LongComBoxLayout>
                    </td>
                    <td>
                      <LongComBoxLayout>
                        <Typography>{row.serialNumber}</Typography>
                      </LongComBoxLayout>
                    </td>
                    <td>
                      <LongComBoxLayout>
                        <CInput
                          variant={"outlined"}
                          placeholder={"환자 이름"}
                          onChange={() => null}
                          value={row.patientName}
                          disabled={false}
                          id={""}
                        ></CInput>
                      </LongComBoxLayout>
                    </td>
                    <td>
                      <LongComBoxLayout>
                        <Typography>
                          {row.createdAt ? row.createdAt.substring(0, 10) : row.createdAt}
                        </Typography>
                      </LongComBoxLayout>
                    </td>
                    <td>
                      <ShortComBoxLayout>
                        <Leave />
                      </ShortComBoxLayout>
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
            totalPage={wardTabletList?.totalPages as number}
            onChange={(e, page) => handleChangePage(e, page)}
          />
        </div>
      </PaginationContainer>
    </>
  );
};

export default TabletManagementTable;

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
  position: relative;
  width: 224px;
  height: 36px;
  margin: 0 auto;
`;

const TabletButtonLayout = styled.div`
  position: absolute;
  top: 7px;
  right: -35px;
  display: flex;
  gap: 5px;
`;

const PaginationContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  margin-top: 60px;
`;
