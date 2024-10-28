import { SigninFormData } from "@models/signin";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/utils/axios/axiosInstance";
import Cookies from "js-cookie";
import { useSetRecoilState } from "recoil";
import { userState } from "@libraries/recoil";
import { useNavigate } from "react-router-dom";
import modalState from "@libraries/recoil/modal";

const staffSignin = async (useInfo: SigninFormData) => {
  const res = await axiosInstance.post("/staffs/login", useInfo);

  if (res.data.accessToken) {
    Cookies.set("accessTokenStaff", res.data.accessToken);
    Cookies.set("refreshTokenStaff", res.data.refreshToken);
  }

  return res.data;
};

export default function useStaffSignin() {
  const navigate = useNavigate();
  const setUserState = useSetRecoilState(userState);
  const setIsModal = useSetRecoilState(modalState);

  return useMutation({
    mutationFn: staffSignin,
    onSuccess: res => {
      console.log("스테프 로그인 성공");

      //개발 전
      setUserState({
        id: 0,
        name: "테스트",
        type: "STAFF",
      });
      // 추가 응답 API 개발 완료 후
      // setUserState({
      //   id: res.id,
      //   name: res.name,
      //   type: res.type,
      // });
      setIsModal(false);

      navigate("/staff");
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
