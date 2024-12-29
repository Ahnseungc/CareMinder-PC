import { CMModal, CMModalProps, ModalActionButton } from "@components/common";
import { ReactComponent as X } from "@/assets/x-Icon.svg";
import { Typography } from "@mui/material";
import styled from "@emotion/styled";
import AreaManageTable from "../areaManage/AreaManageTable";
import { useState } from "react";
import useUpdateAreaInfo, { AreaInfo } from "@hooks/mutation/useUpdateAreaInfo";
import { toast } from "react-toastify";
import { useGetAreaList } from "@hooks/queries/useGetAreaList";
import { useGetWardAreaLists } from "@hooks/queries/useGetWardAreaLists";
import useUpdateWardAreaLists from "@hooks/mutation/useUpdateWardAreaLists";
import { useRecoilState } from "recoil";
import { editedWardNamesState } from "@libraries/recoil/editWardNames";

interface AreaManageModalProps extends CMModalProps {
  isAdmin?: boolean;
  title?: string;
}

export default function AreaManageModal({
  onClose,
  isAdmin = false,
  title = "구역 관리하기",
  ...props
}: AreaManageModalProps) {
  const [areaData, setAreaData] = useState<AreaInfo[]>([]);
  const [editedWardNames, setEditedWardNames] = useRecoilState(editedWardNamesState);

  const { data: areaList, isLoading: areaListLoading } = useGetAreaList();
  const { data: wardAreaLists, isLoading: wardAreaListsLoading } = useGetWardAreaLists();
  const { mutate: updateAreaInfo } = useUpdateAreaInfo();
  const { mutate: updateWardAreaLists } = useUpdateWardAreaLists();

  const handleUpdateArea = () => {
    updateAreaInfo(areaData, {
      onSuccess: () => {
        toast.success("구역 정보를 변경했습니다");
      },
      onError: error => {
        toast.error("구역 정보 변경에 실패했습니다.");
        console.error(error);
      },
    });
  };

  if (!areaList) {
    return;
  }

  if (!wardAreaLists) {
    return;
  }

  const handleUpdateWardAreaList = () => {
    if (Object.keys(editedWardNames).length > 0 && areaData.length === 0) {
      const filteredData = wardAreaLists
        .filter(ward => editedWardNames[ward.wardId])
        .map(ward => ({
          ...ward,
          wardName: editedWardNames[ward.wardId],
        }));

      updateWardAreaLists(
        { wards: filteredData },
        {
          onSuccess: () => {
            toast.success("구역 정보를 변경했습니다.");
          },
          onError: error => {
            console.error(error);
          },
        },
      );
      return;
    }

    const filteredData = wardAreaLists
      .map(ward => {
        const updatedWard = editedWardNames[ward.wardId]
          ? { ...ward, wardName: editedWardNames[ward.wardId] }
          : ward;

        return {
          ...updatedWard,
          areas: ward.areas
            .filter(area => areaData.some(updated => updated.areaId === area.areaId))
            .map(area => {
              const updatedArea = areaData.find(updated => updated.areaId === area.areaId);
              if (updatedArea) {
                return {
                  ...area,
                  areaName: updatedArea.name,
                  memo: updatedArea.memo,
                };
              }
              return area;
            }),
        };
      })
      .filter(ward => ward.areas.length > 0);

    updateWardAreaLists(
      { wards: filteredData },
      {
        onSuccess: () => {
          toast.success("구역 정보를 변경했습니다.");
        },
        onError: error => {
          console.error(error);
        },
      },
    );
  };

  return (
    <CMModal
      maxWidth="xl"
      title={title}
      onClose={() => {
        onClose();
        setEditedWardNames({});
      }}
      footer={
        <>
          <ModalActionButton
            color="secondary"
            hoverColor={`${isAdmin ? "#5DB8BE22" : ""}`}
            onClick={() => {
              onClose();
              setEditedWardNames({});
            }}
          >
            취소
          </ModalActionButton>
          <ModalActionButton
            onClick={isAdmin ? handleUpdateWardAreaList : handleUpdateArea}
            color={isAdmin ? "info" : "primary"}
          >
            변경하기
          </ModalActionButton>
        </>
      }
      {...props}
    >
      <X
        style={{ position: "absolute", right: "24px", top: "28px", cursor: "pointer" }}
        onClick={() => {
          onClose();
          setEditedWardNames({});
        }}
      />
      <ContentWrapper>
        <Typography
          variant="h4"
          sx={{ color: "#878787", fontSize: "16px", fontWeight: "500", margin: "40px 0 " }}
        >
          {`${isAdmin ? "병동/구역 관리에서는 병동 또는 구역 이름을" : "구역 관리에서는 구역 이름을"} 더블 클릭해 수정하고, 구역을 추가하거나 삭제할 수 있습니다.`}
          <br />
          또한, 메모란에 각 구역의 호실 이름이나 기타 메모를 입력할 수 있습니다.
          <br />
          해당 메모는 현 팝업(구역 관리하기)에서만 확인이 가능합니다.
        </Typography>
        <AreaManageTable
          onUpdate={setAreaData}
          areaList={isAdmin ? wardAreaLists : areaList}
          isLoading={isAdmin ? wardAreaListsLoading : areaListLoading}
        />
      </ContentWrapper>
    </CMModal>
  );
}

const ContentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-bottom: 40px;
`;
