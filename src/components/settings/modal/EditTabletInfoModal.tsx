import { CMModal, CMModalProps, ModalActionButton } from "@components/common";
import { SubmitHandler, useForm } from "react-hook-form";
import { Stack } from "@mui/material";
import EditTabletInputField from "../EditTabletInputField";
import useUpdateTabletInfo from "@hooks/mutation/useUpdateTabletInfo";
import { useRecoilValue } from "recoil";
import tabletListState from "@libraries/recoil/settings/tabletList";
import { toast } from "react-toastify";
import { WardTabledListType } from "@hooks/queries/useGetWardTabletList";

interface EditTabletInfoModalProps extends CMModalProps {
  tabletId?: number;
  tabletData: WardTabledListType | null;
}

export default function EditTableInfoModal({
  onClose,
  tabletId,
  tabletData,
  ...props
}: EditTabletInfoModalProps) {
  const isSelectedTablet = useRecoilValue(tabletListState);
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
    updateTabletInfo(
      {
        tabletIds: tabletId === undefined ? isSelectedTablet : [tabletId],
        areaId: data.area,
        tabletName: data.tabletName,
        patientName: data.patientName,
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

  return (
    <>
      <CMModal
        {...props}
        onClose={() => {
          onClose();
          reset();
        }}
        maxWidth="sm"
        title={"태블릿 병상 정보 수정하기"}
        footer={
          <>
            <ModalActionButton
              color="secondary"
              onClick={() => {
                onClose();
                reset();
              }}
            >
              취소
            </ModalActionButton>
            <ModalActionButton onClick={handleSubmit(onSubmit)}>변경하기</ModalActionButton>
          </>
        }
      >
        <Stack gap={"24px"} sx={{ margin: "20px 88px" }}>
          {fields.map(field => (
            <EditTabletInputField
              key={field.name}
              field={field}
              form={form}
              tabletData={tabletData}
            />
          ))}
        </Stack>
      </CMModal>
    </>
  );
}

/** utils */

export type EditTablet = {
  area: number;
  patientName: string;
  tabletName: string;
};

export type EditTabletField = {
  name: keyof EditTablet;
  label: string;
  placeholder: string;
};

const fields: EditTabletField[] = [
  { name: "area", label: "구역", placeholder: "구역 정보를 입력해주세요." },
  { name: "patientName", label: "환자 이름", placeholder: "환자 이름을 입력해주세요." },
  { name: "tabletName", label: "태블릿 이름", placeholder: "태블릿 이름을 입력해주세요." },
];
