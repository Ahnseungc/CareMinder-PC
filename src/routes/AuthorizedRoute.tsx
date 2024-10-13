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

  const navigatePrev = useCallbackOnce(() => {
    console.error(`접근이 불가능한 경로입니다. (접근 경로: ${pathname}, 권한: ${user?.type})`);
    navigate(-1);
  }, []);

  useEffect(() => {
    if (!user || !accessToken) {
      navigate("/sign-in");
    }
    if (user && allowedRoles.includes(user.type) && accessToken) {
      setIsChecking(false);
    } else if (user && pathname.includes("staff") && accessToken) {
      navigate("/sign-in/admin");
    } else {
      navigatePrev();
    }
  }, [user, allowedRoles, pathname, accessToken, navigatePrev, navigate]);

  if (isChecking) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" padding="30px">
        <CircularProgress />
      </Box>
    );
  }

  return <Outlet />;
}
