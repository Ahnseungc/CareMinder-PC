import { CMModal, CMModalProps, ModalActionButton } from "@components/common";
import { styled, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { ReactComponent as DeleteBig } from "@/assets/delete.svg";

interface ChargeModalProps extends Omit<CMModalProps, "title"> {
  onDelete: any;
}

const DeleteModal = ({ onClose, onDelete, ...props }: ChargeModalProps) => {
  return (
    <CMModal
      maxWidth="xs"
      onClose={onClose}
      title={""}
      footer={
        <>
          <ModalActionButton hoverColor="#30b3ff55" color="success" onClick={onDelete}>
            삭제하기
          </ModalActionButton>
          <ModalActionButton hoverColor="#19181813" color="secondary" onClick={onClose}>
            취소
          </ModalActionButton>
        </>
      }
      {...props}
    >
      <View>
        <DeleteBig />
        <Text>해당 메모를 삭제하시겠습니까?</Text>
      </View>
    </CMModal>
  );
};

const Text = styled(Typography)(() => ({
  color: "#000000",
  fontWeight: 700,
  fontSize: 18,
  textAlign: "center",
  lineHeight: "26px",
  letterSpacing: "-3%",
  margin: "20px 0",
}));

const View = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  margin: "10px 0  0 0",
}));

export default DeleteModal;
