import ActionButton from "@components/signin/ActionButton";
import CreateAdminModal from "./Modal/CreateAdminModal";
import { useBooleanState } from "@toss/react";
import { useTranslation } from "react-i18next";

export default function CreateAdminButton() {
  const [open, openCreateModal, closeCreateModal] = useBooleanState(false);
  const { t } = useTranslation();

  return (
    <>
      <ActionButton onClick={openCreateModal}>{t("어드민 계정 생성")}</ActionButton>
      <CreateAdminModal open={open} onClose={closeCreateModal} />
    </>
  );
}
