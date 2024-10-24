import { Button } from "@mui/material";
import { ReactComponent as SignOut } from "@assets/signout.svg";
import useSignOut from "@hooks/mutation/useSignout";
import { useRecoilValue } from "recoil";
import { userState } from "@libraries/recoil";

export default function SignOutButton() {
  const userType = useRecoilValue(userState)?.type;

  console.log(userType);

  const { mutate: signOut } = useSignOut(userType as string);

  return (
    <Button
      variant="text"
      startIcon={<SignOut />}
      onClick={() => signOut()}
      sx={{ color: "#FFFFFF" }}
    >
      로그아웃
    </Button>
  );
}
