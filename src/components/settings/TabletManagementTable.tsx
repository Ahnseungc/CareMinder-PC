import { FC, useEffect, useState } from "react";
import styled from "@emotion/styled";
import palette from "@styles/palette";
import { CComboBox } from "@components/common/atom/C-ComboBox";
import CInput from "@components/common/atom/C-Input";

import { ReactComponent as Leave } from "@/assets/Leave.svg";
import { ReactComponent as Sleep } from "@/assets/sleep.svg";
import { Checkbox, Typography } from "@mui/material";
import { useGetWardTabletList } from "@hooks/queries/useGetWardTabletList";
import { useGetAreaList } from "@hooks/queries/useGetAreaList";
import useChangeTabletArea from "@hooks/mutation/useChangeWardTabletArea";
import { toast } from "react-toastify";

const columns = [
  { field: "check", headerName: "" },
  { field: "Section", headerName: "구역" },
  { field: "TabletName", headerName: "태블릿 이름" },
  { field: "identificationNum", headerName: "식별번호" },
  { field: "PatientName", headerName: "환자이름" },
  { field: "AdmissionDate", headerName: "입원 일자" },
];

const TabletManagementTable: FC = () => {
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const [area, setArea] = useState<string[]>([""]);
  const [selectIndex, setSelectIndex] = useState<number[]>([]);

  const { mutate: changeTabletArea } = useChangeTabletArea();

  const { data: wardTabletList, isLoading: wardTabletLoading } = useGetWardTabletList();
  const { data: areaList, isLoading: areaLoading } = useGetAreaList();

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
                        options={area}
                        value={row.areaName}
                        onChange={e => handleChangeArea(e, row.tabletId)}
                        // allowCustomInput={true}
                        // onCustomInputAdd={newValue => {
                        //   setOptions([...options, newValue]);
                        // }}
                      />
                    </ComBoxLayout>
                  </td>
                  <td>
                    <ComBoxLayout>
                      <CInput
                        variant={"outlined"}
                        placeholder={"태블릿이름"}
                        onChange={() => null}
                        value={row.tabletName}
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
                      <Typography>{row.serialNumber}</Typography>
                    </ComBoxLayout>
                  </td>
                  <td>
                    <ComBoxLayout>
                      <CInput
                        variant={"outlined"}
                        placeholder={"환자 이름"}
                        onChange={() => null}
                        value={row.patientName}
                        disabled={false}
                        id={""}
                      ></CInput>
                    </ComBoxLayout>
                  </td>
                  <td>
                    <ComBoxLayout>
                      <Typography>{row.createdAt.substring(0, 10)}</Typography>
                    </ComBoxLayout>
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
  display: flex;
  justify-content: center;
  align-items: center;

  position: relative;
  width: 224px;
  height: 36px;
  margin: 0 auto;
`;

const TabletButtonLayout = styled.div`
  position: absolute;
  top: 4px;
  right: -90px;

  display: flex;
  gap: 5px;
`;
