import { FC, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import palette from "@styles/palette";
import { CComboBox } from "@components/common/atom/C-ComboBox";
import CInput from "@components/common/atom/C-Input";
import { Box, CircularProgress } from "@mui/material";
import { WardTabletType } from "@models/ward-tablet";
import { ReactComponent as FilterIcon } from "@/assets/filter-icon.svg";
import { ReactComponent as FilterVerticalIcon } from "@/assets/filter-vertical-icon.svg";
import CButton from "@components/common/atom/C-Button";
import { formatDateDash } from "@utils/getDateform";
import useChangeTabletArea from "@hooks/mutation/useChangeWardTabletArea";
//@ts-ignore
import { Area, useGetAreaList, useGetStaffAreaList } from "@hooks/queries/useGetAreaList";
import CCheckBox from "@components/common/atom/C-CheckBox";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import useChangeTabletInfo from "@hooks/mutation/useChangeTabletInfo";

const columns = [
  { id: 0, field: "PatientName", headerName: "환자", icon: <FilterVerticalIcon />, width: "144px" },
  { id: 1, field: "Section", headerName: "구역", icon: <FilterIcon />, width: "192px" },
  {
    id: 2,
    field: "TableName",
    headerName: "태블릿 이름",
    icon: <FilterVerticalIcon />,
    width: "192px",
  },
  {
    id: 3,
    field: "TableName",
    headerName: "입원일자",
    icon: <FilterVerticalIcon />,
    width: "96px",
  },
  // { id: 4, field: "TableName", headerName: "메모 보기", width: "64px" },
  { id: 5, field: "TableName", headerName: "퇴원 처리 하기", width: "141px" },
];

interface AdminTableProps {
  getTablet: Array<WardTabletType>;
  onChangeSelected: (tabletId: number, patientName: string, areaName: string) => void;
  onChangeSelectAll: any;
  selected: Array<{
    name: string;
    id: number;
    areaName: string;
  }>;
  isLoading: boolean;
  areaList: any;
  area: Array<string>;
  onDisCharge: (tabletId: number) => void;
}

// 테블릿, 환자 이름 변경 가능 하게
const AdminTable: FC<AdminTableProps> = ({
  onChangeSelectAll,
  getTablet,
  selected,
  onChangeSelected,
  isLoading,
  onDisCharge,
  areaList,
  area,
}) => {
  const { mutate: changeTabletArea } = useChangeTabletArea({ type: "STAFF" });
  const { mutate: changeTabletInfo } = useChangeTabletInfo();
  const queryClient = useQueryClient();

  const handleChangeArea = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const value = event.target.value;
    const areaId = areaList?.find((item: any) => item.name === value)?.id as number;
    changeTabletArea(
      {
        userIds: [id],
        areaId: areaId,
      },
      {
        onSuccess: () => {
          //@ts-ignore
          queryClient.invalidateQueries(["areaListStaff"]);
          toast.success("구역 변경이 완료되었습니다");
        },
        onError: () => {
          toast.error("구역 변경을 실패했습니다");
        },
      },
    );
  };

  const [changedColumns, setChangedColumns] = useState<{ [key: number]: boolean }>({});
  const [tabletData, setTabletData] = useState<any[]>(getTablet);
  const [isChanging, setIsChanging] = useState(false);
  const changeTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isChanging) {
      setTabletData(getTablet);
    }
  }, [getTablet]);

  useEffect(() => {
    if (!isChanging) {
      const tabletIds = Object.keys(changedColumns).map(num => Number(num));

      Promise.all(
        tabletIds.map(tabletId => {
          const updateTabletInfo = tabletData?.find(data => data.tabletId === tabletId);
          return changeTabletInfo({
            tabletIds: [tabletId],
            areaId: updateTabletInfo?.areaId,
            tabletName: updateTabletInfo?.tabletName,
            patientName: updateTabletInfo?.patientName,
          });
        }),
      )
        .then(() => {
          //@ts-ignore
          queryClient.invalidateQueries(["areaListStaff"]);
          toast.success("정보 변경이 완료되었습니다.");
        })
        .catch(() => {
          toast.error("정보 변경에 실패하였습니다.");
        });
    }
  }, [isChanging]);
  useEffect(() => {
    if (!isChanging) {
      setTabletData(getTablet);
    }
  }, [getTablet]);

  const onChangeData = (e: React.ChangeEvent<HTMLInputElement>, tabletId: number, type: string) => {
    setIsChanging(true);
    const { value } = e.currentTarget;

    // 변경된 데이터 추적
    if (type === "patientName") {
      setTabletData(prevTabletData =>
        prevTabletData.map(tablet =>
          tablet.tabletId === tabletId ? { ...tablet, patientName: value } : tablet,
        ),
      );
    }
    if (type === "tabletName") {
      setTabletData(prevTabletData =>
        prevTabletData.map(tablet =>
          tablet.tabletId === tabletId ? { ...tablet, tabletName: value } : tablet,
        ),
      );
    }

    setChangedColumns(prev => ({
      ...prev,
      [tabletId as number]: true,
    }));

    if (changeTimerRef.current) {
      clearTimeout(changeTimerRef.current);
    }

    changeTimerRef.current = setTimeout(() => {
      setIsChanging(false);
    }, 1000);
  };

  return (
    <StTable>
      <thead>
        <InoutTableHedaerTr>
          <th style={{ display: "flex" }}>
            <CCheckBox
              onChange={onChangeSelectAll}
              checked={getTablet?.length > 0 && selected?.length === getTablet?.length}
            />
          </th>
          {columns.map(column => {
            return (
              <InoutTableHeaderTh key={column.id} width={column.width}>
                <p>{column.headerName}</p>
                {column.icon ? column.icon : ""}
              </InoutTableHeaderTh>
            );
          })}
        </InoutTableHedaerTr>
      </thead>
      <tbody>
        {isLoading ? (
          <LoadingLayout>
            <CircularProgress />
          </LoadingLayout>
        ) : (
          <>
            {tabletData?.map(tablet => {
              return (
                <InoutTableBodyTr
                  key={tablet.serialNumber || tablet.tabletId}
                  isSelected={selected?.some(item => item.id === tablet.tabletId)}
                >
                  <InoutTableBodyTd width="28px">
                    <CCheckBox
                      onChange={() =>
                        onChangeSelected(tablet.tabletId, tablet.patientName, tablet.areaName)
                      }
                      checked={selected?.some(item => item.id === tablet.tabletId)}
                    />
                  </InoutTableBodyTd>
                  <InoutTableBodyTd width="144px">
                    <div style={{ width: "100%", height: "36px" }}>
                      <label htmlFor="section"></label>
                      <CInput
                        placeholder={"환자 이름"}
                        value={tablet.patientName}
                        onChange={e => onChangeData(e, tablet.tabletId, "patientName")}
                        variant={"outlined"}
                        disabled={false}
                        id={"section"}
                      />
                    </div>
                  </InoutTableBodyTd>
                  <InoutTableBodyTd width="192px">
                    <ComBoxLayout width={"192px"}>
                      <CComboBox
                        placeholder={"구역"}
                        options={area}
                        isStaff={false}
                        value={tablet.areaName}
                        onChange={e => handleChangeArea(e, tablet.tabletId)}
                      />
                    </ComBoxLayout>
                  </InoutTableBodyTd>
                  <InoutTableBodyTd width="192px">
                    <ComBoxLayout width={"192px"}>
                      <CInput
                        variant={"outlined"}
                        placeholder={"태블릿 이름"}
                        onChange={e => onChangeData(e, tablet.tabletId, "tabletName")}
                        value={tablet.tabletName}
                        disabled={false}
                        id={""}
                      ></CInput>
                    </ComBoxLayout>
                  </InoutTableBodyTd>
                  <InoutTableBodyTd width="96px">
                    {formatDateDash(new Date(tablet.createdAt))}
                  </InoutTableBodyTd>
                  {/* <InoutTableBodyTd width="64px"></InoutTableBodyTd> */}
                  <InoutTableBodyTd width="141px">
                    <CButton
                      buttontype={"impactRed"}
                      onClick={() => {
                        onDisCharge(tablet.tabletId);
                      }}
                    >
                      환자 퇴원 처리
                    </CButton>
                  </InoutTableBodyTd>
                </InoutTableBodyTr>
              );
            })}
          </>
        )}
      </tbody>
    </StTable>
  );
};

