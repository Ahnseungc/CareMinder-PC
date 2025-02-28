import { ReactComponent as NewWard } from "@assets/menuIcons/addWard.svg";
import MenuLayout from "./MenuLayout";
import RoutePath from "@routes/routePath";
import { useTranslation } from "react-i18next";

export default function AdminCreateNewWard() {
  const { t } = useTranslation();

  return (
    <MenuLayout
      routePath={RoutePath.AdminCreateWard}
      pageName={t(`병동계정\n관리`)}
      icon={NewWard}
    />
  );
}
