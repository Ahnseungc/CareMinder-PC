import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/utils/axios/axiosInstance";
import Cookies from "js-cookie";
import { useSetRecoilState } from "recoil";
import { userState } from "@libraries/recoil";

const signOut = async (type: string) => {
  const res = await axiosInstance.post(`/${type}/logout`);
  if (res.data.accessToken && res.data.refreshToken) {
    Cookies.set("accessToken", "");
  }
  return res.data;
};

export default function useSignOut(type: string) {
  const setUserState = useSetRecoilState(userState);
  return useMutation({
    mutationFn: () => signOut(type),
    onSuccess: () => {
      console.log("로그아웃 성공");
      setUserState(null);
    },
    onError: error => {
      console.error("로그아웃 실패:", error);
    },
  });
}

/**
 * No description
 *
 * @tags useSignout
 * @name AppControllerInitialize
 * @summary 로그아웃 요청
 * @request POST:
 * @secure /staff/logout
 */
