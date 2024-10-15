import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { UserType } from "@models/user";
import { userState } from "@libraries/recoil";
import { Box, CircularProgress } from "@mui/material";
import { useCallbackOnce } from "@toss/react";
import Cookies from "js-cookie";
import modalState from "@libraries/recoil/modal";

type AuthorizedRouteProps = {
  allowedRoles: UserType[];
};

export default function AuthorizedRoute({ allowedRoles }: AuthorizedRouteProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = useRecoilValue(userState);
  const [isChecking, setIsChecking] = useState(true);
  const accessToken = Cookies.get("accessToken");
  const accessTokenStaff = Cookies.get("accessTokenStaff");
  const setIsModalOpen = useSetRecoilState(modalState);

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
    if (pathname.includes("staff") && !accessTokenStaff) {
      setIsModalOpen(true);
      setIsChecking(true);
    }

    if (user) {
      //병동 권한 충족
      if (
        (allowedRoles.includes(user.type) && accessToken) ||
        (allowedRoles.includes(user.type) && accessTokenStaff)
      ) {
        setIsChecking(false);
        setIsModalOpen(false);
      }
      //스태프 페이지 접근
      if (pathname.includes("staff") && accessToken && !accessTokenStaff) {
        setIsModalOpen(true);
      }
    }
  }, [user, allowedRoles, pathname, accessTokenStaff, accessToken, navigatePrev, navigate]);

  if (isChecking) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" padding="30px">
        <CircularProgress />
      </Box>
    );
  }

  return <Outlet />;
}
