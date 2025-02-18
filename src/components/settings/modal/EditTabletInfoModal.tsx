import styled from "@emotion/styled";
import EditTabletInputField from "../EditTabletInputField";
import useUpdateTabletInfo from "@hooks/mutation/useUpdateTabletInfo";
import tabletListState from "@libraries/recoil/settings/tabletList";
import palette from "@styles/palette";
import CSwitch from "@components/common/atom/C-Switch";

import { CMModal, CMModalProps, ModalActionButton } from "@components/common";
import { SubmitHandler, useForm } from "react-hook-form";
import { Divider, Stack, Typography } from "@mui/material";
import { useRecoilValue } from "recoil";
import { toast } from "react-toastify";
import { WardTabledListType } from "@hooks/queries/useGetWardTabletList";

import TabletSelect from "../tabletManage/TabletSelect";
import TabletTimeInput from "../tabletManage/TabletTimeInput";
import { useEffect, useState } from "react";

interface EditTabletInfoModalProps extends CMModalProps {
  tabletId?: number;
  tabletData: WardTabledListType | null;
}

const TABLET_STATUS = ["강제종료", "요청만 가능", "전체가능"];
const LIMIT_SETTING = ["강제종료", "요청만 가능"];

export default function EditTableInfoModal({
  onClose,
  tabletId,
  tabletData,
  ...props
}: EditTabletInfoModalProps) {
  const isSelectedTablet = useRecoilValue(tabletListState);
  const [switchState, setSwitchState] = useState<boolean>(false);
  const [tabletStatus, setTabletStatus] = useState<string>("");
  const [sleepSimpleMode, setSleepSimpleMode] = useState<string>("");
  const [startHour, setStartHour] = useState<number>(0);
  const [startMinute, setStartMinute] = useState<number>(0);
  const [endHour, setEndHour] = useState<number>(0);
  const [endMinute, setEndMinute] = useState<number>(0);

  useEffect(() => {
    if (!tabletData) {
      return;
    }
    setSwitchState(tabletData.sleepModeSimple.type === null ? false : true);
  }, [tabletData, onClose]);

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSwitchState(event.target.checked);
  };

  const form = useForm<EditTablet>({
    defaultValues: {
      area: 0,
      patientName: "",
      tabletName: "",
    },
    mode: "onChange",
  });
  const { handleSubmit, reset } = form;

  const { mutate: updateTabletInfo } = useUpdateTabletInfo();

  const onSubmit: SubmitHandler<EditTablet> = data => {
    if (!tabletData) {
      return;
    }

    const tabletStatusType =
      tabletStatus === "강제종료"
        ? "FORCE_TERMINATE"
        : tabletStatus === "요청만 가능"
          ? "REQUEST_ONLY"
          : "FULL_ACCESS";

    const sleepSimpleModeType =
      sleepSimpleMode === "강제종료"
        ? "FORCE_TERMINATE"
        : sleepSimpleMode === "요청만 가능"
          ? "REQUEST_ONLY"
          : null;

    updateTabletInfo(
      {
        tabletIds: tabletId === undefined ? isSelectedTablet : [tabletId],
        areaId: data.area,
        tabletName: data.tabletName,
        patientName: data.patientName,
        featureRestrictionType: tabletStatusType,
        sleepModeSimple: {
          startHour: startHour,
          startMinute: startMinute,
          endHour: endHour,
          endMinute: endMinute,
          type: sleepSimpleModeType,
        },
        admissionDate: tabletData?.admissionAt,
      },
      {
        onSuccess: () => {
          toast.success("태블릿 정보 변경이 완료되었습니다.");
          onClose();
        },
        onError: () => {
          toast.error("태블릿 정보 변경 중 오류가 발생했습니다.");
        },
      },
    );
  };

  if (!tabletData) {
    return null;
  }

  return (
    <>
      <CMModal
        {...props}
        onClose={() => {
          onClose();
          setSwitchState(tabletData?.sleepModeSimple.type === null ? false : true);
          reset();
        }}
        maxWidth="sm"
        sx={{
          "height": "80%",
          "margin": "auto",
          "& .MuiDialog-paper": {
            overflowY: "hidden",
          },
        }}
        title={"태블릿 관리"}
        footer={
          <>
            <ModalActionButton
              color="secondary"
              onClick={() => {
                onClose();
                setSwitchState(tabletData?.sleepModeSimple.type === null ? false : true);
                reset();
              }}
            >
              취소
            </ModalActionButton>
            <ModalActionButton onClick={handleSubmit(onSubmit)}>변경하기</ModalActionButton>
          </>
        }
      >
        {isSelectedTablet.length > 1 && (
          <Typography
            variant="body2"
            sx={{ textAlign: "center", color: `${palette.primary.main}`, fontWeight: 600 }}
          >
            {isSelectedTablet.length}명 선택됨
          </Typography>
        )}

        <Stack gap={"20px"} sx={{ margin: "20px 88px" }}>
          {fields.map(field => (
            <EditTabletInputField
              key={field.name}
              field={field}
              form={form}
              tabletData={tabletData}
            />
          ))}

          <Divider component="div" sx={{ marginTop: "10px", marginBottom: "10px" }} />

          <Typography sx={{ fontWeight: 600, fontSize: "16px", color: `${palette.text.dark}` }}>
            태블릿 상태
          </Typography>

          <TabletSelect
            value={tabletData?.featureRestrictionType}
            option={TABLET_STATUS}
            onSelect={setTabletStatus}
          />

          <Typography sx={{ fontWeight: 600, fontSize: "16px", color: `${palette.text.dark}` }}>
            수면제한
          </Typography>

          <SleepModeContainer>
            <SleepControlBox>
              <SleepMenuText>사용</SleepMenuText>
              <CSwitch checked={switchState} onChange={handleSwitchChange} onText="" offText="" />
            </SleepControlBox>

            {switchState && (
              <>
                <SleepControlBox>
                  <SleepMenuText>시작 시간</SleepMenuText>
                  <TabletTimeInput
                    hourValue={startHour}
                    minuteValue={startMinute}
                    onHourChange={setStartHour}
                    onMinuteChange={setStartMinute}
                  />
                </SleepControlBox>
                <SleepControlBox>
                  <SleepMenuText>종료 시간</SleepMenuText>
                  <TabletTimeInput
                    hourValue={endHour}
                    minuteValue={endMinute}
                    onHourChange={setEndHour}
                    onMinuteChange={setEndMinute}
                  />
                </SleepControlBox>
                <SleepControlBox>
                  <SleepMenuText>제한 설정</SleepMenuText>
                  <div style={{ width: "300px", height: "40px" }}>
                    <TabletSelect
                      value={tabletData.sleepModeSimple.type}
                      option={LIMIT_SETTING}
                      onSelect={setSleepSimpleMode}
                    />
                  </div>
                </SleepControlBox>
              </>
            )}
          </SleepModeContainer>
        </Stack>
      </CMModal>
    </>
  );
}

/** utils */

export type EditTablet = {
  tabletName: string;
  area: number;
  patientName: string;
};

export type EditTabletField = {
  name: keyof EditTablet;
  label: string;
  placeholder: string;
};

const fields: EditTabletField[] = [
  { name: "tabletName", label: "태블릿 이름", placeholder: "태블릿 이름을 입력해주세요." },
  { name: "area", label: "구역", placeholder: "구역 정보를 입력해주세요." },
  { name: "patientName", label: "환자 이름", placeholder: "환자 이름을 입력해주세요." },
];

/** styles */

const SleepModeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 66px;
`;

const SleepControlBox = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const SleepMenuText = styled.p`
  width: 64px;
  font-size: 14px;
  font-weight: 600;
  color: #949599;
`;
