import { CMModal, ModalActionButton } from "@components/common";
import { styled, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useQueryClient } from "@tanstack/react-query";
import { CComboBox } from "@components/common/atom/C-ComboBox";
import { ComBoxLayout } from "../adminTable";
import { ReactComponent as GrayCalendar } from "@assets/calendar/calendar-gray.svg";

import CustomEditCalendar from "./edit-calendar";
import { useState } from "react";
import { formatDate } from "@utils/getDateform";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const EditModal = ({ onClose, selectList, editSelectList, isGroup, ...props }: any) => {
  const [isOpenCalendar, setIsOpenCalendar] = useState(false);
  const [selectCalendar, setSelectCalendar] = useState<Value>(new Date());
  const data = isGroup ? selectList : editSelectList;
  const pickLength = data.length;

  console.log(editSelectList);

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
            value={editSelectList.length === 1 ? editSelectList[0].name : "2명 이상 선택중"}
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
          <CalendarField>
            {selectCalendar instanceof Date && formatDate(selectCalendar)}
            <GrayCalendar
              style={{ cursor: "pointer" }}
              onClick={() => setIsOpenCalendar(prev => !prev)}
            />
          </CalendarField>
          {isOpenCalendar && (
            <CustomEditCalendar value={selectCalendar} setState={setSelectCalendar} />
          )}
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
  position: "relative",
}));
const GroupSelect = styled(Box)(({ theme }) => ({
  color: theme.palette.secondary.main,
  fontWeight: "600",
}));

const CalendarField = styled("div")(({ theme }) => ({
  position: "relative",
  width: "100%",
  height: "40px",
  borderRadius: "6px",
  marginBottom: "28px",
  display: "flex",
  alignItems: "center",
  padding: "0 20px",
  justifyContent: "space-between",
  border: `1px solid ${theme.palette.action.disabled}`,
}));

export default EditModal;
