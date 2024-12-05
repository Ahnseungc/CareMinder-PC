import { CMModal, CMModalProps, ModalActionButton } from "@components/common";
import { ReactComponent as X } from "@/assets/x-Icon.svg";
import { Typography } from "@mui/material";
import styled from "@emotion/styled";
import AreaManageTable from "../areaManage/AreaManageTable";

export default function AreaManageModal({ onClose, ...props }: CMModalProps) {
  return (
    <CMModal
      maxWidth="xl"
      title={"구역 관리하기"}
      onClose={onClose}
      footer={
        <>
          <ModalActionButton color="secondary" onClick={onClose}>
            취소
          </ModalActionButton>
          <ModalActionButton onClick={() => null}>변경하기</ModalActionButton>
        </>
      }
      {...props}
    >
      <X
        style={{ position: "absolute", right: "24px", top: "28px", cursor: "pointer" }}
        onClick={onClose}
      />
      <ContentWrapper>
        <Typography
          variant="h4"
          sx={{ color: "#878787", fontSize: "16px", fontWeight: "500", margin: "40px 0 " }}
        >
          구역 관리에서는 구역 이름을 더블 클릭해 수정하고, 구역을 추가하거나 삭제할 수 있습니다.{" "}
          <br />
          또한, 메모란에 각 구역의 호실 이름이나 기타 메모를 입력할 수 있습니다.
          <br />
          해당 메모는 현 팝업(구역 관리하기)에서만 확인이 가능합니다.
        </Typography>
        <AreaManageTable />
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
