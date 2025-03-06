import CButton from "@components/common/atom/C-Button";
import StaffSettingsModal from "@components/signin/staff/StaffSettingsModal";
import useGetStaffInfo from "@hooks/queries/useGetStaffInfo";
import { useBooleanState } from "@toss/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function StaffSettingsPage() {
  const { data } = useGetStaffInfo();
  const [isOpen, openModal, closeModal] = useBooleanState();
  const { t } = useTranslation();

  useEffect(() => {
    openModal();
  }, [openModal]);

  if (!data) {
    return;
  }

  return (
    <>
      <CButton onClick={openModal} buttontype="primarySecond" style={{ width: "300px" }}>
        {t("스태프 정보 변경")}
      </CButton>
      <StaffSettingsModal open={isOpen} onClose={closeModal} staffInfo={data} />
    </>
  );
}
