import styled from "@emotion/styled";
import palette from "@styles/palette";
import { ReactComponent as Delete } from "@/assets/completedRequests/accountDelete.svg";
import AddAreaList from "./AddAreaList";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { TextField } from "@mui/material";
import { GetAreaListResponse, useGetAreaList } from "@hooks/queries/useGetAreaList";
import { useGetWardInfo } from "@hooks/queries";
import InfoModal from "../modal/InfoModal";
import { useBooleanState } from "@toss/react";
import DeleteWarning from "./DeleteWarning";
import useDeleteArea from "@hooks/mutation/useDeleteArea";
import { toast } from "react-toastify";
import { AreaInfo } from "@hooks/mutation/useUpdateAreaInfo";

interface AreaManageTableProps {
  onUpdate: React.Dispatch<SetStateAction<AreaInfo[]>>;
}

type EditedFields = {
  [key: number]: {
    name: string;
    memo: string;
  };
};

export default function AreaManageTable({ onUpdate }: AreaManageTableProps) {
  const { data: areaList, isLoading } = useGetAreaList();
  const { data: wardInfo, isLoading: isGetWardInfoLoading } = useGetWardInfo();

  const { mutate: deleteArea } = useDeleteArea();

  const [isEditingIndex, setIsEditingIndex] = useState<number | null>(null);
  const [isDeleteIndex, setIsDeleteIndex] = useState<number>();

  const [areaNameField, setAreaNameField] = useState<string>("");
  const [areaMemoField, setAreaMemoField] = useState<string>("");
  const [editedFields, setEditedFields] = useState<EditedFields>({});

  const [isOpenCheckDeleteModal, openCheckDeleteModal, closeCheckDeleteModal] = useBooleanState();
  const [isOpenDeleteModal, openDeleteModal, closeDeleteModal] = useBooleanState();

  const nameFieldRef = useRef<HTMLDivElement>(null);
  const memoFieldRef = useRef<HTMLDivElement>(null);

  const updateAreaInfo = (areaId: number, updatedName?: string, updatedMemo?: string) => {
    setEditedFields(prev => ({
      ...prev,
      [areaId]: {
        name: updatedName || prev[areaId]?.name || "",
        memo: updatedMemo || prev[areaId]?.memo || "",
      },
    }));

    onUpdate(prev => {
      const existingIndex = prev.findIndex(area => area.areaId === areaId);

      if (existingIndex !== -1) {
        return prev.map((area, idx) =>
          idx === existingIndex
            ? { ...area, name: updatedName || area.name, memo: updatedMemo || area.memo }
            : area,
        );
      } else {
        return [
          ...prev,
          {
            areaId,
            name: updatedName || "",
            memo: updatedMemo || "",
          },
        ];
      }
    });
  };

  const handleStartEditing = (row: GetAreaListResponse) => {
    setIsEditingIndex(row.id);
    const editedField = editedFields[row.id];
    setAreaNameField(editedField?.name || row.name);
    setAreaMemoField(editedField?.memo || row.memo);
  };

  const handleNameChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    areaId: number,
  ) => {
    const newName = e.target.value;
    setAreaNameField(newName);
    updateAreaInfo(areaId, newName, areaMemoField);
  };

  const handleMemoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    areaId: number,
  ) => {
    const newMemo = e.target.value;
    setAreaMemoField(newMemo);
    updateAreaInfo(areaId, areaNameField, newMemo);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !nameFieldRef.current?.contains(event.target as Node) &&
        !memoFieldRef.current?.contains(event.target as Node)
      ) {
        setIsEditingIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDeleteArea = () => {
    if (!isDeleteIndex) {
      return;
    }
    deleteArea(isDeleteIndex, {
      onSuccess: () => {
        toast.success("구역을 삭제했습니다.");
      },
      onError: error => {
        console.error(error);
        toast.error("구역 삭제에 실패했습니다.");
      },
    });
    closeCheckDeleteModal();
    openDeleteModal();
  };

  if (areaList && isLoading && wardInfo && isGetWardInfoLoading) {
    return <div>로딩 중..</div>;
  }
  return (
    <>
      <InfoModal
        open={isOpenCheckDeleteModal}
        onClose={closeCheckDeleteModal}
        modalType="checkDelete"
        leftText="취소하기"
        rightText="삭제하기"
        onConfirm={() => handleDeleteArea()}
        message={<DeleteWarning />}
      />
      <InfoModal open={isOpenDeleteModal} onClose={closeDeleteModal} modalType="delete" />
      <TableHeader>{wardInfo && wardInfo.wardName}</TableHeader>
      <TableWrapper>
        <Table>
          <tbody>
            {areaList &&
              areaList.map(row => {
                const editedField = editedFields[row.id];
                return (
                  <tr
                    key={row.id}
                    style={{
                      backgroundColor: `${isEditingIndex === row.id ? "#D9DFFF66" : ""}`,
                    }}
                  >
                    <td onDoubleClick={() => handleStartEditing(row)}>
                      {isEditingIndex === row.id ? (
                        <div ref={nameFieldRef}>
                          <StyledTextField
                            size="small"
                            variant="filled"
                            InputProps={{ disableUnderline: true }}
                            backgroundColor="#FFFFFF"
                            value={areaNameField}
                            onChange={e => handleNameChange(e, row.id)}
                          />
                        </div>
                      ) : (
                        <AreaName>{editedField?.name || row.name}</AreaName>
                      )}
                    </td>
                    <td onDoubleClick={() => handleStartEditing(row)}>
                      {isEditingIndex === row.id ? (
                        <div ref={memoFieldRef}>
                          <StyledTextMemoField
                            size="small"
                            variant="filled"
                            InputProps={{
                              disableUnderline: true,
                            }}
                            backgroundColor="#FFFFFF"
                            value={areaMemoField}
                            onChange={e => handleMemoChange(e, row.id)}
                          />
                        </div>
                      ) : (
                        <MemoName>{editedField?.memo || row.memo || "메모 없음"}</MemoName>
                      )}
                    </td>
                    <td
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setIsDeleteIndex(row.id);
                        openCheckDeleteModal();
                      }}
                    >
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
  display: block;
  text-align: center;
  max-width: 181px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
      cursor: pointer;
      text-align: center;
      color: ${palette.text.dark};
      border-bottom: 1px solid ${palette.divider};

      &:nth-of-type(1) {
        width: 181px;
        padding: 19px 12px;
      }

      &:nth-of-type(2) {
        width: 780px;
        height: 44px;
        padding: 0;
        text-align: start;
        vertical-align: middle;
      }

      &:nth-of-type(3) {
        width: 70px;
        color: #c4c5cc;
      }
    }
  }
`;

const MemoName = styled.span`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;

  width: 100%;
  max-height: 44px;
  line-height: 22px;
  padding: 0 8px;
  text-align: start;
`;

const StyledTextField = styled(TextField)<{ backgroundColor: string }>`
  width: 100%;
  padding: 0 12px;

  .MuiInputBase-root {
    height: 20px;
    border-radius: 1px;
    background-color: ${(props: { backgroundColor: string }) =>
      props.backgroundColor || "transparent"};
  }

  .MuiInputBase-input {
    color: black;
    font-size: 14px;
    padding: 8px;
    text-align: center;
  }
`;

const StyledTextMemoField = styled(StyledTextField)`
  padding: 0;

  .MuiInputBase-root {
    padding: 0 9px;
    max-width: 774px;
    min-height: 20px;
  }

  .MuiInputBase-input {
    text-align: start;
    padding: 0;
  }
`;
