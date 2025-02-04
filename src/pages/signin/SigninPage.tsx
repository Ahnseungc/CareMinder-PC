import { Thumbnail, SigninLayout } from "@components/signin";
import { userState } from "@libraries/recoil";
import { Box, CircularProgress, Grid, Link } from "@mui/material";
import RoutePath from "@routes/routePath";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";

export default function SigninPage() {
  const user = useRecoilValue(userState);
  const accessToken = Cookies.get("accessTokenWard");
  const navigate = useNavigate();
  const [isCheck, setIsCheck] = useState(true);

  //electron
  // const setUserState = useSetRecoilState(userState);
  // useEffect(() => {
  //   const handleMessage = (event: MessageEvent) => {
  //     console.log("Electron 받은 메세지 :", event.data);
  //     const userInfo = event.data;
  //     setUserState(userInfo.user);
  //     if (userInfo.type === "WARD") {
  //       Cookies.set("accessTokenWard", userInfo.token.accessToken);
  //       Cookies.set("refreshTokenWard", userInfo.token.refreshToken);
  //       window.location.reload();
  //     }
  //   };
  //   window.addEventListener("message", handleMessage);
  //   return () => {
  //     window.removeEventListener("message", handleMessage);
  //   };
  // }, []);

  useEffect(() => {
    if (user && accessToken) {
      navigate("/");
    } else {
      setIsCheck(false); // 확인 완료 시 로딩 종료
    }
  }, []);
  if (isCheck) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" padding="30px">
        <CircularProgress />
      </Box>
    );
  }

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
