import { CMModal, ModalActionButton } from "@components/common";
import { styled, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";

import { CComboBox } from "@components/common/atom/C-ComboBox";
import { ComBoxLayout } from "../adminTable";
import { ReactComponent as GrayCalendar } from "@assets/calendar/calendar-gray.svg";

import CustomEditCalendar from "./edit-calendar";
import { useState } from "react";
import { formatDateDash } from "@utils/getDateform";
import { GetAreaListResponse } from "@hooks/queries/useGetAreaList";
import useEditTabletData from "@hooks/mutation/useEditTabletData";
import { toast } from "react-toastify";

type ValuePiece = Date | null;
export type Value = ValuePiece | [ValuePiece, ValuePiece];
type EditData = { areaId?: number; tabletName?: string; patientName?: string };

const EditModal = ({ onClose, selectList, areaList, refetch, ...props }: any) => {
  const { mutate: editData } = useEditTabletData();
  const data = selectList;
  const pickLength = data.length;

  const [isOpenCalendar, setIsOpenCalendar] = useState(false);
  const [selectCalendar, setSelectCalendar] = useState<Value>(
    pickLength > 1 ? null : new Date(selectList[0].admissionDate),
  );
  const [putEditData, setPutEditData] = useState<EditData>({});

  console.log(selectCalendar);

  const handleChangeArea = (name: string) => {
    const areaId = areaList?.find((item: GetAreaListResponse) => item.name === name)?.id;
    setPutEditData(prev => ({ ...prev, areaId }));
  };

  const findAreaName = (areaId: number) => {
    const areaName = areaList?.find((item: GetAreaListResponse) => item.id === areaId)?.name;
    return areaName;
  };

  const onEditData = () => {
    const tabletIds = selectList.map((el: { id: number }) => el.id);
    const admissionDate = selectCalendar ? formatDateDash(selectCalendar) : undefined;

    const data = {
      tabletIds,
      ...(admissionDate && { admissionDate }),
      ...putEditData,
    };
    editData(data, {
      onSuccess: () => {
        refetch();
        onClose();
      },
      onError: () => {
        toast.error("정보 수정을 실패하였습니다.");
      },
    });
  };

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

          <ModalActionButton hoverColor="#30b3ff55" color="success" onClick={onEditData}>
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
            value={putEditData?.patientName === undefined ? data[0].name : putEditData?.patientName}
            onChange={e => setPutEditData(prev => ({ ...prev, patientName: e.target.value }))}
            sx={{
              "& .MuiInputBase-root": { height: "40px", borderRadius: "6px", marginBottom: "28px" },
            }}
            disabled={pickLength > 1}
          />
          <Text>구역</Text>
          <ComBoxLayout border={true}>
            <CComboBox
              placeholder={"구역"}
              options={areaList.map((el: GetAreaListResponse) => el.name)}
              isStaff={false}
              value={
                putEditData?.areaId === undefined
                  ? findAreaName(data[0].areaId)
                  : findAreaName(putEditData.areaId)
              }
              onChange={e => handleChangeArea(e.target.value)}
            />
          </ComBoxLayout>
          <Text sx={{ marginTop: "30px" }}>태블릿 이름</Text>
          <TextField
            placeholder={"태블릿 이름"}
            value={
              putEditData?.tabletName === undefined ? data[0].tabletName : putEditData?.tabletName
            }
            onChange={e => setPutEditData(prev => ({ ...prev, tabletName: e.target.value }))}
            sx={{
              "& .MuiInputBase-root": { height: "40px", borderRadius: "6px", marginBottom: "28px" },
            }}
          />
          <Text>입원 일자</Text>
          <CalendarField>
            {Array.isArray(selectCalendar)
              ? selectCalendar[0]
                ? formatDateDash(selectCalendar[0])
                : "입원 일자"
              : selectCalendar
                ? formatDateDash(selectCalendar)
                : "입원 일자"}

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
