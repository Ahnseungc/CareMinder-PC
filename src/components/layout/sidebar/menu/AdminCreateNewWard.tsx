import { ReactComponent as NewWard } from "@assets/menuIcons/addWard.svg";
import MenuLayout from "./MenuLayout";

export default function AdminCreateNewWard() {
  return <MenuLayout routePath={"*"} pageName={`스태프\n계정 관리`} icon={NewWard} />;
}
