import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { UserType } from "@models/user";
import { userState } from "@libraries/recoil";
import { Box, CircularProgress } from "@mui/material";
// import { useCallbackOnce } from "@toss/react";
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
  // const accessTokenWard = Cookies.get("accessTokenWard");
  const [accessTokenWard, setAccessTokenWard] = useState<string | null>(null);
  const [accessTokenStaff, setAccessTokenStaff] = useState<string | null>(null);
  // const accessTokenStaff = Cookies.get("accessTokenStaff");
  const accessTokenAdmin = Cookies.get("accessTokenAdmin");
  const setUser = useSetRecoilState(userState);
  const setIsModalOpen = useSetRecoilState(modalState);

  // const navigatePrev = useCallbackOnce(() => {
  //   console.error(`접근이 불가능한 경로입니다. (접근 경로: ${pathname}, 권한: ${user?.type})`);
  //   navigate(-1);
  // }, []);

  useEffect(() => {
    const getTokens = async () => {
      //@ts-ignore
      const token = await window.tokenAPI.getTokens();
      //@ts-ignore
      const staffToken = await window.electronStore.get("accessTokenStaff");
      if (token) {
        setAccessTokenWard(token.accessToken);
        setAccessTokenStaff(staffToken);
      }
    };
    getTokens();
  }, []);

  useEffect(() => {
    //스태프 페이지
    if (pathname.includes("staff") && !accessTokenStaff) {
      if (user?.type === "STAFF") {
        navigate("/");
        setIsModalOpen(false);
        setUser(prev => {
          if (!prev) {
            return { id: 0, name: "", type: "WARD" };
          }

          return {
            ...prev,
            type: "WARD",
            id: prev.id,
            name: prev.name,
          };
        });
      } else {
        setIsModalOpen(true);
        setIsChecking(true);
      }
    }

    if (user) {
      //병동 권한 충족
      if (pathname === "/") {
        switch (user.type) {
          case "WARD":
            navigate("/");
            break;
          case "STAFF":
            navigate("/staff");
            break;
          case "ADMIN":
            navigate("/admin");
            break;
          default:
            navigate("/");
        }
      }
      const isCheckPermission = async () => {
        //@ts-ignore
        const token = await window.tokenAPI.getTokens();
        console.log("접근");
        console.log(token);
        console.log(user);
        if (
          (allowedRoles.includes(user.type) && token.accessToken) ||
          (allowedRoles.includes(user.type) && accessTokenStaff) ||
          (allowedRoles.includes(user.type) && accessTokenAdmin)
        ) {
          setIsChecking(false);
          setIsModalOpen(false);
        }
      };
      isCheckPermission();

      if (
        (allowedRoles.includes(user.type) && accessTokenWard) ||
        (allowedRoles.includes(user.type) && accessTokenStaff) ||
        (allowedRoles.includes(user.type) && accessTokenAdmin)
      ) {
        setIsChecking(false);
        setIsModalOpen(false);
      }
      //스태프 페이지 접근
      console.log("accessTokenStaff", accessTokenStaff);
      console.log("accessTokenWard", accessTokenWard);
      if (pathname.includes("staff") && accessTokenWard) {
        setIsModalOpen(true);
      }
    }
  }, [user, allowedRoles, pathname, accessTokenStaff, accessTokenWard, navigate]);

  if (isChecking) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" padding="30px">
        <CircularProgress />
      </Box>
    );
  }

  return <Outlet />;
}
