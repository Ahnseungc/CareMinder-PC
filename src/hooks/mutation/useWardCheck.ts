import { useMutation } from "@tanstack/react-query";
import axiosInstance, { CustomAxiosRequestConfig } from "@utils/axios/axiosInstance";
import Cookies from "js-cookie";

type PasswordCheck = {
  password: string;
  accountType: string;
};

export const wardCheck = async (passwordCheck: PasswordCheck) => {
  // const response = await axiosInstance.post("/users/check-password", passwordCheck); 기존
  // 베드로 병원
  const response = await axiosInstance.post("/users/check-password", passwordCheck, {
    headers: { Authorization: `Bearer ${Cookies.get("accessTokenWard")}` },
    customHeader: true,
  } as CustomAxiosRequestConfig);
  return response.data;
};

export default function useWardCheck() {
  return useMutation({
    mutationFn: wardCheck,
    onSuccess: res => {
      console.log("병동 설정 로그인 성공");
      console.log(res.data);
    },
    onError: error => {
      console.error(error);
    },
  });
}
