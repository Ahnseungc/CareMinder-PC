import { Thumbnail, SigninLayout } from "@components/signin";
import { userState } from "@libraries/recoil";
import { Grid, Link } from "@mui/material";
import RoutePath from "@routes/routePath";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

export default function SigninPage() {
  const user = useRecoilValue(userState);
  const accessToken = Cookies.get("accessTokenWard");
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (user && accessToken) {
  //     console.error(`접근이 불가능한 경로입니다.`);
  //     navigate(-1);
  //   }
  // }, []);
  useEffect(() => {
    if (user && accessToken) {
      navigate("/");
    }
  }, []);

  return (
    <Grid container>
      <Thumbnail />
      <SigninLayout
        type="WARD"
        footer={
          <Link href={RoutePath.AdminSignin} variant="h3">
            어드민 계정 로그인
          </Link>
        }
      />
    </Grid>
  );
}
