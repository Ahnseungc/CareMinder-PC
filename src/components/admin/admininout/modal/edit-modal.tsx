import { CMModal, CMModalProps, ModalActionButton } from "@components/common";
import { styled, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useQueryClient } from "@tanstack/react-query";
import { CComboBox } from "@components/common/atom/C-ComboBox";
import { ComBoxLayout } from "../adminTable";

const EditModal = ({ onClose, selectList, editSelectList, isGroup, ...props }: any) => {
  const queryClient = useQueryClient();
  const data = isGroup ? selectList : editSelectList;
  const pickLength = data.length;

  return (
    <CMModal
      maxWidth="xs"
      onClose={onClose}
      title={"환자 정보 수정"}
      titleColor="#21262B"
      footer={
        <>
          <ModalActionButton hoverColor="#19181813" color="secondary" onClick={onClose}>
            취소
          </ModalActionButton>

          <ModalActionButton hoverColor="#30b3ff55" color="success" onClick={() => null}>
            변경
          </ModalActionButton>
        </>
      }
      {...props}
    >
      <View sx={{ width: "100%", paddingLeft: "20px", paddingRight: "20px" }}>
        {pickLength > 1 && <GroupSelect> {pickLength}명 선택됨</GroupSelect>}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "start",
            paddingBottom: "10px",
            paddingTop: "20px",
            flexDirection: "column",
          }}
        >
          <Text>이름</Text>
          <TextField
            placeholder={"이름"}
            value={""}
            onChange={() => null}
            sx={{
              "& .MuiInputBase-root": { height: "40px", borderRadius: "6px", marginBottom: "28px" },
            }}
            disabled={pickLength > 1}
          />
          <Text>구역</Text>
          <ComBoxLayout border={true}>
            <CComboBox
              placeholder={"구역"}
              options={["test", "test"]}
              isStaff={false}
              value={"dd" as string}
              onChange={() => null}
            />
          </ComBoxLayout>
          <Text sx={{ marginTop: "30px" }}>태블릿 이름</Text>
          <TextField
            placeholder={"태블릿 이름"}
            value={""}
            onChange={() => null}
            sx={{
              "& .MuiInputBase-root": { height: "40px", borderRadius: "6px", marginBottom: "28px" },
            }}
          />
          <Text>입원 일자</Text>
          <TextField
            placeholder={"입원 일자"}
            value={""}
            onChange={() => null}
            sx={{
              "& .MuiInputBase-root": { height: "40px", borderRadius: "6px", marginBottom: "28px" },
            }}
          />
        </Box>
      </View>
    </CMModal>
  );
};

const Text = styled(Typography)(() => ({
  color: "#000000",
  fontWeight: 600,
  fontSize: 14,
  lineHeight: "19.9px",
  letterSpacing: "-3%",
  marginBottom: "10px",
}));

const View = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
}));
const GroupSelect = styled(Box)(({ theme }) => ({
  color: theme.palette.secondary.main,
  fontWeight: "600",
}));

export default EditModal;
