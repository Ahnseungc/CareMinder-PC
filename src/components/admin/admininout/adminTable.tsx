import { FC } from "react";
import styled from "@emotion/styled";
import palette from "@styles/palette";
import { Box, CircularProgress, SvgIcon } from "@mui/material";
import { WardTabletType } from "@models/ward-tablet";
import { ReactComponent as FilterIcon } from "@/assets/filter-icon.svg";
import { ReactComponent as Pencil } from "@/assets/pencil.svg";
import { ReactComponent as HomeIcon } from "@/assets/home.svg";
import { ReactComponent as FilterVerticalIcon } from "@/assets/filter-vertical-icon.svg";
import { formatDateDash } from "@utils/getDateform";
//@ts-ignore
import { GetAreaListResponse } from "@hooks/queries/useGetAreaList";
import CCheckBox from "@components/common/atom/C-CheckBox";
import { ReactComponent as MemoIcon } from "@assets/memo-icon.svg";

const columnsHeader = [
  { id: 0, field: "PatientName", headerName: "환자", icon: <FilterVerticalIcon />, width: "8.31%" },
  { id: 1, field: "Section", headerName: "구역", icon: <FilterIcon />, width: "14.08%" },
  {
    id: 2,
    field: "TableName",
    headerName: "태블릿 이름",
    icon: <FilterVerticalIcon />,
    width: "11.08%",
  },
  {
    id: 3,
    field: "TableName",
    headerName: "입원일자",
    icon: <FilterVerticalIcon />,
    width: "8.54%",
  },
  { id: 4, field: "TableName", headerName: "메모 보기", width: "8.69%" },
  { id: 5, field: "TableName", headerName: "환자 정보 수정하기", width: "8.69%" },
  { id: 6, field: "TableName", headerName: "퇴원 처리 하기", width: "8.14%" },
];

interface AdminTableProps {
  isLoading: boolean;
  getTablet: Array<WardTabletType>;
  onChangeSelected: (
    tabletId: number,
    patientName: string,
    areaId: number,
    tabletName: string,
    admissionDate: string,
  ) => void;
  onChangeSelectAll: any;
  selected: Array<{
    name: string;
    id: number;
    areaId: number;
  }>;

  onDisCharge: (tabletId: number) => void;
  handleMemoModal: (patientId: number, patientName: string) => void;
  handleEditPatient: any;
}

const AdminTable: FC<AdminTableProps> = ({
  onChangeSelectAll,
  getTablet,
  selected,
  onChangeSelected,
  isLoading,
  onDisCharge,

  handleMemoModal,
  handleEditPatient,
}) => {
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
          {columnsHeader.map(column => {
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
            {getTablet?.map(tablet => {
              return (
                <InoutTableBodyTr
                  key={tablet.tabletId}
                  isSelected={selected?.some(item => item.id === tablet.tabletId)}
                >
                  <InoutTableBodyTd width="1.62%">
                    <CCheckBox
                      onChange={() =>
                        onChangeSelected(
                          tablet.tabletId,
                          tablet.patientName,
                          tablet.areaName,
                          tablet.tabletName,
                          tablet.createdAt,
                        )
                      }
                      checked={selected?.some(item => item.id === tablet.tabletId)}
                    />
                  </InoutTableBodyTd>
                  <InoutTableBodyTd width={columnsHeader[0].width}>
                    {tablet.patientName}
                  </InoutTableBodyTd>
                  <InoutTableBodyTd width={columnsHeader[1].width}>
                    {tablet.areaName}
                  </InoutTableBodyTd>
                  <InoutTableBodyTd width={columnsHeader[2].width}>
                    {tablet.tabletName}
                  </InoutTableBodyTd>
                  <InoutTableBodyTd width={columnsHeader[3].width}>
                    {tablet.createdAt === undefined
                      ? "미지정"
                      : formatDateDash(new Date(tablet.createdAt))}
                  </InoutTableBodyTd>
                  <InoutTableBodyTd width={columnsHeader[4].width}>
                    <SvgIcon
                      component={MemoIcon}
                      onClick={() => {
                        onChangeSelected(
                          tablet.tabletId,
                          tablet.patientName,
                          tablet.areaId,
                          tablet.tabletName,
                          tablet.createdAt,
                        );
                        handleMemoModal(tablet.patientId, tablet.patientName);
                      }}
                    />
                  </InoutTableBodyTd>
                  <InoutTableBodyTd width={columnsHeader[5].width}>
                    <Pencil
                      onClick={() => {
                        onChangeSelected(
                          tablet.tabletId,
                          tablet.patientName,
                          tablet.areaId,
                          tablet.tabletName,
                          tablet.createdAt,
                        );
                        handleEditPatient();
                      }}
                    />
                  </InoutTableBodyTd>
                  <InoutTableBodyTd width={columnsHeader[6].width}>
                    <HomeIcon
                      onClick={() => {
                        onDisCharge(tablet.tabletId);
                      }}
                    />
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
  table-layout: fixed;

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

export const ComBoxLayout = styled.div<{ width?: string; border?: true }>`
  width: ${props => props.width || "100%"};
  height: 36px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 13px;
  border: ${props => props.border && "1px solid rgb(212, 213, 218)"};
  border-radius: 8px;
`;

const InoutTableHedaerTr = styled.tr`
  width: 100%;
  display: flex;
  align-items: center;
  /* gap: 136.67px; */
  justify-content: center;
  justify-content: space-between;
  padding-left: 24px;
  padding-right: 32px;
`;

const InoutTableHeaderTh = styled.th<{ width: string }>`
  display: flex;
  align-items: center;
  /* gap: 4px; */
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
  /* gap: 136.67px; */
  justify-content: space-between;
  /* justify-content: center; */
  border-bottom: 1px solid #c4c5cc;
  padding-left: 24px;
  padding-right: 32px;
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
