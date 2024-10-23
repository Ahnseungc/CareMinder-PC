import { SigninFormData } from "@models/signin";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/utils/axios/axiosInstance";
import Cookies from "js-cookie";
import { useSetRecoilState } from "recoil";
import { userState } from "@libraries/recoil";
import { useNavigate } from "react-router-dom";

const signin = async (useInfo: SigninFormData) => {
  const res = await axiosInstance.post("/users/login", useInfo);
  if (res.data.accessToken) {
    Cookies.set("accessToken", res.data.accessToken);
    Cookies.set("refreshToken", res.data.refreshToken);
  }
  return res.data;
};

export default function useSignin() {
  const navigate = useNavigate();
  const setUserState = useSetRecoilState(userState);

  return useMutation({
    mutationFn: signin,
    onSuccess: res => {
      console.log("로그인 성공");
      //개발 전
      setUserState({
        id: 0,
        name: "테스트",
        type: "main",
      });
      // 추가 응답 API 개발 완료 후
      // setUserState({
      //   id: res.id,
      //   name: res.name,
      //   type: res.type,
      // });
      navigate("/");
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