export default AdminTable;

const StTable = styled.table`
  width: 100%;
  height: 100%;
  min-height: 773px;

  & thead {
    width: 100%;

    display: flex;
    align-items: start;
    border-bottom: 1px solid #c4c5cc;
  }

  & tbody {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
`;

export const ComBoxLayout = styled.div<{ width: string }>`
  width: ${props => props.width || "100%"};
  height: 36px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 13px;
`;

const InoutTableHedaerTr = styled.tr`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 136.67px;

  padding-left: 24px;
`;

const InoutTableHeaderTh = styled.th<{ width: string }>`
  display: flex;
  align-items: center;
  gap: 4px;
  width: ${props => props.width || "100%"};
  justify-content: center;
  color: ${palette.text.primary};
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
`;

const InoutTableBodyTr = styled.tr<{ isSelected: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 136.67px;
  border-bottom: 1px solid #c4c5cc;
  padding-left: 24px;
  padding-top: 16px;
  padding-bottom: 16px;
  cursor: pointer;
  background-color: ${({ isSelected }) => (isSelected ? "#30b4ff1a" : "#ffffff")};

  &:hover {
    background-color: #30b4ff1a;
  }
`;

const InoutTableBodyTd = styled.td<{ width: string }>`
  display: flex;
  align-items: center;
  gap: 4px;
  width: ${props => props.width || "100%"};
  justify-content: center;
  color: "#000000";
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
`;

const LoadingLayout = styled(Box)({
  width: "100%",
  Height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});
