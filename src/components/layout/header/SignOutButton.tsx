import { Button } from "@mui/material";
import { ReactComponent as SignOut } from "@assets/signout.svg";
import useSignOut from "@hooks/mutation/useSignout";

export default function SignOutButton() {
  // Todo: 로그아웃
  const { mutate: signOut } = useSignOut();

  return (
    <Button variant="text" startIcon={<SignOut />} onClick={() => signOut()}>
      로그아웃
    </Button>
  );
}
