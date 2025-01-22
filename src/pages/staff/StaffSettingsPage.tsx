import CButton from "@components/common/atom/C-Button";
import StaffSettingsModal from "@components/signin/staff/StaffSettingsModal";
import useGetStaffInfo from "@hooks/queries/useGetStaffInfo";
import { useBooleanState } from "@toss/react";
import { useEffect } from "react";

export default function StaffSettingsPage() {
  const { data } = useGetStaffInfo();
  const [isOpen, openModal, closeModal] = useBooleanState();

  useEffect(() => {
    openModal();
  }, [openModal]);

  if (!data) {
    return;
  }

  return (
    <>
      <CButton onClick={openModal} buttontype="primarySecond">
        스태프 정보 변경
      </CButton>
      <StaffSettingsModal open={isOpen} onClose={closeModal} staffInfo={data} />
    </>
  );
}
