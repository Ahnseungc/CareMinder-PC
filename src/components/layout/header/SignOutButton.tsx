import { Button } from "@mui/material";
import { ReactComponent as SignOut } from "@assets/signout.svg";
import useSignOut from "@hooks/mutation/useSignout";
import { useRecoilValue } from "recoil";
import { userState } from "@libraries/recoil";
import { UserType } from "@models/user";
import { useTranslation } from "react-i18next";

export default function SignOutButton() {
  const userType = useRecoilValue(userState)?.type;

  const { mutate: signOut } = useSignOut(userType as UserType);
  const { t } = useTranslation();

  return (
    <Button
      variant="text"
      startIcon={<SignOut />}
      onClick={() => signOut()}
      sx={{ color: "#FFFFFF" }}
    >
      {t("로그아웃")}
    </Button>
  );
}
