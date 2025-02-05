import { SigninFormData } from "@models/signin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "@libraries/recoil";
import { useNavigate } from "react-router-dom";
import { User, UserType } from "@models/user";
import reqChangePWState from "@libraries/recoil/reqChangePW";
import { handleAllowNotification } from "@components/fcm/notificationPermission";
import adminPendingState from "@libraries/recoil/adminPending";
import wardState from "@libraries/recoil/ward";
import accountActiveState from "@libraries/recoil/accountActive";

const SEVER_URL = import.meta.env.VITE_SEVER_URL;

const signin = async (useInfo: SigninFormData, currentUserState: User) => {
  const res = await axios.post(`${SEVER_URL}/users/login`, useInfo);
  if (res.data.currentUser) {
    const userType: UserType = res.data.currentUser.role;
    switch (userType) {
      case "ADMIN":
        Cookies.set("accessTokenAdmin", res.data.jwtResponse.accessToken);
        Cookies.set("refreshTokenAdmin", res.data.jwtResponse.refreshToken);
        break;
      case "STAFF":
        if (currentUserState?.type === "STAFF") {
          const accessTokenStaff = Cookies.get("accessTokenStaff");
          const res = await axios.post(
            `${SEVER_URL}/users/logout`,
            {},
            {
              headers: {
                Authorization: `Bearer ${accessTokenStaff}`,
              },
            },
          );
          console.log("로그아웃 성공", res);
        }
        Cookies.set("accessTokenStaff", res.data.jwtResponse.accessToken);
        Cookies.set("refreshTokenStaff", res.data.jwtResponse.refreshToken);
        break;
      case "WARD":
        Cookies.set("accessTokenWard", res.data.jwtResponse.accessToken);
        Cookies.set("refreshTokenWard", res.data.jwtResponse.refreshToken);
        break;
    }
  }
  return res.data;
};

export default function useSignin() {
  const navigate = useNavigate();
  const currentUserState = useRecoilValue(userState);
  const setUserState = useSetRecoilState(userState);
  const setWardState = useSetRecoilState(wardState);
  const setAccountActiveState = useSetRecoilState(accountActiveState);
  const setReqChangePWState = useSetRecoilState(reqChangePWState);
  const setAdminPending = useSetRecoilState(adminPendingState);

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userInfo: SigninFormData) => signin(userInfo, currentUserState as User),
    onSuccess: res => {
      queryClient.invalidateQueries({ queryKey: ["useGetWardPatientPending"] });
      console.log("로그인 성공");
      console.log(res);
      if (res.currentUser.role === "WARD") {
        setWardState({
          id: res.currentUser?.accountId,
          name: res.currentUser?.name,
          type: res.currentUser?.role,
        });
      }
      // 추가 응답 API 개발 완료 후
      setUserState({
        id: res.currentUser?.accountId,
        name: res.currentUser?.name,
        type: res.currentUser?.role,
      });

      if (res.currentUser) {
        /** 어드민 계정 생성 직후 케어마인더 측 계정 승인 전 핸들링 */
        if (res.currentUser.requestStatus === "PENDING") {
          setAdminPending(true);
          return;
        }

        // /** 스태프 계정 생성 후 비활성화 상태 핸들링 */
        // if (res.currentUser.role === "STAFF" && res.currentUser.accountStatus === "INACTIVE") {
        //   console.log("비활성화 계정");
        //   setAccountActiveState(true);
        // }

        const userType: UserType = res.currentUser?.role;

        switch (userType) {
          case "ADMIN":
            navigate("/admin");
            break;
          case "STAFF":
            setReqChangePWState(res.currentUser?.passwordChangeRequested);
            setAccountActiveState(res.currentUser?.accountStatus === "INACTIVE");
            navigate("/staff");
            handleAllowNotification();
            break;
          case "WARD":
            navigate("/");
            break;
        }
      }
    },
    onError: error => {
      console.error("로그인 실패:", error);
    },
  });
}

/**
 * No description
 *
 * @tags useSignIn
 * @name AppControllerInitialize
 * @summary 로그인 요청
 * @request POST:
 * @secure /wards/sign-up
 */
