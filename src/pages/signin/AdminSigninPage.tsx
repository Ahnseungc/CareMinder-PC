import { Thumbnail, CreateAdminButton, SigninLayout } from "@components/signin";
import { userState } from "@libraries/recoil";
import { Grid, Link } from "@mui/material";
import RoutePath from "@routes/routePath";
import { useRecoilValue } from "recoil";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function AdminSigninPage() {
  const user = useRecoilValue(userState);
  const accessToken = Cookies.get("accessTokenAdmin");
  const navigate = useNavigate();

  useEffect(() => {
    if (user && accessToken) {
      console.error(`접근이 불가능한 경로입니다.`);
      navigate(-1);
    }
  }, []);

  return (
    <Grid container>
      <Thumbnail isAdmin />
      <SigninLayout
        type="admin"
        footer={
          <Link href={RoutePath.Signin} variant="h3">
            병동 계정 로그인
          </Link>
        }
        options={<CreateAdminButton />}
      />
    </Grid>
  );
}
