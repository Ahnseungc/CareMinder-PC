import styled from "@emotion/styled";
import palette from "@styles/palette";
import { ReactComponent as Delete } from "@/assets/completedRequests/accountDelete.svg";
import AddAreaList from "./AddAreaList";
import { useState } from "react";
import { TextField } from "@mui/material";
import { useGetAreaList } from "@hooks/queries/useGetAreaList";
import { useGetWardInfo } from "@hooks/queries";

export default function AreaManageTable() {
  const { data: areaList, isLoading } = useGetAreaList();
  const { data: wardInfo, isLoading: isGetWardInfoLoading } = useGetWardInfo();

  const [isEditingIndex, setIsEditingIndex] = useState<number | null>(null);

  if (areaList && isLoading && wardInfo && isGetWardInfoLoading) {
    return <div>로딩 중..</div>;
  }
  return (
    <>
      <TableHeader>{wardInfo && wardInfo.wardName}</TableHeader>
      <TableWrapper>
        <Table>
          <tbody>
            {areaList &&
              areaList.map((row, index) => {
                return (
                  <tr
                    key={index}
                    style={{
                      backgroundColor: `${isEditingIndex === index ? "#D9DFFF66" : ""}`,
                    }}
                  >
                    <td onDoubleClick={() => setIsEditingIndex(index)}>
                      {isEditingIndex === index ? (
                        <StyledTextField
                          size="small"
                          variant="filled"
                          InputProps={{ disableUnderline: true }}
                          backgroundColor="#FFFFFF"
                          value={row.name}
                        />
                      ) : (
                        <AreaName>{row.name}</AreaName>
                      )}
                    </td>
                    <td>{row.memo ? row.memo : "메모 없음"}</td>
                    <td style={{ cursor: "pointer" }}>
                      <Delete />
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </TableWrapper>
      {wardInfo && <AddAreaList wardId={wardInfo?.id} />}
    </>
  );
}
const TableHeader = styled.div`
  width: 100%;
  padding: 8px 0 8px 22px;
  background-color: #5d6dbe;
  font-size: 16px;
  font-weight: 500;
  color: #ffffff;
  text-align: start;
`;

const TableWrapper = styled.div`
  height: 240px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #5d6dbe;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const AreaName = styled.span`
  padding: 2px 45px;
`;

const Table = styled.table`
  width: 100%;
  height: 100%;
  border-collapse: collapse;
  & tbody {
    width: 100%;
    height: 240px;
    overflow: scroll;
    & tr > td {
      height: 60px;
      padding-bottom: 11.52px;
      padding-top: 11.52px;
      text-align: center;
      color: ${palette.text.dark};
      border-bottom: 1px solid ${palette.divider};

      &:nth-of-type(1) {
        width: 181px;
        cursor: pointer;
        padding: 19px 12px;
      }

      &:nth-of-type(2) {
        width: 780px;
        text-align: start;
      }

      &:nth-of-type(3) {
        width: 70px;
        color: #c4c5cc;
      }
    }
  }
`;

const StyledTextField = styled(TextField)<{ backgroundColor?: string }>`
  padding: 0 12px;

  .MuiInputBase-root {
    height: 21px;
    border-radius: 1px;
    background-color: ${({ backgroundColor }) => backgroundColor || "transparent"};
  }

  .MuiInputBase-input {
    color: black;
    font-size: 14px;
    padding: 8px;
    text-align: center;
  }
`;
