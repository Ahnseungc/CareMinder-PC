import { ReactComponent as NewWard } from "@assets/menuIcons/addWard.svg";
import MenuLayout from "./MenuLayout";
import RoutePath from "@routes/routePath";

export default function AdminCreateNewWard() {
  return (
    <MenuLayout routePath={RoutePath.AdminCreateWard} pageName={`병동계정\n생성`} icon={NewWard} />
  );
}
