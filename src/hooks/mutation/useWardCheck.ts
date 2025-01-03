import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@utils/axios/axiosInstance";

type PasswordCheck = {
  password: string;
  accountType: string;
};

export const wardCheck = async (passwordCheck: PasswordCheck) => {
  const response = await axiosInstance.post("/users/check-password", passwordCheck);
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
