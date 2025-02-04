import { userState } from "@libraries/recoil";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import Cookies from "js-cookie";
import { Box, CircularProgress } from "@mui/material";
import { isElectron } from "@utils/isElectron";
import wardState from "@libraries/recoil/ward";

const AuthenticatedSignIn = () => {
  const setUserState = useSetRecoilState(userState);
  const setWardState = useSetRecoilState(wardState);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (isElectron()) {
      const handleMessage = (event: MessageEvent) => {
        console.log("Electron 받은 메세지 :", event.data);
        const userInfo = event.data;
        setUserState(userInfo.user);
        setWardState(userInfo.wardState);
        if (userInfo.type === "WARD") {
          Promise.all([
            Cookies.set("accessTokenWard", userInfo.token.accessToken),
            Cookies.set("refreshTokenWard", userInfo.token.refreshToken),
          ]).then(() => {
            setIsChecking(false);
          });
        }
      };
      window.addEventListener("message", handleMessage);
      return () => {
        window.removeEventListener("message", handleMessage);
      };
    } else {
      setIsChecking(false);
    }
  }, []);

  if (isChecking) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" padding="30px">
        <CircularProgress />
      </Box>
    );
  }
  return <Outlet />;
};

export default AuthenticatedSignIn;
