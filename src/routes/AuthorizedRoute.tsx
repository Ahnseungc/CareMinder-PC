import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { UserType } from "@models/user";
import { userState } from "@libraries/recoil";
import { Box, CircularProgress } from "@mui/material";
import { useCallbackOnce } from "@toss/react";
import Cookies from "js-cookie";

type AuthorizedRouteProps = {
  allowedRoles: UserType[];
};

export default function AuthorizedRoute({ allowedRoles }: AuthorizedRouteProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = useRecoilValue(userState);
  const [isChecking, setIsChecking] = useState(true);
  const accessToken = Cookies.get("accessToken");
  const accessTokenAdmin = Cookies.get("accessTokenAdmin");

  const navigatePrev = useCallbackOnce(() => {
    console.error(`접근이 불가능한 경로입니다. (접근 경로: ${pathname}, 권한: ${user?.type})`);
    navigate(-1);
  }, []);

  useEffect(() => {
    //병동
    if (!user && !accessToken) {
      navigate("/sign-in");
    }

    //스태프 페이지
    if (pathname.includes("staff") && !accessTokenAdmin) {
      navigate("/sign-in/admin");
    }

    if (user) {
      //병동 권한 충족
      if (
        (allowedRoles.includes(user.type) && accessToken) ||
        (allowedRoles.includes(user.type) && accessTokenAdmin)
      ) {
        setIsChecking(false);
      }

      //스태프 페이지 접근
      if (pathname.includes("staff") && accessToken && !accessTokenAdmin) {
        navigate("/sign-in/admin");
      }
    }
  }, [user, allowedRoles, pathname, accessTokenAdmin, accessToken, navigatePrev, navigate]);

  if (isChecking) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" padding="30px">
        <CircularProgress />
      </Box>
    );
  }

  return <Outlet />;
}
